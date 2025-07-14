"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useToast } from "@/contexts/ToastContextProvider";
import axiosClient from "@/axios.client";

export const columns = ({ fetchData, handleDelete, setIsOpen, setUpdateData }) => {
	const { user } = useAuthContext();
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogType, setDialogType] = useState(null); // "reject" or "delete"
	const [selectedUserId, setSelectedUserId] = useState(null); // pass user id here because using userRow.id in dialog gets wong id

	const openDialog = (type) => {
		setDialogType(type);
		setDialogOpen(true);
	};

	const handleUpdateUser = (user, event) => {
		event.stopPropagation();
		setIsOpen(true);
		setUpdateData(user);
	};

	const handleApproval = async (action, id, userRow = {}) => {
		setLoading(true);
		try {
			if (action == 0) {
				const userResponse = await axiosClient.delete(`/user/${id}`);
				if (userResponse.data.success == true) {
					showToast("Success!", userResponse.data.message, 3000);
					navigate("/users");
				} else {
					showToast("Failed!", userResponse.message, 3000);
				}
			} else {
				setLoading(true);
				const form = {
					...userRow,
					status: "active",
				};
				try {
					user;
					const userResponse = await axiosClient.put(`/user/${id}`, form);
					fetchData();
					showToast("Success!", userResponse.data.message, 3000);
				} catch (e) {
					showToast("Failed!", e.response?.data?.message, 3000, "fail");
					console.error("Error fetching data:", e);
				} finally {
					setLoading(false);
				}
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	// TODO: Add user profile picture
	// Define the base columns
	const columns = [
		{
			id: "name",
			accessorKey: "name",
			header: ({ column }) => (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			),
			cell: ({ row }) => {
				const name = row.original.name;
				const id = row.original.id;
				const status = row.original.status;
				return (
					<div className="flex items-center gap-2">
						<div className="min-w-14 min-h-14 bg-foreground rounded-full"></div>
						<div className="flex flex-col w-full">
							{name} {user?.id === id && <span className="text-xs text-yellow-800"> (Me)</span>}
							<span
								className={`backdrop-blur-sm px-2 py-1 text-xs w-fit rounded-full items-center
                            ${
								status == "pending"
									? "text-yellow-100 bg-yellow-900/50"
									: status == "active"
									? "text-green-100 bg-green-900/50"
									: status == "inactive"
									? "text-gray-100 bg-gray-900/50"
									: status == "banned"
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
		{
			id: "role",
			accessorKey: "role",
			header: ({ column }) => (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Role <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			),
		},
		{
			id: "email",
			accessorKey: "email",
			header: ({ column }) => (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Email <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			),
		},
		{
			id: "position",
			accessorKey: "position",
			header: ({ column }) => (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Position <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			),
		},
	];

	// Add Actions column only if user is Superadmin
	if (user?.data?.role === "Superadmin") {
		columns.push({
			id: "actions",
			cell: ({ row }) => {
				const userRow = row.original;
				return (
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger
								asChild
								onClick={(event) => event.stopPropagation()} // Prevent row click
							>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{userRow?.status == "pending" ? (
									<>
										<DropdownMenuItem
											className="cursor-pointer text-green-500"
											onClick={(e) => {
												e.stopPropagation();
												handleApproval(1, userRow?.id, userRow);
											}}
										>
											Approve User
										</DropdownMenuItem>
										<DropdownMenuItem
											className="cursor-pointer text-red-500"
											onClick={(e) => {
												e.stopPropagation();
												openDialog("reject");
												setSelectedUserId(userRow.id);
											}}
										>
											Reject User
										</DropdownMenuItem>
										<hr />
									</>
								) : (
									""
								)}
								<DropdownMenuItem className="cursor-pointer">
									<Link to={`/profile/` + userRow.id}>View Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer" onClick={(event) => handleUpdateUser(userRow, event)}>
									Update User
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										setSelectedUserId(userRow.id);
										openDialog("delete");
									}}
								>
									<DialogTrigger asChild>
										<span className="cursor-pointer">Deactivate Account</span>
									</DialogTrigger>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent onClick={(event) => event.stopPropagation()}>
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
			},
		});
	}

	return columns;
};
