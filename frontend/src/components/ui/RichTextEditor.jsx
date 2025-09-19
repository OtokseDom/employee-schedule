import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Button } from "./button";
import { useEffect, useRef } from "react";
import axiosClient from "@/axios.client";
import { API } from "@/constants/api";
import { ImagePlus, List, ListOrdered } from "lucide-react";
// TODO: Show saved description on update
// TODO: Delete images in server when dialog closes without saving. When updating task with image, make sure to not affect the existing image if the user cancels the update.
export default function RichTextEditor({ value, onChange, orgName }) {
	const inputFile = useRef();
	const editor = useEditor({
		extensions: [
			StarterKit,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
			Image.extend({
				addOptions() {
					return {
						...this.parent?.(),
						allowBase64: true,
						inline: true,
						HTMLAttributes: {
							class: "rounded shadow max-w-full h-auto",
							draggable: true,
						},
					};
				},
			}),
		],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			handleDrop(view, event, _slice, moved) {
				if (moved) return false;
				const files = Array.from(event.dataTransfer.files);
				const imageFile = files.find((file) => file.type.startsWith("image/"));
				if (imageFile) {
					event.preventDefault();
					handleImageFile(imageFile, view);
					return true;
				}
				return false;
			},
			handlePaste(view, event) {
				const items = Array.from(event.clipboardData.items);
				const imageItem = items.find((item) => item.type.startsWith("image/"));
				if (imageItem) {
					const file = imageItem.getAsFile();
					if (file) {
						event.preventDefault();
						handleImageFile(file, view);
						return true;
					}
				}
				return false;
			},
		},
	});

	// Use refs to persist mapping across renders
	const blobToApiUrlMapRef = useRef(new Map()); // blobUrl -> apiUrl
	const apiUrlToBlobMapRef = useRef(new Map()); // apiUrl -> blobUrl
	const uploadingImagesRef = useRef(new Set()); // Track images currently being uploaded

	const handleImageFile = async (file, view = null) => {
		const previewUrl = URL.createObjectURL(file);

		// Mark this image as uploading to prevent deletion during replacement
		uploadingImagesRef.current.add(previewUrl);

		// 1. Insert preview node immediately
		if (editor) {
			editor.chain().focus().setImage({ src: previewUrl, "data-uploading": "true" }).run();
		} else if (view) {
			const { state, dispatch } = view;
			const { tr } = state;
			const node = state.schema.nodes.image.create({ src: previewUrl, "data-uploading": "true" });
			dispatch(tr.replaceSelectionWith(node));
		}

		try {
			// 2. Upload to backend
			const formData = new FormData();
			formData.append("image", file);

			const res = await axiosClient.post(API().task_upload_image(), formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			// 3. Fetch via axios with auth
			const imageResponse = await axiosClient.get(res.data.url, { responseType: "blob" });
			const finalBlobUrl = URL.createObjectURL(imageResponse.data);

			// store mapping so delete/edit can recognize both forms
			blobToApiUrlMapRef.current.set(finalBlobUrl, res.data.url); // final blob -> API url
			apiUrlToBlobMapRef.current.set(res.data.url, finalBlobUrl); // API url -> final blob

			// 4. Replace preview with final blob
			editor
				.chain()
				.focus()
				.command(({ tr, state }) => {
					state.doc.descendants((node, pos) => {
						if (node.type.name === "image" && node.attrs.src === previewUrl) {
							tr.setNodeMarkup(pos, undefined, {
								...node.attrs,
								src: finalBlobUrl,
								"data-uploading": null,
							});
						}
					});
					return true;
				})
				.run();

			// Remove from uploading set and clean up preview URL
			uploadingImagesRef.current.delete(previewUrl);
			URL.revokeObjectURL(previewUrl); // Clean up preview URL
		} catch (err) {
			console.error("Upload failed:", err);

			// 5. Remove failed blob image
			editor
				.chain()
				.focus()
				.command(({ tr, state }) => {
					state.doc.descendants((node, pos) => {
						const src = node.attrs.src;
						if (node.type.name === "image" && src === previewUrl) {
							tr.delete(pos, pos + node.nodeSize);
						}
					});
					return true;
				})
				.run();

			// Clean up failed upload
			uploadingImagesRef.current.delete(previewUrl);
			URL.revokeObjectURL(previewUrl);
		}
	};

	// Remove image from server when removed from editor
	useEffect(() => {
		if (!editor) return;

		let prevImages = [];

		const updateHandler = () => {
			const currentImages = [];

			// Get all current image sources from the editor
			const traverse = (node) => {
				if (!node) return;
				if (node.type === "image" && node.attrs?.src) {
					currentImages.push(node.attrs.src);
				}
				if (node.content) {
					node.content.forEach(traverse);
				}
			};

			traverse(editor.getJSON());

			// Find removed images by comparing with previous state
			const removedImages = prevImages.filter((src) => !currentImages.includes(src));

			// Delete removed images from server
			removedImages.forEach(async (removedSrc) => {
				// Skip if this image is currently being uploaded (preview being replaced)
				if (uploadingImagesRef.current.has(removedSrc)) {
					return;
				}

				// Skip blob URLs that don't have API mappings (these are temporary preview URLs)
				if (removedSrc.startsWith("blob:") && !blobToApiUrlMapRef.current.has(removedSrc)) {
					return;
				}

				// Check if this blob URL maps to an API URL
				const apiUrl = blobToApiUrlMapRef.current.get(removedSrc);

				if (apiUrl) {
					try {
						// Delete from server using the API URL
						await axiosClient.delete(API().task_delete_image(), {
							data: { url: apiUrl },
						});
						console.log(`Successfully deleted image: ${apiUrl}`);
					} catch (error) {
						console.error(`Failed to delete image ${apiUrl}:`, error);
					}

					// Clean up mappings
					blobToApiUrlMapRef.current.delete(removedSrc);
					apiUrlToBlobMapRef.current.delete(apiUrl);

					// Clean up any other blob URLs that map to the same API URL
					for (const [blobUrl, mappedApiUrl] of blobToApiUrlMapRef.current.entries()) {
						if (mappedApiUrl === apiUrl) {
							blobToApiUrlMapRef.current.delete(blobUrl);
						}
					}
				} else if (typeof removedSrc === "string" && removedSrc.startsWith("/api/v1/tasks/images/")) {
					// Handle case where image src is directly an API URL (for backwards compatibility)
					try {
						await axiosClient.delete(API().task_delete_image(), {
							data: { url: removedSrc },
						});
						console.log(`Successfully deleted image: ${removedSrc}`);
					} catch (error) {
						console.error(`Failed to delete image ${removedSrc}:`, error);
					}
				}

				// Revoke blob URL to free memory (only if not currently uploading)
				if (removedSrc.startsWith("blob:") && !uploadingImagesRef.current.has(removedSrc)) {
					URL.revokeObjectURL(removedSrc);
				}
			});

			// Update previous images list for next comparison
			prevImages = [...currentImages];
		};

		// Initial setup - get current images
		const currentImages = [];
		const traverse = (node) => {
			if (!node) return;
			if (node.type === "image" && node.attrs?.src) {
				currentImages.push(node.attrs.src);
			}
			if (node.content) {
				node.content.forEach(traverse);
			}
		};
		traverse(editor.getJSON());
		prevImages = [...currentImages];

		// Listen for editor updates
		editor.on("update", updateHandler);

		// Cleanup function
		return () => {
			editor.off("update", updateHandler);
		};
	}, [editor]);

	// Toolbar actions
	const addImage = () => inputFile.current.click();

	// Handle file input change
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) handleImageFile(file);
	};

	return (
		<div>
			{/* Toolbar */}
			<div className="flex flex-wrap gap-2 mb-2">
				<Button
					type="button"
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					variant={editor.isActive("bold") ? "default" : "outline"}
				>
					B
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					variant={editor.isActive("italic") ? "default" : "outline"}
				>
					I
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					variant={editor.isActive("underline") ? "default" : "outline"}
				>
					U
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					variant={editor.isActive("strike") ? "default" : "outline"}
				>
					S
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={() => editor.chain().focus().toggleHighlight().run()}
					variant={editor.isActive("highlight") ? "default" : "outline"}
				>
					H
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					variant={editor.isActive("bulletList") ? "default" : "outline"}
				>
					<List />
				</Button>
				<Button
					type="button"
					size="sm"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					variant={editor.isActive("orderedList") ? "default" : "outline"}
				>
					<ListOrdered />
				</Button>
				<Button type="button" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()} variant="outline">
					—
				</Button>
				<Button type="button" size="sm" onClick={addImage} variant="outline">
					<ImagePlus />
				</Button>
				<input type="file" accept="image/*" ref={inputFile} style={{ display: "none" }} onChange={handleImageUpload} />
			</div>
			{/* Editor */}
			<div className="border rounded w-full min-h-[200px] p-2 bg-background prose prose-sm max-w-none">
				<style>
					{`
                        .ProseMirror {
                            min-height: 180px;
                            height: 100%;
                            width: 100%;
                            outline: none;
                            background: transparent;
                            resize: vertical;
                            overflow-y: auto;
                            box-sizing: border-box;
                            white-space: pre-wrap;
                        }
                        .ProseMirror ul, .ProseMirror ol {
                            padding-left: 2rem;
                            margin: 0 0 1em 0;
                        }
                        .ProseMirror ul {
                            list-style-type: disc;
                        }
                        .ProseMirror ol {
                            list-style-type: decimal;
                        }
                        .ProseMirror li {
                            margin-bottom: 0.25em;
                        }
                        .ProseMirror img {
                            max-width: 100%;
                            height: auto;
                            cursor: move;
                        }
						.ProseMirror img[data-uploading="true"] {
							opacity: 0.5;
							position: relative;
						}
						.ProseMirror img[data-uploading="true"]::after {
							content: "⏳";
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							font-size: 24px;
						}
                    `}
				</style>
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
