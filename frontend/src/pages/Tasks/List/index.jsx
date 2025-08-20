import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsTask } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { DataTableTasks } from "./data-table";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { API } from "@/constants/api";
import { flattenTasks } from "@/utils/taskHelpers";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useUsersStore } from "@/store/users/usersStore";
import { useProjectsStore } from "@/store/projects/projectsStore";
import { useCategoriesStore } from "@/store/categories/categoriesStore";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
// TODO: Task discussion/comment section
export default function Tasks() {
	const { loading, setLoading } = useLoadContext();
	const { tasks, setTasks, setTaskHistory, setRelations, setActiveTab } = useTasksStore();
	const { users, setUsers } = useUsersStore();
	const { taskStatuses, setTaskStatuses } = useTaskStatusesStore();
	const { projects, setProjects } = useProjectsStore();
	const { categories, setCategories } = useCategoriesStore();
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [parentId, setParentId] = useState(null); //for adding subtasks from relations tab

	// Flatten tasks for datatable usage (also groups children below parent)
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		if (!isOpen) {
			setUpdateData({});
			setRelations({});
			setActiveTab("update");
			setParentId(null);
		}
	}, [isOpen]);

	useEffect(() => {
		document.title = "Task Management | Tasks";
		if (!taskStatuses || taskStatuses.length === 0) fetchTaskStatuses();
		if (!projects || projects.length === 0) fetchProjects();
		if (!users || users.length === 0) fetchUsers();
		if (!categories || categories.length === 0) fetchCategories();
		if (!tasks || tasks.length === 0) fetchData();
	}, []);

	useEffect(() => {
		setTableData(flattenTasks(tasks));
	}, [tasks]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const taskResponse = await axiosClient.get(API().task());
			setTasks(taskResponse.data.data.tasks);
			setTaskHistory(taskResponse.data.data.task_history);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchTaskStatuses = async () => {
		setLoading(true);
		try {
			const taskStatusResponse = await axiosClient.get(API().task_status());
			setTaskStatuses(taskStatusResponse?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchProjects = async () => {
		setLoading(true);
		try {
			const projectResponse = await axiosClient.get(API().project());
			setProjects(projectResponse?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchUsers = async () => {
		setLoading(true);
		try {
			const userResponse = await axiosClient.get(API().user());
			setUsers(userResponse?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchCategories = async () => {
		setLoading(true);
		try {
			const categoryResponse = await axiosClient.get(API().category());
			setCategories(categoryResponse?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(API().task(id));
			// needs to remove all children tasks as well
			fetchData();
			showToast("Success!", "Task deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	return (
		<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
			<div>
				<h1 className=" font-extrabold text-3xl">Tasks</h1>
				<p>View list of all tasks</p>
			</div>
			<DataTableTasks
				columns={columnsTask({ handleDelete, setIsOpen, setUpdateData })}
				data={tableData}
				updateData={updateData}
				setUpdateData={setUpdateData}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				parentId={parentId}
				setParentId={setParentId}
				fetchData={fetchData}
			/>
		</div>
	);
}
