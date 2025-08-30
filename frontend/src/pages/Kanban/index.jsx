import React, { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useTaskHelpers } from "@/utils/taskHelpers";
import KanbanBoard from "./kanban";
import TaskStatuses from "../TaskStatuses/List";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";

export default function Kanban() {
	const { setLoading } = useLoadContext();
	const { tasks, setTasks } = useTasksStore();
	const { taskStatuses, setTaskStatuses } = useTaskStatusesStore();
	const { fetchTasks, fetchTaskStatuses } = useTaskHelpers();
	const [isOpen, setIsOpen] = useState(false);

	// useEffect(() => {
	// 	if (!isOpen) setUpdateData({});
	// }, [isOpen]);
	useEffect(() => {
		document.title = "Task Management | Kanban Board";
		if (!tasks || tasks.length === 0) fetchTasks();
		if (!taskStatuses || taskStatuses.length === 0) fetchTaskStatuses();
	}, []);

	return (
		<div className="w-full py-4 ">
			{/* <div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					dialogOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/> */}
			<div>
				<h1 className="font-extrabold text-3xl">Kanban Board</h1>
				<p>View tasks by status</p>
			</div>
			<KanbanBoard />
		</div>
	);
}
