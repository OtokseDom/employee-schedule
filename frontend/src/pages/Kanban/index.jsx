import React, { useEffect } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
import { useTaskHelpers } from "@/utils/taskHelpers";
import KanbanBoard from "./kanban";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectsStore } from "@/store/projects/projectsStore";
import { Skeleton } from "@/components/ui/skeleton";
export default function Kanban() {
	const { loading, setLoading } = useLoadContext();
	const { tasks } = useTasksStore();
	const { taskStatuses } = useTaskStatusesStore();
	const { projects, selectedProject, setSelectedProject } = useProjectsStore();
	const { fetchTasks, fetchTaskStatuses, fetchProjects } = useTaskHelpers();

	useEffect(() => {
		document.title = "Task Management | Board";
		if (!tasks || tasks.length === 0) fetchTasks();
		if (!taskStatuses || taskStatuses.length === 0) fetchTaskStatuses();
		if (!projects || projects.length === 0) fetchProjects();
		else if (!selectedProject) setSelectedProject(projects[0]);
	}, []);

	return (
		<div className="w-screen md:w-full">
			{/* <div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					dialogOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/> */}
			<div className="flex flex-row justify-between w-full">
				<div className="fixed top-8 left z-50 w-40">
					<Select
						onValueChange={(value) => {
							const selected = projects.find((project) => project.id === value);
							setSelectedProject(selected);
						}}
						value={selectedProject?.id || ""}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a project"></SelectValue>
						</SelectTrigger>
						<SelectContent>
							{Array.isArray(projects) && projects?.length > 0 ? (
								projects?.map((project) => (
									<SelectItem key={project?.id} value={project?.id}>
										{project?.title}
									</SelectItem>
								))
							) : (
								<SelectItem disabled>No projects available</SelectItem>
							)}
						</SelectContent>
					</Select>
				</div>
			</div>
			{loading ? (
				<div className="flex flex-row space-x-3 w-full max-h-[calc(100vh-9rem)] h-screen mt-14">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} index={i * 0.9} className="h-full w-full" />
					))}
				</div>
			) : (
				<KanbanBoard />
			)}
		</div>
	);
}
