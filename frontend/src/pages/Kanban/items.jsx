import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Check, GripVerticalIcon, MoreVerticalIcon, Text } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

const Items = ({ id, title, description }) => {
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
			<div className="w-full p-2 hover:cursor-grab active:cursor-grabbing" {...listeners} />
			<div className="flex px-1 items-center justify-start gap-3 group">
				<Toggle variant="outline" size={"xxs"} aria-label="Toggle" className="rounded-full self-start hidden group-hover:block data-[state=on]:block">
					<Check />
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
