import { useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Droppable from "./droppable";
import Draggable from "./draggable";
// TODO: FIX via DND-doc
export default function KanbanBoard() {
	// State to store cards in each column
	const [columns, setColumns] = useState({
		todo: [
			{ id: "c1", title: "Card 1" },
			{ id: "c2", title: "Card 2" },
		],
		doing: [{ id: "c3", title: "Card 3" }],
		done: [{ id: "c4", title: "Card 4" }],
	});

	// State to maintain the order of columns
	const [columnOrder] = useState(["todo", "doing", "done"]);

	// State to keep track of currently dragged card
	const [activeCard, setActiveCard] = useState(null);
	// Keep track of source column too
	const [sourceCol, setSourceCol] = useState(null);

	// Setup pointer sensor for drag events
	const sensors = useSensors(useSensor(PointerSensor));

	// Helper: find which column a card belongs to
	const findContainer = (cardId) => Object.keys(columns).find((col) => columns[col].some((c) => c.id === cardId));

	// When drag starts, store the dragged card's info
	const handleDragStart = ({ active }) => {
		const col = findContainer(active.id);
		if (!col) return;
		setSourceCol(col);
		const card = columns[col].find((c) => c.id === active.id);
		setActiveCard(card);
	};

	// When dragging over another column or card
	const handleDragOver = ({ active, over }) => {
		if (!over) return;

		const sourceCol = findContainer(active.id); // Original column
		const destCol = findContainer(over.id) || over.id; // Destination column

		if (!sourceCol || !destCol) return;

		// Moving within the same column
		if (sourceCol === destCol) {
			const oldIndex = columns[sourceCol].findIndex((c) => c.id === active.id);
			const newIndex = columns[destCol].findIndex((c) => c.id === over.id);

			if (oldIndex !== newIndex && newIndex !== -1) {
				setColumns((prev) => ({
					...prev,
					[sourceCol]: arrayMove(prev[sourceCol], oldIndex, newIndex),
				}));
			}
			return;
		}

		// Update columns: remove from source, insert into destination
		setColumns((prev) => {
			// remove from source column
			const newSource = prev[sourceCol].filter((c) => c.id !== active.id);

			let newDest;
			if (Array.isArray(prev[destCol])) {
				// Insert into specific index if over a card
				const overIndex = prev[destCol].findIndex((c) => c.id === over.id);
				newDest =
					overIndex === -1
						? [...prev[destCol], activeCard] // Add to end
						: [...prev[destCol].slice(0, overIndex), activeCard, ...prev[destCol].slice(overIndex)]; // Insert before
			} else {
				newDest = [activeCard]; // Column is empty
			}

			return {
				...prev,
				[sourceCol]: newSource,
				[destCol]: newDest,
			};
		});
	};

	// When drag ends, clear active card
	const handleDragEnd = () => {
		setActiveCard(null);
	};

	return (
		// Main drag-and-drop context
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
			{/* Kanban columns */}
			<div className="flex gap-4 p-4 h-full">
				{columnOrder.map((colId) => (
					<SortableContext key={colId} items={columns[colId].map((c) => c.id)} strategy={verticalListSortingStrategy}>
						<Droppable id={colId} title={colId.toUpperCase()} cards={columns[colId]} activeCard={activeCard} />
					</SortableContext>
				))}
			</div>

			{/* Drag overlay shows the card being dragged */}
			<DragOverlay>{activeCard ? <Draggable id={activeCard.id} title={activeCard.title} /> : null}</DragOverlay>
		</DndContext>
	);
}
