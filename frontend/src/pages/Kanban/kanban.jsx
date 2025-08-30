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
		cancelled: [{ id: "c5", title: "Card 5" }],
		delayed: [{ id: "c6", title: "Card 6" }],
	});

	const [columnOrder] = useState(["todo", "doing", "done", "cancelled", "delayed"]);

	const [activeCard, setActiveCard] = useState(null);
	const [sourceCol, setSourceCol] = useState(null);

	// Ghost preview state
	const [overCol, setOverCol] = useState(null);
	const [overId, setOverId] = useState(null);

	const sensors = useSensors(useSensor(PointerSensor));

	const findContainer = (cardId) => Object.keys(columns).find((col) => columns[col].some((c) => c.id === cardId));

	// When drag starts
	const handleDragStart = ({ active }) => {
		const col = findContainer(active.id);
		if (!col) return;
		setSourceCol(col);
		const card = columns[col].find((c) => c.id === active.id);
		setActiveCard(card);
	};

	// While dragging, only update "hover state" for ghost
	const handleDragOver = ({ active, over }) => {
		if (!over) return;
		const destCol = findContainer(over.id) || over.id;
		setOverCol(destCol);
		setOverId(over.id);
	};

	// Finalize the drop
	const handleDragEnd = ({ active, over }) => {
		setActiveCard(null);
		setOverCol(null);
		setOverId(null);

		if (!over) return;

		const fromCol = findContainer(active.id);
		const toCol = findContainer(over.id) || over.id;

		if (!fromCol || !toCol) return;

		if (fromCol === toCol) {
			// Same column reorder
			const oldIndex = columns[fromCol].findIndex((c) => c.id === active.id);
			const newIndex = columns[toCol].findIndex((c) => c.id === over.id);
			if (oldIndex !== newIndex && newIndex !== -1) {
				setColumns((prev) => ({
					...prev,
					[fromCol]: arrayMove(prev[fromCol], oldIndex, newIndex),
				}));
			}
		} else {
			// Move across columns
			setColumns((prev) => {
				const newSource = prev[fromCol].filter((c) => c.id !== active.id);

				const overIndex = prev[toCol].findIndex((c) => c.id === over.id);
				const newDest =
					overIndex === -1 ? [...prev[toCol], activeCard] : [...prev[toCol].slice(0, overIndex), activeCard, ...prev[toCol].slice(overIndex)];

				return {
					...prev,
					[fromCol]: newSource,
					[toCol]: newDest,
				};
			});
		}
	};

	// --- NEW: ghost rendering logic ---
	const getDisplayCards = (colId) => {
		// no ghost needed if not hovering this column
		if (!activeCard || colId !== overCol) return columns[colId];

		// prevent showing duplicate in source column
		const filtered = colId === sourceCol ? columns[colId].filter((c) => c.id !== activeCard.id) : columns[colId];

		// find where to preview insert
		const overIndex = filtered.findIndex((c) => c.id === overId);

		if (overIndex === -1) {
			// preview at end
			return [...filtered, { ...activeCard, ghost: true }];
		}
		// preview at specific position
		return [...filtered.slice(0, overIndex), { ...activeCard, ghost: true }, ...filtered.slice(overIndex)];
	};

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
			<div className="flex gap-4 p-4 h-full">
				{columnOrder.map((colId) => (
					<SortableContext key={colId} items={columns[colId].map((c) => c.id)} strategy={verticalListSortingStrategy}>
						<Droppable
							id={colId}
							title={colId.toUpperCase()}
							cards={getDisplayCards(colId)} // ghost preview here
							activeCard={activeCard}
						/>
					</SortableContext>
				))}
			</div>

			<DragOverlay>{activeCard ? <Draggable id={activeCard.id} title={activeCard.title} /> : null}</DragOverlay>
		</DndContext>
	);
}
