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
export const columnsEvent = ({ handleDelete, setIsOpenEvent, setUpdateData }) => {
	const handleUpdate = (task) => {
		setIsOpenEvent(true);
		setUpdateData(task);
	};

	return [
		{
			id: "category",
			accessorKey: "category",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Category <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "title",
			accessorKey: "title",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Title <ArrowUpDown className="ml-2 h-4 w-4" />
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
			id: "expected output",
			accessorKey: "expected_output",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Expected Output <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "assignee",
			accessorKey: "assignee.name",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Assignee <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "status",
			accessorKey: "status",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Status <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "start date",
			accessorKey: "start_date",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Start Date <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "end date",
			accessorKey: "end_date",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						End Date <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "time estimate",
			accessorKey: "time_estimate",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Time Estimate <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "time taken",
			accessorKey: "time_taken",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Time Taken <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "delay",
			accessorKey: "delay",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Delay <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "delay reason",
			accessorKey: "delay_reason",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Delay Reason <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "performance rating",
			accessorKey: "performance_rating",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Performance Rating <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "remarks",
			accessorKey: "remarks",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Remarks <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const task = row.original;

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
							<DropdownMenuItem onClick={() => handleUpdate(task)}>Update Task</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleDelete("task", task.id)}>Delete Task</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
};
