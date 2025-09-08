import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { statusColors } from "@/utils/taskHelpers";

const Container = ({ id, children, title, color, onAddItem }) => {
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
				"min-w-[350px] h-fit min-h-[50vh] max-h-[calc(100vh-9rem)] p-4 bg-card border border-accent rounded-xl flex flex-col",
				isDragging && "opacity-50"
			)}
		>
			{/* Drag Handle */}
			<div className="w-full py-2 hover:cursor-grab active:cursor-grabbing" {...listeners} />
			{/* Header */}
			<div className="flex items-center justify-between gap-3 mb-4">
				<div className="flex flex-col w-full gap-y-1">
					<h1 className={`px-2 py-1 text-center whitespace-nowrap rounded text-md ${statusColors[color?.toLowerCase()] || ""}`}>{title}</h1>
				</div>
				{/* Drag Handle on empty space */}
				<div className="w-full p-3 hover:cursor-grab active:cursor-grabbing" {...listeners} />
				<Button variant="ghost">
					<MoreHorizontal />
				</Button>
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
