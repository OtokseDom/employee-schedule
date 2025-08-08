import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsProject } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { DataTableProjects } from "./data-table";
import { API } from "@/constants/api";

export default function Projects() {
	const { loading, setLoading } = useLoadContext();
	const [projects, setProjects] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
	useEffect(() => {
		document.title = "Task Management | Projects";
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const projectResponse = await axiosClient.get(API().project());
			setProjects(projectResponse.data.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			const projectResponse = await axiosClient.delete(API().project(id));
			setProjects(projectResponse.data.data);
			showToast("Success!", "Project deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setDialogOpen(false);
			setLoading(false);
		}
	};
	return (
		<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
			<div>
				<h1 className=" font-extrabold text-3xl">Projects</h1>
				<p>View list of all projects</p>
			</div>
			{/* Updated table to fix dialog per column issue */}
			{(() => {
				const { columnsProject: projectColumns, dialog } = columnsProject({ handleDelete, setIsOpen, setUpdateData, dialogOpen, setDialogOpen });
				return (
					<>
						<DataTableProjects
							columns={projectColumns}
							data={projects}
							setProjects={setProjects}
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
