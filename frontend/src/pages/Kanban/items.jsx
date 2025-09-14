import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Check, GripVertical, Text } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const Items = ({ id, title, description, position }) => {
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
				"p-2 bg-sidebar-accent shadow-md rounded-md w-full border border-transparent hover:border-foreground cursor-pointer group",
				isDragging && "opacity-50"
			)}
		>
			<div className="flex flex-row w-full">
				<div className="w-full py-1 hover:cursor-grab active:cursor-grabbing" {...listeners}>
					<GripVertical size={16} />
				</div>
			</div>
			<div className="flex justify-start">
				<Toggle variant="default" size="none" aria-label="Toggle" className="group h-fit py-2">
					<div className="w-0 group-hover:w-7 group-data-[state=on]:w-7 transition-all duration-500 ease-in-out">
						<Check className="aspect-square rounded-full border border-foreground opacity-0 group-hover:opacity-100 group-data-[state=on]:opacity-100 group-data-[state=on]:bg-green-500 transition-all duration-500 ease-in-out" />
					</div>
				</Toggle>
				<div className="w-full">
					<p>{title}</p>
					<p>{description && <Text size={14} className="text-muted-foreground" />}</p>
				</div>
			</div>
		</div>
	);
};

export default Items;
