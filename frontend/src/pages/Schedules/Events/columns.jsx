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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export const columnsEvent = ({ handleDelete, setIsOpenEvent, setUpdateData }) => {
	const handleUpdateEvent = (event) => {
		setIsOpenEvent(true);
		setUpdateData(event);
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
					<Dialog>
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateEvent(event)}>
									Update Event
								</DropdownMenuItem>
								<DropdownMenuItem>
									<DialogTrigger>Delete Event</DialogTrigger>
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
								<Button onClick={() => handleDelete("event", event.id)}>Yes, delete</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				);
			},
		},
	];
};
