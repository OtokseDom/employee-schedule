import axiosClient from "@/axios.client";
import React, { useEffect, useRef, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { API } from "@/constants/api";

export default function Users() {
	const { user } = useAuthContext();
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const [users, setUsers] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		document.title = "Task Management | Users";
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const userResponse = await axiosClient.get(API().user());
			setUsers(userResponse.data.data);
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
			const userResponse = await axiosClient.delete(API().user(id));
			setUsers(userResponse.data.data);
			showToast("Success!", "User deleted.", 3000);
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
				<h1 className=" font-extrabold text-3xl">Members of {user?.data?.organization?.name}</h1>
				<p>List of all organization members</p>
			</div>

			{(() => {
				const { columns: userColumns, dialog } = columns({ fetchData, handleDelete, setIsOpen, setUpdateData, updateData });
				return (
					<>
						<DataTable
							columns={userColumns}
							data={users}
							setUsers={setUsers}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							updateData={updateData}
							setUpdateData={setUpdateData}
							fetchData={fetchData}
						/>
						{dialog}
					</>
				);
			})()}
		</div>
	);
}
