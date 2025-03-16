"use client";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columnsUser = ({ handleDelete, setIsOpen, setUpdateData }) => {
	const handleUpdateUser = (user) => {
		setIsOpen(true);
		setUpdateData(user);
	};

	return [
		{
			id: "name",
			accessorKey: "name",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Name <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "role",
			accessorKey: "role",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Role <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "email",
			accessorKey: "email",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Email <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "position",
			accessorKey: "position",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Position <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const user = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleUpdateUser(user)}>Update User</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDelete("user", user.id)}>Delete User</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
};
