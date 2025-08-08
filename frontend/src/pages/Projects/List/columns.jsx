"use client";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { format } from "date-fns";
export const columnsProject = ({ handleDelete, setIsOpen, setUpdateData, dialogOpen, setDialogOpen }) => {
	const { user } = useAuthContext(); // Get authenticated user details
	const [selectedProjectId, setSelectedProjectId] = useState(null);

	const openDialog = (project = {}) => {
		setDialogOpen(true);
		setSelectedProjectId(project.id);
	};
	const handleUpdateProject = (project) => {
		setIsOpen(true);
		setUpdateData(project);
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
		Low: "bg-gray-100 border border-gray-800 border-2 text-gray-800",
		Medium: "bg-yellow-100 border border-yellow-800 border-2 text-yellow-800",
		High: "bg-orange-100 border border-orange-800 border-2 text-orange-800",
		Urgent: "bg-red-100 border border-red-800 border-2 text-red-800",
		Critical: "bg-purple-100 border border-purple-800 border-2 text-purple-800",
	};
	const baseColumns = useMemo(
		() => [
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
				id: "target_date",
				accessorKey: "target_date",
				header: ({ column }) => (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Target Date <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				),
				// Keep raw value for sorting
				accessorFn: (row) => row.target_date,
				// Use cell renderer to format for display
				cell: ({ row }) => {
					const date = row.original.target_date;
					return date ? format(new Date(date), "MMM-dd yyyy") : "";
				},
			},
			{
				id: "estimated_date",
				accessorKey: "estimated_date",
				header: ({ column }) => (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Estimated Date <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				),
				// Keep raw value for sorting
				accessorFn: (row) => row.estimated_date,
				// Use cell renderer to format for display
				cell: ({ row }) => {
					const date = row.original.estimated_date;
					return date ? format(new Date(date), "MMM-dd yyyy") : "";
				},
			},
			{
				id: "priority",
				accessorKey: "priority",
				header: ({ column }) => {
					return (
						<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Priority <ArrowUpDown className="ml-2 h-4 w-4" />
						</button>
					);
				},
				cell: ({ row }) => {
					const priority = row.original.priority;

					return (
						<div className=" min-w-24">
							<span className={`px-2 py-1 w-full text-center rounded text-xs ${statusColors[priority] || "bg-gray-200 text-gray-800"}`}>
								{priority.replace("_", " ")}
							</span>
						</div>
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
		],
		[user]
	);
	// Add actions column for Superadmin
	if (user?.data?.role === "Superadmin" || user?.data?.role === "Admin" || user?.data?.role === "Manager") {
		baseColumns.push({
			id: "actions",
			cell: ({ row }) => {
				const project = row.original;
				return (
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateProject(project)}>
								Update Project
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									openDialog(project);
								}}
							>
								Delete Project
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		});
	}

	const dialog = (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={true}>
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
					<Button onClick={() => handleDelete(selectedProjectId)}>Yes, delete</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
	// Return columns and dialog as an object (consumer should use columns and render dialog outside table)
	return { columnsProject: baseColumns, dialog };
};
