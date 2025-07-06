import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsCategory } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { DataTableCategories } from "./data-table";

export default function Categories() {
	const { loading, setLoading } = useLoadContext();
	const [categories, setCategories] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
	useEffect(() => {
		document.title = "Task Management | Categories";
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const categoryResponse = await axiosClient.get("/category");
			setCategories(categoryResponse.data.data);
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
			await axiosClient.delete(`/category/${id}`);
			fetchData();
			showToast("Success!", "Category deleted.", 3000);
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
				<h1 className=" font-extrabold text-3xl">Categories</h1>
				<p>View list of all categories</p>
			</div>
			<DataTableCategories
				columns={columnsCategory({ handleDelete, setIsOpen, setUpdateData })}
				data={categories}
				setCategories={setCategories}
				updateData={updateData}
				setUpdateData={setUpdateData}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				fetchData={fetchData}
			/>
		</div>
	);
}
