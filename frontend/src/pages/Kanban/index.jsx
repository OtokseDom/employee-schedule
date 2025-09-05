import React, { useEffect } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
import { useTaskHelpers } from "@/utils/taskHelpers";
import KanbanBoard from "./kanban";
export default function Kanban() {
	const { setLoading } = useLoadContext();
	const { tasks } = useTasksStore();
	const { taskStatuses } = useTaskStatusesStore();
	const { fetchTasks, fetchTaskStatuses } = useTaskHelpers();

	useEffect(() => {
		document.title = "Task Management | Board";
		if (!tasks || tasks.length === 0) fetchTasks();
		if (!taskStatuses || taskStatuses.length === 0) fetchTaskStatuses();
	}, []);

	return (
		<div className="w-screen md:w-full">
			{/* <div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					dialogOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/> */}
			<div>
				<h1 className=" font-extrabold text-3xl">Board</h1>
				<p>View list of all tasks by Project</p>
			</div>
			<KanbanBoard />
		</div>
	);
}
