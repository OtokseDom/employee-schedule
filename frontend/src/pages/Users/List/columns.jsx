"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export const columns = ({ handleDelete, setIsOpen, setUpdateData }) => {
	const { user } = useAuthContext();

	const handleUpdateUser = (user, event) => {
		event.stopPropagation();
		setIsOpen(true);
		setUpdateData(user);
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
				return (
					<div className="flex items-center gap-2">
						<div className="w-14 h-14 bg-foreground rounded-full"></div>
						{name} {user?.id === id && <span className="text-xs text-yellow-800"> (Me)</span>}
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
	if (user.role === "Superadmin") {
		columns.push({
			id: "actions",
			cell: ({ row }) => {
				const userRow = row.original;
				return (
					<Dialog>
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
								<DropdownMenuItem className="cursor-pointer">
									<Link to={`/profile/` + userRow.id}>View Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer" onClick={(event) => handleUpdateUser(userRow, event)}>
									Update User
								</DropdownMenuItem>
								<DropdownMenuItem onClick={(event) => event.stopPropagation()}>
									<DialogTrigger>Delete User</DialogTrigger>
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
								<Button onClick={() => handleDelete(userRow.id)}>Yes, delete</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				);
			},
		});
	}

	return columns;
};
