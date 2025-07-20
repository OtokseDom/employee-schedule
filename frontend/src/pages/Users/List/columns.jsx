"use client";
import { ArrowUpDown, MoreHorizontal, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useToast } from "@/contexts/ToastContextProvider";
import axiosClient from "@/axios.client";

export const columns = ({ fetchData, handleDelete, setIsOpen, setUpdateData }) => {
	const { user } = useAuthContext();
	const { setLoading } = useLoadContext();
	const showToast = useToast();
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogType, setDialogType] = useState(null);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [selectedUserData, setSelectedUserData] = useState(null);

	const openDialog = (type, userData = {}) => {
		setDialogType(type);
		setDialogOpen(true);
		setSelectedUserId(userData.id);
		setSelectedUserData(userData);
		// console.log("Dialog should open:", type, userData);
	};

	const handleUpdateUser = (user, event) => {
		event.stopPropagation();
		setIsOpen(true);
		setUpdateData(user);
	};

	const handleApproval = async (action, id, userRow = {}) => {
		setLoading(true);
		try {
			if (action === 0) {
				const res = await axiosClient.delete(`/user/${id}`);
				if (res.data.success) {
					showToast("Success!", res.data.message, 3000);
					navigate("/users");
				} else {
					showToast("Failed!", res.message, 3000);
				}
			} else {
				const form = { ...userRow, status: "active" };
				const res = await axiosClient.put(`/user/${id}`, form);
				fetchData();
				showToast("Success!", res.data.message, 3000);
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
		} finally {
			setLoading(false);
		}
	};

	const baseColumns = useMemo(
		() => [
			{
				id: "name",
				accessorKey: "name",
				header: ({ column }) => (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Name <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				),
				cell: ({ row }) => {
					const { name, id, status } = row.original;
					return (
						<div className="flex items-center gap-2">
							<User2 size={60} />
							<div className="flex flex-col w-full">
								{name} {user?.id === id && <span className="text-xs text-yellow-800"> (Me)</span>}
								<span
									className={`backdrop-blur-sm px-2 py-1 text-xs w-fit rounded-full ${
										status === "pending"
											? "text-yellow-100 bg-yellow-900/50"
											: status === "active"
											? "text-green-100 bg-green-900/50"
											: status === "inactive"
											? "text-gray-100 bg-gray-900/50"
											: status === "banned"
											? "text-red-100 bg-red-900/50"
											: ""
									}`}
								>
									{status}
								</span>
							</div>
						</div>
					);
				},
			},
			{ id: "role", accessorKey: "role", header: createHeader("Role") },
			{ id: "email", accessorKey: "email", header: createHeader("Email") },
			{ id: "position", accessorKey: "position", header: createHeader("Position") },
			// ...existing code...
		],
		[user]
	);

	// Add actions column for Superadmin
	if (user?.data?.role === "Superadmin") {
		baseColumns.push({
			id: "actions",
			cell: ({ row }) => {
				const userRow = row.original;
				return (
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{userRow.status === "pending" && (
								<>
									<DropdownMenuItem
										className="text-green-500 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											handleApproval(1, userRow.id, userRow);
										}}
									>
										Approve User
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-red-500 cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											openDialog("reject", userRow);
										}}
									>
										Reject User
									</DropdownMenuItem>
									<hr />
								</>
							)}
							<DropdownMenuItem>
								<Link to={`/profile/${userRow.id}`}>View Profile</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer" onClick={(e) => handleUpdateUser(userRow, e)}>
								Update User
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									openDialog("delete", userRow);
								}}
							>
								Delete Account
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		});
	}

	// Render Dialog once per table, outside cell renderer
	const dialog = (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={true}>
			<DialogContent onClick={(e) => e.stopPropagation()}>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>This action cannot be undone.</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					<Button
						onClick={() => {
							if (dialogType === "reject") handleApproval(0, selectedUserId);
							else if (dialogType === "delete") handleDelete(selectedUserId);
							setDialogOpen(false);
						}}
					>
						Yes, delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	// Return columns and dialog as an object (consumer should use columns and render dialog outside table)
	return { columns: baseColumns, dialog };
};

const createHeader =
	(label) =>
	({ column }) =>
		(
			<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
				{label} <ArrowUpDown className="ml-2 h-4 w-4" />
			</button>
		);
