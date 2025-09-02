import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Draggable({ id, title, isActive }) {
	// Setup drag-and-drop sorting for this card
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	// Convert transform into CSS for dragging animation
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isActive ? 0.5 : 1, // low opacity if active
	};

	return (
		<div
			ref={setNodeRef} // Needed for DnD detection
			style={style} // Apply dragging transform
			{...attributes} // Accessibility & keyboard
			{...listeners} // Mouse/touch drag events
			className={`group relative p-3 my-2 rounded shadow cursor-grab bg-accent text-foreground ${
				isActive ? "border border-dashed border-muted-foreground" : ""
			}`}
		>
			{/* Card title */}
			<span className="block w-full">{title}</span>
		</div>
	);
}
