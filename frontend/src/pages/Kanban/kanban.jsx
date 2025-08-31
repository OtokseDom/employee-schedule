import { useState, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Droppable from "./droppable";
import Draggable from "./draggable";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";

export default function KanbanBoard() {
	const { tasks } = useTasksStore(); // tasks object
	const { taskStatuses } = useTaskStatusesStore(); // statuses array
	const [columnOrder, setColumnOrder] = useState(taskStatuses.map((status) => status.id));
	// --- Build columns dynamically based on statuses ---
	const buildColumns = () => {
		const cols = {};
		taskStatuses.forEach((status) => {
			cols[status.id] = Object.values(tasks).filter((t) => t.status_id === status.id);
		});
		return cols;
	};

	// const [columns, setColumns] = useState(buildColumns);
	// Initialize columns once
	const [columns, setColumns] = useState(() => {
		const cols = {};
		taskStatuses.forEach((status) => {
			cols[status.id] = Object.values(tasks).filter((t) => t.status_id === status.id);
		});
		return cols;
	});
	// const columnOrder = taskStatuses.map((status) => status.id);

	const [activeCard, setActiveCard] = useState(null);
	const [sourceCol, setSourceCol] = useState(null);

	// Ghost preview state
	const [overCol, setOverCol] = useState(null);
	const [overId, setOverId] = useState(null);

	const sensors = useSensors(useSensor(PointerSensor));

	const findContainer = (cardId) => Object.keys(columns).find((col) => columns[col].some((c) => c.id === cardId));

	// --- Sync columns whenever tasks or taskStatuses change ---
	useEffect(() => {
		setColumns(buildColumns());
	}, [tasks, taskStatuses]);
	// useEffect(() => {
	// 	setColumns((prev) => {
	// 		const cols = { ...prev };
	// 		taskStatuses.forEach((status) => {
	// 			if (!cols[status.id]) cols[status.id] = [];
	// 		});
	// 		return cols;
	// 	});
	// }, [taskStatuses]);

	// --- Drag handlers ---
	const handleDragStart = ({ active }) => {
		const col = findContainer(active.id);
		if (!col) return;
		setSourceCol(col);
		const card = columns[col].find((c) => c.id === active.id);
		setActiveCard(card);
	};

	// While dragging, only update "hover state" for ghost
	// const handleDragOver = ({ active, over }) => {
	// 	if (!over) return;
	// 	const destCol = findContainer(over.id) || over.id;
	// 	setOverCol(destCol);
	// 	setOverId(over.id);
	// };
	const handleDragOver = ({ active, over }) => {
		if (!over) {
			setOverCol(null);
			setOverId(null);
			return;
		}

		// Try to find which column contains this item
		let destCol = findContainer(over.id);

		// If not found, assume over.id is a column ID itself
		if (!destCol) {
			destCol = over.id;
		}

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
			<div className="flex gap-4 p-4 h-full overflow-x-auto max-w-full">
				{columnOrder.map((statusId) => (
					<SortableContext key={statusId} items={columns[statusId]?.map((c) => c.id) || []} strategy={verticalListSortingStrategy}>
						<Droppable
							id={statusId}
							title={taskStatuses.find((s) => s.id === statusId)?.name || "Unknown"}
							cards={getDisplayCards(statusId)}
							activeCard={activeCard}
							overCol={overCol}
						/>
					</SortableContext>
				))}
			</div>

			<DragOverlay>{activeCard ? <Draggable id={activeCard.id} title={activeCard.title} /> : null}</DragOverlay>
		</DndContext>
	);
}
