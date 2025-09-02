import { useDroppable } from "@dnd-kit/core";
import Draggable from "./draggable";

export default function Droppable({ id, title, cards, activeCard }) {
	// Setup droppable area
	const { setNodeRef, isOver } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef} // Reference for DnD detection
			className={`min-w-[20rem] max-h-[calc(100vh-200px)] h-fit overflow-y-auto p-4 rounded border bg-card text-foreground flex flex-col transition-colors ${
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
				cards.map((card) => (
					<Draggable
						key={card.id} // keep key as raw id
						id={card.id}
						title={card.title}
						isActive={activeCard?.id === card.id} // pass prop for ghost styling
					/>
				))
			)}
		</div>
	);
}
