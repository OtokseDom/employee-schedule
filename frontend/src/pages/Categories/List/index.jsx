import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsCategory } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { DataTableCategories } from "./data-table";
import { API } from "@/constants/api";
import { useCategoriesStore } from "@/store/categories/categoriesStore";

export default function Categories() {
	const { setLoading } = useLoadContext();
	const { categories, setCategories } = useCategoriesStore();
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
	useEffect(() => {
		document.title = "Task Management | Categories";
		if (!categories || categories.length === 0) fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const categoryResponse = await axiosClient.get(API().category());
			setCategories(categoryResponse.data.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};

	return (
		<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
			<div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					dialogOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/>
			<div>
				<h1 className=" font-extrabold text-3xl">Categories</h1>
				<p>View list of all categories</p>
			</div>
			{/* Updated table to fix dialog per column issue */}
			{(() => {
				const { columnsCategory: categoryColumns, dialog } = columnsCategory({ setIsOpen, setUpdateData, dialogOpen, setDialogOpen });
				return (
					<>
						<DataTableCategories
							columns={categoryColumns}
							updateData={updateData}
							setUpdateData={setUpdateData}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
						/>
						{dialog}
					</>
				);
			})()}
		</div>
	);
}
