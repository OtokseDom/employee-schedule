import React, { useEffect, useState } from "react";
import { columnsTask } from "./columns";
import { DataTableTasks } from "./data-table";
import { flattenTasks, useTaskHelpers } from "@/utils/taskHelpers";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useUsersStore } from "@/store/users/usersStore";
import { useProjectsStore } from "@/store/projects/projectsStore";
import { useCategoriesStore } from "@/store/categories/categoriesStore";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
// TODO: Task discussion/comment section
export default function Tasks() {
	const { tasks, tasksLoaded, setRelations, setActiveTab } = useTasksStore();
	const { users } = useUsersStore();
	const { taskStatuses } = useTaskStatusesStore();
	const { projects, projectsLoaded } = useProjectsStore();
	const { categories } = useCategoriesStore();
	// Fetch Hooks
	const { fetchTasks, fetchProjects, fetchUsers, fetchCategories, fetchTaskStatuses } = useTaskHelpers();
	const [isOpen, setIsOpen] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [updateData, setUpdateData] = useState({});
	const [parentId, setParentId] = useState(null); //for adding subtasks from relations tab
	const [projectId, setProjectId] = useState(null); //for adding subtasks from relations tab
	const [hasRelation, setHasRelation] = useState(false);

	// Flatten tasks for datatable usage (also groups children below parent)
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		if (!isOpen) {
			setUpdateData({});
			setRelations({});
			setActiveTab("update");
			setParentId(null);
			setProjectId(null);
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) setHasRelation(false);
	}, [isOpen]);

	useEffect(() => {
		document.title = "Task Management | Tasks";
		if (!taskStatuses || taskStatuses.length === 0) fetchTaskStatuses();
		if (!users || users.length === 0) fetchUsers();
		if (!categories || categories.length === 0) fetchCategories();
		if ((!tasks || tasks.length === 0) && !tasksLoaded) fetchTasks();
		if ((!projects || projects.length === 0) && !projectsLoaded) fetchProjects();
	}, []);

	useEffect(() => {
		if (tasks !== null) setTableData(flattenTasks(tasks));
	}, [tasks]);

	// TODO: bulk update status, delete, assign user, category, project
	return (
		<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
			<div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					dialogOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/>
			<div>
				<h1 className=" font-extrabold text-3xl">Tasks</h1>
				<p>View list of all tasks</p>
			</div>
			{/* Updated table to fix dialog per column issue */}
			{(() => {
				const {
					columnsTask: taskColumns,
					dialog,
					bulkDialog,
				} = columnsTask({
					dialogOpen,
					setDialogOpen,
					hasRelation,
					setHasRelation,
					setIsOpen,
					setUpdateData,
				});
				return (
					<>
						<DataTableTasks
							columns={taskColumns}
							data={tableData}
							updateData={updateData}
							setUpdateData={setUpdateData}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							parentId={parentId}
							setParentId={setParentId}
							projectId={projectId}
							setProjectId={setProjectId}
							fetchData={fetchTasks}
						/>
						{dialog}
						{bulkDialog}
					</>
				);
			})()}
		</div>
	);
}
