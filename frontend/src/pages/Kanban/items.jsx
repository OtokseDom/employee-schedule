import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { GripVerticalIcon } from "lucide-react";

const Items = ({ id, title }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: "item",
		},
	});
	return (
		<div
			ref={setNodeRef}
			{...attributes}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={clsx(
				"p-2 bg-sidebar-accent shadow-md rounded-md w-full border border-transparent hover:border-foreground cursor-pointer",
				isDragging && "opacity-50"
			)}
		>
			<div className="flex items-center justify-start gap-3">
				<Button variant="primary" className="p-2 text-xs" {...listeners}>
					<GripVerticalIcon />
				</Button>
				{title}
			</div>
		</div>
	);
};

export default Items;
