import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Droppable from "./droppable";
import Draggable from "./draggable";

export default function KanbanBoard() {
	const [columns, setColumns] = useState({
		todo: [
			{ id: "c1", title: "Card 1" },
			{ id: "c2", title: "Card 2" },
		],
		doing: [{ id: "c3", title: "Card 3" }],
		done: [{ id: "c4", title: "Card 4" }],
	});
	const [columnOrder] = useState(["todo", "doing", "done"]);
	const [activeCard, setActiveCard] = useState(null);

	const sensors = useSensors(useSensor(PointerSensor));

	const findContainer = (cardId) => Object.keys(columns).find((col) => columns[col].some((c) => c.id === cardId));

	const handleDragStart = ({ active }) => {
		const col = findContainer(active.id);
		if (!col) return;
		const card = columns[col].find((c) => c.id === active.id);
		setActiveCard(card);
	};

	const handleDragOver = ({ active, over }) => {
		if (!over) return;

		const sourceCol = findContainer(active.id);
		const destCol = findContainer(over.id) || over.id; // over may be column itself

		if (!sourceCol || !destCol || sourceCol === destCol) return;

		const movingCard = columns[sourceCol].find((c) => c.id === active.id);

		setColumns((prev) => {
			// remove from source
			const newSource = prev[sourceCol].filter((c) => c.id !== active.id);

			let newDest;
			if (Array.isArray(prev[destCol])) {
				// dropping on another card inside destCol
				const overIndex = prev[destCol].findIndex((c) => c.id === over.id);
				newDest =
					overIndex === -1 ? [...prev[destCol], movingCard] : [...prev[destCol].slice(0, overIndex), movingCard, ...prev[destCol].slice(overIndex)];
			} else {
				newDest = [movingCard]; // completely empty column
			}

			return {
				...prev,
				[sourceCol]: newSource,
				[destCol]: newDest,
			};
		});
	};

	const handleDragEnd = () => {
		setActiveCard(null);
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
			<div className="flex gap-4 p-4">
				{columnOrder.map((colId) => (
					<SortableContext key={colId} items={columns[colId].map((c) => c.id)} strategy={verticalListSortingStrategy}>
						<Droppable id={colId} title={colId.toUpperCase()} cards={columns[colId]} activeCard={activeCard} />
					</SortableContext>
				))}
			</div>

			<DragOverlay>{activeCard ? <Draggable id={activeCard.id} title={activeCard.title} /> : null}</DragOverlay>
		</DndContext>
	);
}
