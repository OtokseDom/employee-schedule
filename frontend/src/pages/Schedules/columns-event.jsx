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
export const columnsEvent = ({ handleDelete }) => [
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
		id: "description",
		accessorKey: "description",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Description <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const event = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
						<DropdownMenuSeparator /> */}
						<DropdownMenuItem>Update Event</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleDelete("event", event.id)}>Delete Event</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
