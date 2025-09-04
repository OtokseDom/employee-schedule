import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

const Container = ({ id, children, title, onAddItem }) => {
	const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: "container",
		},
	});
	return (
		<div
			{...attributes}
			ref={setNodeRef}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={clsx(
				"min-w-[300px] h-fit max-h-[calc(100vh-9rem)] p-4 bg-card border border-accent rounded-xl flex flex-col",
				isDragging && "opacity-50"
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-start gap-3 mb-4">
				<Button variant="primary" className="p-2 text-xs" {...listeners}>
					<GripVertical />
				</Button>
				<div className="flex flex-col gap-y-1">
					<h1 className="text-foreground text-lg">{title}</h1>
				</div>
			</div>

			{/* Scrollable content */}
			<div className="flex-1 overflow-y-auto flex flex-col gap-y-4">{children}</div>

			{/* Fixed bottom button */}
			<div className="sticky bottom-0 bg-card pt-2">
				<Button variant="ghost" onClick={onAddItem} className="w-full">
					Add Item
				</Button>
			</div>
		</div>
	);
};

export default Container;
