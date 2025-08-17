import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { API } from "@/constants/api";
import { useUsersStore } from "@/store/users/usersStore";

export default function Users() {
	const { user } = useAuthContext();
	const { setLoading } = useLoadContext();
	const { users, setUsers } = useUsersStore();
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		document.title = "Task Management | Users";
		if (!users || users.length === 0) {
			fetchData();
		}
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const userResponse = await axiosClient.get(API().user());
			setUsers(userResponse.data.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
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
				const { columns: userColumns, dialog } = columns({ fetchData, setIsOpen, setUpdateData, updateData });
				return (
					<>
						<DataTable columns={userColumns} isOpen={isOpen} setIsOpen={setIsOpen} updateData={updateData} setUpdateData={setUpdateData} />
						{dialog}
					</>
				);
			})()}
		</div>
	);
}
