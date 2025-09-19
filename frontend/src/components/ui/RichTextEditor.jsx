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

export default function RichTextEditor({ value, onChange, orgName }) {
	const inputFile = useRef();

	// Helper to upload and insert image
	const handleImageFile = async (file, view = null) => {
		const formData = new FormData();
		formData.append("image", file);
		try {
			const res = await axiosClient.post(API().task_upload_image(), formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			if (res.data.url) {
				if (editor) {
					editor.chain().focus().setImage({ src: res.data.url }).run();
				} else if (view) {
					const { state, dispatch } = view;
					const { tr } = state;
					const node = state.schema.nodes.image.create({ src: res.data.url });
					dispatch(tr.replaceSelectionWith(node));
				}
			}
		} catch {
			alert("Image upload failed");
		}
	};

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
						allowBase64: false,
						inline: false,
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

	// Toolbar actions
	const addImage = () => inputFile.current.click();

	// Handle file input change
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) handleImageFile(file);
	};

	// Remove image from server when removed from editor
	useEffect(() => {
		if (!editor) return;
		let prevImages = [];
		const updateHandler = () => {
			const images = [];
			const traverse = (node) => {
				if (!node) return;
				if (node.type === "image" && node.attrs?.src) images.push(node.attrs.src);
				if (node.content) node.content.forEach(traverse);
			};
			traverse(editor.getJSON());
			const removed = prevImages.filter((src) => !images.includes(src));
			removed.forEach(async (src) => {
				if (src && src.startsWith("/api/tasks/image/")) {
					try {
						await axiosClient.delete(API().task_delete_image(), { data: { url: src } });
					} catch {}
				}
			});
			prevImages = images;
		};
		editor.on("update", updateHandler);
		return () => editor.off("update", updateHandler);
	}, [editor]);

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
                    `}
				</style>
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
