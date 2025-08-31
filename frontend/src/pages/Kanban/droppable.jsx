import { useDroppable } from "@dnd-kit/core";
import Draggable from "./draggable";

export default function Droppable({ id, title, cards = [], activeCard, overCol }) {
	const { setNodeRef, isOver } = useDroppable({ id });
	const isOverColumn = overCol === id; // 🔹 highlight logic
	return (
		<div
			ref={setNodeRef} // DnD detection
			className={`min-w-[20rem] h-fit p-4 rounded-lg border bg-card text-foreground flex flex-col transition-colors ${
				isOverColumn ? "border-blue-500" : "border-sidebar-accent"
			}`}
		>
			{/* Column title */}
			<h3 className="mb-3 font-semibold">{title}</h3>

			{/* Cards inside column */}
			{cards?.length === 0 ? (
				<div className="h-24 bg-muted border-2 border-dashed border-muted-foreground rounded flex items-center justify-center">Drop here</div>
			) : (
				cards.map((card) => (
					<Draggable
						key={card.id}
						id={card.id}
						title={card.title}
						project={card.project?.title}
						color={card.status?.color}
						className={activeCard?.id === card.id ? "opacity-40 border-2 border-dashed border-muted-foreground" : ""}
					/>
				))
			)}
		</div>
	);
}
