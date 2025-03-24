import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsTask } from "./TaskDataTable/columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { DataTableTasks } from "./TaskDataTable/data-table";
// TODO: Update and delete task
export default function Tasks() {
	const showToast = useToast();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
	useEffect(() => {
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
	// TODO: Add validation before deletion of task
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
		<div className="w-screen bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
			<div>
				<h1 className=" font-extrabold text-3xl">Tasks</h1>
				<p>View list of all tasks</p>
			</div>
			<DataTableTasks
				columns={columnsTask({ handleDelete, setIsOpen, setUpdateData })}
				data={tasks}
				setTasks={setTasks}
				loading={loading}
				setLoading={setLoading}
				updateData={updateData}
				setUpdateData={setUpdateData}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				fetchData={fetchData}
			/>
		</div>
	);
}
// php artisan make:controller Api/UserTaskController --model=UserTask --requests --resource --api
// TODO: update task form
