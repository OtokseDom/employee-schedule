import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsCategory } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { DataTableCategories } from "./data-table";
import { API } from "@/constants/api";

export default function Categories() {
	const { loading, setLoading } = useLoadContext();
	const [categories, setCategories] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);

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
			const categoryResponse = await axiosClient.get(API().categories());
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
			await axiosClient.delete(API().categories(id));
			fetchData();
			showToast("Success!", "Category deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setDialogOpen(false);
			setLoading(false);
		}
	};
	return (
		<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
			<div>
				<h1 className=" font-extrabold text-3xl">Categories</h1>
				<p>View list of all categories</p>
			</div>
			{/* Updated table to fix dialog per column issue */}
			{(() => {
				const { columnsCategory: categoryColumns, dialog } = columnsCategory({ handleDelete, setIsOpen, setUpdateData, dialogOpen, setDialogOpen });
				return (
					<>
						<DataTableCategories
							columns={categoryColumns}
							data={categories}
							setCategories={setCategories}
							updateData={updateData}
							setUpdateData={setUpdateData}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							fetchData={fetchData}
						/>
						{dialog}
					</>
				);
			})()}
		</div>
	);
}
