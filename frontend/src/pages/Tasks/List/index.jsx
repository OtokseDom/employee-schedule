import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsTask } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { DataTableTasks } from "./data-table";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { API } from "@/constants/api";
import { flattenTasks } from "@/utils/taskHelpers";
// TODO: Task discussion/comment section
export default function Tasks() {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const [taskHistory, setTaskHistory] = useState([]);
	const [selectedTaskHistory, setSelectedTaskHistory] = useState([]);
	const [relations, setRelations] = useState([]);
	const [projects, setProjects] = useState([]);
	const [users, setUsers] = useState([]);
	const [categories, setCategories] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	// const [deleted, setDeleted] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [activeTab, setActiveTab] = useState(false);
	const [parentId, setParentId] = useState(null); //for adding subtasks from relations tab

	// Flatten tasks for datatable usage (also groups children below parent)
	const [tableData, setTableData] = useState([]);

	// Add comments from users
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
		fetchData();
		fetchSelection();
	}, []);
	useEffect(() => {
		setTableData(flattenTasks(tasks));
	}, [tasks]);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const taskResponse = await axiosClient.get(API().task());
			setTasks(taskResponse.data.data.tasks);
			setTaskHistory(taskResponse.data.data.task_history);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	const fetchSelection = async () => {
		try {
			setLoading(true);
			const projectResponse = await axiosClient.get(API().project());
			const userResponse = await axiosClient.get(API().user());
			const categoryResponse = await axiosClient.get(API().category());
			setProjects(projectResponse.data.data);
			setCategories(categoryResponse.data.data);
			setUsers(userResponse.data.data);
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
				columns={columnsTask({ tableData, handleDelete, setIsOpen, setUpdateData, taskHistory, setSelectedTaskHistory, setRelations })}
				data={tableData}
				taskHistory={taskHistory}
				selectedTaskHistory={selectedTaskHistory}
				relations={relations}
				setRelations={setRelations}
				setSelectedTaskHistory={setSelectedTaskHistory}
				projects={projects}
				users={users}
				categories={categories}
				updateData={updateData}
				setUpdateData={setUpdateData}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				fetchData={fetchData}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				parentId={parentId}
				setParentId={setParentId}
			/>
		</div>
	);
}
