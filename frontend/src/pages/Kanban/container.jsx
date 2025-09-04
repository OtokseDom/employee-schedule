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
			className={clsx("max-w-[350px] w-full h-fit p-4 bg-card border border-accent rounded-xl flex flex-col gap-y-4", isDragging && "opacity-50")}
		>
			<div className="flex items-center justify-start gap-3">
				<Button variant="primary" className="p-2 text-xs" {...listeners}>
					<GripVertical />
				</Button>
				<div className="flex flex-col gap-y-1">
					<h1 className="text-foreground text-xl">{title}</h1>
				</div>
			</div>

			{children}
			<Button variant="ghost" onClick={onAddItem}>
				Add Item
			</Button>
		</div>
	);
};

export default Container;
