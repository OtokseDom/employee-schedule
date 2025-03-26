"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const columnsUser = ({ handleDelete, setIsOpen, setUpdateData }) => {
	const { user } = useAuthContext();

	const handleUpdateUser = (user) => {
		setIsOpen(true);
		setUpdateData(user);
	};

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
								<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateUser(userRow)}>
									Update User
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={(event) => event.stopPropagation()} // Prevent row click
								>
									<DialogTrigger>Delete User</DialogTrigger>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent>
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
								<Button onClick={() => handleDelete("user", userRow.id)}>Yes, delete</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				);
			},
		});
	}

	return columns;
};
