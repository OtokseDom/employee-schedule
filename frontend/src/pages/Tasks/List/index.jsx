import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsTask } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { DataTableTasks } from "./data-table";
import { useLoadContext } from "@/contexts/LoadContextProvider";
// TODO: Task History Logs Screen for Admin
export default function Tasks() {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
	useEffect(() => {
		document.title = "Task Management | Tasks";
		fetchData();
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
		<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
			<div>
				<h1 className=" font-extrabold text-3xl">Tasks</h1>
				<p>View list of all tasks</p>
			</div>
			<DataTableTasks
				columns={columnsTask({ handleDelete, setIsOpen, setUpdateData })}
				data={tasks}
				setTasks={setTasks}
				updateData={updateData}
				setUpdateData={setUpdateData}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				fetchData={fetchData}
			/>
		</div>
	);
}
