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
import { format } from "date-fns";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export const columnsTask = ({ handleDelete, setIsOpen, setUpdateData }, showLess = true) => {
	const handleUpdate = (task) => {
		setIsOpen(true);
		setUpdateData(task);
	};

	// Define color classes based on status value
	const statusColors = {
		Pending: "bg-yellow-100 border border-yellow-800 border-2 text-yellow-800",
		"In Progress": "bg-blue-100 border border-blue-800 border-2 text-blue-800",
		Completed: "bg-green-100 border border-green-800 border-2 text-green-800",
		Cancelled: "bg-red-100 border border-red-800 border-2 text-red-800",
		Delayed: "bg-red-100 border border-red-800 border-2 text-red-800",
		"On Hold": "bg-red-100 border border-red-800 border-2 text-red-800",
	};
	return [
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
			cell: ({ row }) => {
				const status = row.original.status;

				return (
					<div className=" min-w-24">
						<span className={`px-2 py-1 w-full text-center rounded-2xl text-xs ${statusColors[status] || "bg-gray-200 text-gray-800"}`}>
							{status.replace("_", " ")}
						</span>
					</div>
				);
			},
		},
		...(showLess
			? [
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
						cell: ({ row }) => {
							const assignee = row.original.assignee;

							return (
								<div>
									<span className=" font-extrabold">{assignee ? assignee.name : "Unassigned"}</span>
									<br />
									<span className="text-sm text-gray-500">{assignee && assignee.position}</span>
								</div>
							);
						},
					},
			  ]
			: []),
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
			...(!showLess
				? {
						cell: ({ row }) => {
							const category = row.original.category;
							const status = row.original.status;
							return (
								<div className="min-w-52">
									{category}
									<br />
									<br />
									<span className={`px-2 py-1 w-full text-center rounded-2xl text-xs ${statusColors[status] || "bg-gray-200 text-gray-800"}`}>
										{status.replace("_", " ")}
									</span>
								</div>
							);
						},
				  }
				: {}),
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
			cell: ({ row }) => {
				const title = row.original.title;
				const description = row.original.description;
				return (
					<div className="min-w-52">
						{title}
						<br />
						<span className="text-sm text-gray-500">{description}</span>
					</div>
				);
			},
		},
		{
			id: "expected output",
			accessorKey: "expected_output",
			meta: { hidden: true },
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Expected Output <ArrowUpDown className="ml-2 h-4 w-4" />
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
			accessorFn: (row) => (row.start_date ? format(new Date(row.start_date), "MMM-dd yyyy") : ""),
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
			accessorFn: (row) => (row.end_date ? format(new Date(row.end_date), "MMM-dd yyyy") : ""),
		},
		{
			id: "time estimate",
			accessorKey: "time_estimate",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Time Estimate (hrs) <ArrowUpDown className="ml-2 h-4 w-4" />
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
						Time Taken (hrs) <ArrowUpDown className="ml-2 h-4 w-4" />
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
			cell: ({ row }) => {
				const remarks = row.original.remarks;
				return <div className="min-w-52">{remarks}</div>;
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const task = row.original;

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
								<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdate(task)}>
									Update Task
								</DropdownMenuItem>
								<DropdownMenuItem>
									<DialogTrigger>Delete Task</DialogTrigger>
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
								<Button onClick={() => handleDelete(task.id)}>Yes, delete</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				);
			},
		},
	];
};
