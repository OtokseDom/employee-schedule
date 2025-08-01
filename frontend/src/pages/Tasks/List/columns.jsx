"use client";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export const columnsTask = ({ handleDelete, setIsOpen, setUpdateData, taskHistory, setSelectedTaskHistory }) => {
	const handleUpdate = (task) => {
		setIsOpen(true);
		setUpdateData(task);
		const filteredHistory = taskHistory.filter((th) => th.task_id === task.id);
		setSelectedTaskHistory(filteredHistory);
	};

	// Define color classes based on status value
	const statusColors = {
		Pending: "bg-yellow-100 border border-yellow-800 border-2 text-yellow-800",
		"In Progress": "bg-blue-100 border border-blue-800 border-2 text-blue-800",
		"For Review": "bg-orange-100 border border-orange-800 border-2 text-orange-800",
		Completed: "bg-green-100 border border-green-800 border-2 text-green-800",
		Cancelled: "bg-red-100 border border-red-800 border-2 text-red-800",
		Delayed: "bg-purple-100 border border-purple-800 border-2 text-purple-800",
		"On Hold": "bg-gray-100 border border-gray-800 border-2 text-gray-800",
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
		{
			id: "category",
			accessorKey: "category.name",
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
			id: "start_date",
			accessorKey: "start_date",
			header: ({ column }) => (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Start Date <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			),
			// Keep raw value for sorting
			accessorFn: (row) => row.start_date,
			// Use cell renderer to format for display
			cell: ({ row }) => {
				const date = row.original.start_date;
				return date ? format(new Date(date), "MMM-dd yyyy") : "";
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
			// Keep raw value for sorting
			accessorFn: (row) => row.end_date,
			// Use cell renderer to format for display
			cell: ({ row }) => {
				const date = row.original.end_date;
				return date ? format(new Date(date), "MMM-dd yyyy") : "";
			},
		},
		{
			id: "start time",
			accessorKey: "start_time",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Start Time <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
			accessorFn: (row) => (row.start_time ? format(new Date(`1970-01-01T${row.start_time}`), "h:mm a") : ""),
		},
		{
			id: "end time",
			accessorKey: "end_time",
			header: ({ column }) => {
				return (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						End Time <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				);
			},
			accessorFn: (row) => (row.end_time ? format(new Date(`1970-01-01T${row.end_time}`), "h:mm a") : ""),
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
			cell: ({ row }) => {
				const timeEstimate = row.original.time_estimate;
				if (typeof timeEstimate !== "number" || isNaN(timeEstimate)) return "";
				const hrs = Math.floor(timeEstimate);
				const mins = Math.round((timeEstimate - hrs) * 60);
				return `${hrs} hr${hrs !== 1 ? "s" : ""}${mins ? ` ${mins} min${mins !== 1 ? "s" : ""}` : ""}`;
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
			cell: ({ row }) => {
				const timeTaken = row.original.time_taken;
				if (typeof timeTaken !== "number" || isNaN(timeTaken)) return "";
				const hrs = Math.floor(timeTaken);
				const mins = Math.round((timeTaken - hrs) * 60);
				return `${hrs} hr${hrs !== 1 ? "s" : ""}${mins ? ` ${mins} min${mins !== 1 ? "s" : ""}` : ""}`;
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
			cell: ({ row }) => {
				const delay = row.original.delay;
				if (typeof delay !== "number" || isNaN(delay)) return "";
				const hrs = Math.floor(delay);
				const mins = Math.round((delay - hrs) * 60);
				return `${hrs} hr${hrs !== 1 ? "s" : ""}${mins ? ` ${mins} min${mins !== 1 ? "s" : ""}` : ""}`;
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
								{/* //stop propagation when parent row is clicked */}
								<Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdate(task)}>
									Update Task
								</DropdownMenuItem>
								<DropdownMenuItem>
									<DialogTrigger asChild>
										<button
											className="w-full text-left"
											onClick={(e) => {
												e.stopPropagation();
											}}
										>
											Delete Task
										</button>
									</DialogTrigger>
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
								<Button
									onClick={(e) => {
										e.stopPropagation();
										handleDelete(task.id);
									}}
								>
									Yes, delete
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				);
			},
		},
	];
};
