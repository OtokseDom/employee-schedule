import { useEffect, useState } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, KeyboardSensor, closestCorners } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Container from "./container";
import Items from "./items";
import debounce from "lodash.debounce";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
import { useProjectsStore } from "@/store/projects/projectsStore";
import { useKanbanColumnsStore } from "@/store/kanbanColumns/kanbanColumnsStore";
import { API } from "@/constants/api";
import axiosClient from "@/axios.client";

// TODO: Update kanbanColumns on container move
// TODO: Update task on move
// TODO: open details on click
// TODO: Add task on selected status
// TODO: Status menu - sorting options
export default function KanbanBoard() {
	const { tasks } = useTasksStore();
	const { taskStatuses } = useTaskStatusesStore();
	const { selectedProject } = useProjectsStore();
	const { kanbanColumns } = useKanbanColumnsStore();
	const [containers, setContainers] = useState([]);

	useEffect(() => {
		if (!selectedProject?.id || !kanbanColumns?.length || !taskStatuses?.length) return;

		// filter kanban columns for the selected project
		const projectColumns = kanbanColumns.filter((col) => col.project_id === selectedProject.id).sort((a, b) => a.position - b.position); // enforce ordering

		const mapped = projectColumns
			.map((col) => {
				const status = taskStatuses.find((s) => s.id === col.task_status_id);
				if (!status) return null; // skip if no matching status

				return {
					id: `container-${status.id}`, // string
					column: col.id,
					title: status.name,
					color: status.color,
					position: col.position,
					items: tasks
						.filter((task) => task.status_id === status.id && task.project_id === selectedProject.id)
						.map((task) => ({
							id: `item-${task.id}`,
							title: task.title,
							description: task.description,
						})),
				};
			})
			.filter(Boolean);

		setContainers(mapped);
	}, [taskStatuses, tasks, selectedProject]);

	const [activeId, setActiveId] = useState(null);
	const [currentContainerId, setCurrentContainerId] = useState();
	const [containerName, setContainerName] = useState("");
	const [itemName, setItemName] = useState("");
	const [showAddContainerModal, setShowAddContainerModal] = useState(false);
	const [showAddItemModal, setShowAddItemModal] = useState(false);

	// Find the value of the items
	function findValueOfItems(id, type) {
		if (type === "container") {
			return containers.find((item) => item.id === id);
		}
		if (type === "item") {
			return containers.find((container) => container.items.find((item) => item.id === id));
		}
	}

	/* -------------------------------------------------------------------------- */
	/*                                 DND handlers                               */
	/* -------------------------------------------------------------------------- */
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = ({ active }) => {
		const { id } = active;
		setActiveId(id);
	};

	const handleDragMove = ({ active, over }) => {
		// Handle item sorting
		if (active.id.toString().includes("item") && over?.id.toString().includes("item") && active && over && active.id !== over.id) {
			// Find the active container and over container
			const activeContainer = findValueOfItems(active.id, "item");
			const overContainer = findValueOfItems(over.id, "item");

			// If the active and over container is undefined, return
			if (!activeContainer || !overContainer) return;

			// Find the active and over container index
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

			// Find the active and over item index
			const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id);
			const overItemIndex = overContainer.items.findIndex((item) => item.id === over.id);

			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				let newItems = [...containers];
				newItems[activeContainerIndex].items = arrayMove(newItems[activeContainerIndex].items, activeItemIndex, overItemIndex);

				setContainers(newItems);
			} else {
				// In different container
				let newItems = [...containers];
				const [removedItem] = newItems[activeContainerIndex].items.splice(activeItemIndex, 1);
				newItems[overContainerIndex].items.splice(overItemIndex, 0, removedItem);
				setContainers(newItems);
			}
		}

		// Handling Item Drop into a container
		if (active.id.toString().includes("item") && over?.id.toString().includes("container") && active && over && active.id !== over.id) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, "item");
			const overContainer = findValueOfItems(over.id, "container");

			// If the active or over container is undefined, return
			if (!activeContainer || !overContainer) return;

			// Find the index of active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

			// Find the index of the active item in the active container
			const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

			// Remove the active item from the active container and add it to the over container
			let newItems = [...containers];
			const [removedItem] = newItems[activeContainerIndex].items.splice(activeItemIndex, 1);
			newItems[overContainerIndex].items.push(removedItem);
			setContainers(newItems);
		}
	};
	// Wrap with debounce (10ms delay)
	const debouncedHandleDragMove = debounce(handleDragMove, 10);

	const handleDragEnd = async ({ active, over }) => {
		setActiveId(null);

		// Handling Container Sorting
		if (active.id.toString().includes("container") && over?.id.toString().includes("container") && active && over && active.id !== over.id) {
			const activeContainerIndex = containers.findIndex((c) => c.id === active.id);
			const overContainerIndex = containers.findIndex((c) => c.id === over.id);

			if (activeContainerIndex === -1 || overContainerIndex === -1) return;

			// 2️⃣ Optimistically update the state locally
			const newContainers = arrayMove([...containers], activeContainerIndex, overContainerIndex);
			setContainers(newContainers);

			const activeContainer = containers[activeContainerIndex];
			const overContainer = containers[overContainerIndex];
			try {
				const kanbanColumnId = parseInt(activeContainer.column);
				// Call backend API to swap positions
				const res = await axiosClient.patch(API().kanban_column(kanbanColumnId), {
					position: overContainer.position, // send the new position
				});
				// Re-map backend columns into your DnD containers format
				const projectColumns = res.data.data.filter((col) => col.project_id === selectedProject.id).sort((a, b) => a.position - b.position);

				const mapped = projectColumns
					.map((col) => {
						const status = taskStatuses.find((s) => s.id === col.task_status_id);
						if (!status) return null;

						return {
							id: `container-${status.id}`,
							column: col.id,
							title: status.name,
							color: status.color,
							position: col.position,
							items: tasks
								.filter((task) => task.status_id === status.id && task.project_id === selectedProject.id)
								.map((task) => ({
									id: `item-${task.id}`,
									title: task.title,
									description: task.description,
								})),
						};
					})
					.filter(Boolean);

				setContainers(mapped);
			} catch (error) {
				console.error("Failed to swap columns:", error);
			}
			/* ---------------------------- FRONTEND SORTING ---------------------------- */
			// Find the index of the active and over container
			// const activeContainerIndex = containers.findIndex((container) => container.id === active.id);
			// const overContainerIndex = containers.findIndex((container) => container.id === over.id);
			// // Swap the active and over container
			// let newItems = [...containers];
			// newItems = arrayMove(newItems, activeContainerIndex, overContainerIndex);
			// setContainers(newItems);
		}

		// Handling item Sorting
		if (active.id.toString().includes("item") && over?.id.toString().includes("item") && active && over && active.id !== over.id) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, "item");
			const overContainer = findValueOfItems(over.id, "item");

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return;
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);
			const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id);

			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				let newItems = [...containers];
				newItems[activeContainerIndex].items = arrayMove(newItems[activeContainerIndex].items, activeitemIndex, overitemIndex);
				setContainers(newItems);
			} else {
				// In different containers
				let newItems = [...containers];
				const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1);
				newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
				setContainers(newItems);
			}
		}
		// Handling item dropping into Container
		if (active.id.toString().includes("item") && over?.id.toString().includes("container") && active && over && active.id !== over.id) {
			// Find the active and over container
			const activeContainer = findValueOfItems(active.id, "item");
			const overContainer = findValueOfItems(over.id, "container");

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return;
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

			let newItems = [...containers];
			const [removeditem] = newItems[activeContainerIndex].items.splice(activeitemIndex, 1);
			newItems[overContainerIndex].items.push(removeditem);
			setContainers(newItems);
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragMove={debouncedHandleDragMove}
			onDragEnd={handleDragEnd}
		>
			<div className="flex gap-4 py-4 mt-14 h-full">
				<SortableContext items={containers.map((i) => i.id)}>
					{containers.map((container) => (
						<Container
							key={container.id}
							id={container.id}
							title={container.title}
							color={container.color}
							onAddItem={() => {
								setShowAddItemModal(true);
								setCurrentContainerId(container.id);
							}}
						>
							<SortableContext items={container.items.map((i) => i.id)}>
								{container.items.length === 0 && (
									<div className="py-24 text-sm text-muted-foreground border-2 border-dashed rounded-md text-center cursor-default">
										Drop items here
									</div>
								)}
								<div className="flex items-start flex-col gap-y-4">
									{container.items.map((item) => (
										<Items key={item.id} id={item.id} title={item.title} description={item.description} />
									))}
								</div>
							</SortableContext>
						</Container>
					))}
				</SortableContext>
			</div>
		</DndContext>
	);
}
