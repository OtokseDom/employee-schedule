import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Check, Text } from "lucide-react";
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
				<Toggle
					variant="outline"
					size={"xxs"}
					aria-label="Toggle"
					className="rounded-full self-start opacity-0 group-hover:opacity-100 data-[state=on]:opacity-100 transition-all duration-200 ease-in-out"
				>
					<Check />
				</Toggle>
				<div className="w-full py-3 hover:cursor-grab active:cursor-grabbing" {...listeners} />
			</div>
			<div className="flex px-1 items-center justify-start gap-3">
				<div className="w-full">
					<p>{title}</p>
					<p>{description && <Text size={14} className="text-muted-foreground" />}</p>
				</div>
			</div>
		</div>
	);
};

export default Items;
