import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsTask } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { DataTableTasks } from "./data-table";
import { useLoadContext } from "@/contexts/LoadContextProvider";
// TODO: Task History Logs Panel
// TODO: Task discussion/comment section
export default function Tasks() {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const [users, setUsers] = useState([]);
	const [categories, setCategories] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	// const [deleted, setDeleted] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [showHistory, setShowHistory] = useState(false);
	// Add comments from users
	useEffect(() => {
		if (!isOpen) {
			setUpdateData({});
			setShowHistory(false);
		}
	}, [isOpen]);
	useEffect(() => {
		document.title = "Task Management | Tasks";
		fetchData();
		fetchSelection();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const taskResponse = await axiosClient.get("/task");
			setTasks(taskResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	const fetchSelection = async () => {
		try {
			setLoading(true);
			const userResponse = await axiosClient.get("/user");
			const categoryResponse = await axiosClient.get("/category");
			setCategories(categoryResponse.data.data);
			setUsers(userResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(`/task/${id}`);
			fetchData();
			showToast("Success!", "Task deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
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
				data={tasks}
				users={users}
				categories={categories}
				setTasks={setTasks}
				updateData={updateData}
				setUpdateData={setUpdateData}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				fetchData={fetchData}
				showHistory={showHistory}
				setShowHistory={setShowHistory}
			/>
		</div>
	);
}
