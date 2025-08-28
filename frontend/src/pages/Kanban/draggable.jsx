// Card component: represents a single task in the Kanban board
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable"; // Enables drag-and-drop sorting
import { CSS } from "@dnd-kit/utilities";

export default function Draggable({ id, title }) {
	// Setup drag-and-drop behavior
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef} // Needed for drag-and-drop
			style={style} // Apply drag-and-drop styles
			{...attributes}
			{...listeners}
			className="group relative p-3 my-2 rounded shadow cursor-grab bg-accent text-foreground"
		>
			<span className="block w-full">{title}</span>
		</div>
	);
}
