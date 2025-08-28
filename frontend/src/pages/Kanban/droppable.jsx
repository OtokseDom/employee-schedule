import { useDroppable } from "@dnd-kit/core";
import Draggable from "./draggable";

export default function Droppable({ id, title, cards, activeCard }) {
	const { setNodeRef, isOver } = useDroppable({ id });

	return (
		<div
			ref={setNodeRef}
			className={`min-w-[20rem] p-4 rounded border bg-card text-foreground flex flex-col transition-colors ${
				isOver ? "border-blue-500" : "border-sidebar-accent"
			}`}
		>
			<h3 className="mb-3 font-semibold">{title}</h3>

			{cards.length === 0 ? (
				<div className="h-24 bg-muted border-2 border-dashed border-muted-foreground rounded flex items-center justify-center">Drop here</div>
			) : (
				cards.map((card) =>
					activeCard?.id === card.id ? (
						// 🔥 ghost card placeholder
						<div key={card.id} className="p-3 my-2 rounded border border-dashed border-muted-foreground bg-muted/40">
							Ghost
						</div>
					) : (
						<Draggable key={card.id} id={card.id} title={card.title} />
					)
				)
			)}
		</div>
	);
}
