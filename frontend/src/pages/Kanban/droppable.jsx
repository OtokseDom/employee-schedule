import { useDroppable } from "@dnd-kit/core";
import Draggable from "./draggable";

export default function Droppable({ id, title, cards, activeCard }) {
	// Setup droppable area
	const { setNodeRef, isOver } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef} // Reference for DnD detection
			className={`min-w-[20rem] h-fit p-4 rounded border bg-card text-foreground flex flex-col transition-colors ${
				isOver ? "border-blue-500" : "border-sidebar-accent"
			}`}
		>
			{/* Column title */}
			<h3 className="mb-3 font-semibold">{title}</h3>

			{/* Cards inside column */}
			{cards.length === 0 ? (
				// Placeholder for empty column
				<div className="h-24 bg-muted border-2 border-dashed border-muted-foreground rounded flex items-center justify-center">Drop here</div>
			) : (
				cards.map((card) =>
					// Show ghost if this is the active card and it's in the source column
					activeCard?.id === card.id ? (
						<div key={card.id} className="p-6 my-2 rounded border border-dashed border-muted-foreground bg-muted/40"></div>
					) : (
						<Draggable key={card.id} id={card.id} title={card.title} />
					)
				)
			)}
		</div>
	);
}
