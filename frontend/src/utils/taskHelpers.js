// src/utils/taskHelpers.js
import axiosClient from "@/axios.client";
import { API } from "@/constants/api";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useCategoriesStore } from "@/store/categories/categoriesStore";
import { useDashboardStore } from "@/store/dashboard/dashboardStore";
import { useProjectsStore } from "@/store/projects/projectsStore";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
import { useUserStore } from "@/store/user/userStore";
import { useUsersStore } from "@/store/users/usersStore";

export const useTaskHelpers = () => {
	const { setLoading } = useLoadContext();
	const { projectFilter, setProjectFilter, userFilter, setUserFilter } = useDashboardStore();
	const { setTasks, setTaskHistory, setOptions, setSelectedUser } = useTasksStore();
	const { projects, setProjects } = useProjectsStore();
	const { users, setUsers } = useUsersStore();
	const { setCategories } = useCategoriesStore();
	const { setTaskStatuses } = useTaskStatusesStore();
	const { profileProjectFilter, setProfileProjectFilter } = useUserStore();

	const fetchTasks = async () => {
		setLoading(true);
		try {
			const res = await axiosClient.get(API().task());
			setTasks(res?.data?.data?.tasks);
			setTaskHistory(res?.data?.data?.task_history);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchProjects = async () => {
		setLoading(true);
		try {
			const res = await axiosClient.get(API().project());
			setProjects(res?.data?.data);
			if (res.data.data.length !== projectFilter.length || res.data.data.length !== profileProjectFilter.length) {
				const mappedProjects = res.data.data.map((project) => ({ value: project.id, label: project.title }));
				// Used in user profile
				setProfileProjectFilter(mappedProjects);
				// Used in dashboard
				setProjectFilter(mappedProjects);
			}
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await axiosClient.get(API().user());
			setUsers(res?.data?.data);
			// Used in dashboard
			if (res.data.data.length !== userFilter.length) {
				const mappedUsers = res.data.data.map((user) => ({ value: user.id, label: user.name }));
				setUserFilter(mappedUsers);
			}
			// Used in calendar
			setSelectedUser(res?.data?.data[0]);
			setOptions(res?.data?.data.map((u) => ({ value: u.id, label: u.name })));
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const res = await axiosClient.get(API().category());
			setCategories(res?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchTaskStatuses = async () => {
		setLoading(true);
		try {
			const res = await axiosClient.get(API().task_status());
			setTaskStatuses(res?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	return {
		fetchTasks,
		fetchProjects,
		fetchUsers,
		fetchCategories,
		fetchTaskStatuses,
	};
};

export function flattenTasks(tasks) {
	// Get IDs of all children
	const childIds = new Set();
	tasks.forEach((task) => {
		task.children?.forEach((child) => {
			childIds.add(child.id);
		});
	});

	// Filter only tasks NOT in children list (top-level only)
	const topLevelTasks = tasks.filter((task) => !childIds.has(task.id));

	const flatten = (taskList, depth = 0) => {
		let flat = [];
		for (const task of taskList) {
			flat.push({ ...task, depth });
			if (task.children?.length) {
				flat = flat.concat(flatten(task.children, depth + 1));
			}
		}
		return flat;
	};

	return flatten(topLevelTasks);
}

export const statusColors = {
	yellow: "bg-yellow-100 border border-yellow-800 border-2 text-yellow-800",
	blue: "bg-blue-100 border border-blue-800 border-2 text-blue-800",
	orange: "bg-orange-100 border border-orange-800 border-2 text-orange-800",
	green: "bg-green-100 border border-green-800 border-2 text-green-800",
	red: "bg-red-100 border border-red-800 border-2 text-red-800",
	purple: "bg-purple-100 border border-purple-800 border-2 text-purple-800",
	gray: "bg-gray-100 border border-gray-800 border-2 text-gray-800",
};
