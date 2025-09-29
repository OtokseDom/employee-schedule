import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Button } from "./button";
import { useEffect, useRef } from "react";
import { List, ListOrdered } from "lucide-react";
export default function RichTextEditor({ value, onChange }) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Table.configure({ resizable: true }),
			TableRow,
			TableHeader,
			TableCell,
		],
		content: value,
		onUpdate: ({ editor }) => {
			// Replace all blob URLs in HTML with their mapped API URLs before saving
			let html = editor.getHTML();
			// Replace <img src="blob:..."> with <img src="api-url">
			html = html.replace(/<img([^>]+)src=["'](blob:[^"']+)["']/g, (match, pre, blobUrl) => {
				const apiUrl = blobToApiUrlMapRef.current.get(blobUrl);
				if (apiUrl) {
					return `<img${pre}src="${apiUrl}"`;
				}
				return match;
			});
			onChange(html);
		},
	});

	// Populate richtext editor on update
	useEffect(() => {
		if (editor && value !== undefined && value !== editor.getHTML()) {
			editor.commands.setContent(value || "");
		}
	}, [value, editor]);

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
                    `}
				</style>
				<EditorContent editor={editor} />
			</div>
		</div>
	);
}
