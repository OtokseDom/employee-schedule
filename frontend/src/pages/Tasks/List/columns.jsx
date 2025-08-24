"use client";
import { ArrowUpDown, CornerDownRight } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { statusColors } from "@/utils/taskHelpers";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useEffect, useMemo, useState } from "react";
import axiosClient from "@/axios.client";
import { API } from "@/constants/api";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useToast } from "@/contexts/ToastContextProvider";
import { useAuthContext } from "@/contexts/AuthContextProvider";
export const columnsTask = ({ dialogOpen, setDialogOpen, hasRelation, setHasRelation, setIsOpen, setUpdateData, fetchData }) => {
	const { user } = useAuthContext(); // Get authenticated user details
	const { tasks, taskHistory, setSelectedTaskHistory, setRelations } = useTasksStore();
	const [selectedTaskId, setSelectedTaskId] = useState(null);
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const openDialog = async (task = {}) => {
		setLoading(true);
		setDialogOpen(true);
		setSelectedTaskId(task.id);
		try {
			const hasRelationResponse = await axiosClient.post(API().relation_check("children", task.id));
			setHasRelation(hasRelationResponse?.data?.data?.exists);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (!dialogOpen) setHasRelation(false);
	}, [dialogOpen]);

	const handleUpdate = (task) => {
		setTimeout(() => {
			setIsOpen(true);
			setUpdateData(task);
		}, 100);
		// setIsOpen(true);
		// setUpdateData(task);
		const filteredHistory = taskHistory.filter((th) => th.task_id === task.id);
		setSelectedTaskHistory(filteredHistory);
		if (!task.parent_id) {
			setRelations(task);
		} else {
			const filteredRelations = tasks.filter((t) => t.id == task.parent_id);
			setRelations(...filteredRelations);
		}
	};

	const handleDelete = async (id, deleteSubtasks = false) => {
		setLoading(true);
		try {
			if (deleteSubtasks) {
				console.log("delete subtasks");
				await axiosClient.delete(API().task(id), {
					data: { delete_subtasks: true }, // send in request body
				});
			} else {
				console.log("delete this task only");
				await axiosClient.delete(API().task(id), {
					data: { delete_subtasks: false }, // send in request body
				});
			}
			// needs to remove all children tasks as well
			fetchData();
			showToast("Success!", "Task deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};

	const baseColumns = useMemo(
		() => [
			{
				id: "id",
				accessorKey: "id",
				header: ({ column }) => {
					return (
						<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							ID <ArrowUpDown className="ml-2 h-4 w-4" />
						</button>
					);
				},
				cell: ({ row }) => {
					const { id } = row.original;
					return <span className="text-xs text-gray-500">{id}</span>;
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
					const { title, description, depth } = row.original;
					return (
						<div className="flex flex-row min-w-52 gap-2" style={{ paddingLeft: depth * 20 }}>
							<span className="text-primary">{depth == 1 ? <CornerDownRight size={18} /> : ""}</span>
							<div>
								{title}
								<br />
								<span className="text-sm text-gray-500">{description}</span>
							</div>
						</div>
					);
				},
			},
			{
				id: "status",
				accessorKey: "status.name",
				header: ({ column }) => {
					return (
						<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Status <ArrowUpDown className="ml-2 h-4 w-4" />
						</button>
					);
				},
				cell: ({ row }) => {
					const { status, depth } = row.original;

					return (
						<div className="flex flex-row min-w-24">
							{/* <span className={`px-2 py-1 text-center whitespace-nowrap rounded-2xl text-xs ${statusColors[status] || "bg-gray-200 text-gray-800"}`}> */}
							<span className={`px-2 py-1 text-center whitespace-nowrap rounded-2xl text-xs ${statusColors[status?.color?.toLowerCase()] || ""}`}>
								{status?.name || "-"}
							</span>
						</div>
					);
				},
			},
			{
				id: "project",
				accessorKey: "project.title",
				header: ({ column }) => {
					return (
						<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
							Project <ArrowUpDown className="ml-2 h-4 w-4" />
						</button>
					);
				},
				cell: ({ row }) => {
					const { project } = row.original;
					return project?.title;
				},
			},
			{
				id: "assignees",
				header: ({ column }) => (
					<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
						Assignees <ArrowUpDown className="ml-2 h-4 w-4" />
					</button>
				),
				cell: ({ row }) => {
					const assignees = row.original.assignees; // array of users

					if (!assignees || assignees.length === 0) {
						return <span className="text-gray-500">Unassigned</span>;
					}
					const names = assignees.map((user) => user.name).join(", ");
					return (
						<div>
							<span>{names}</span>
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
				cell: ({ row }) => {
					const { category } = row.original;
					return category?.name;
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
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								{/* //stop propagation when parent row is clicked */}
								<Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										handleUpdate(task);
									}}
								>
									View and Update Task
								</DropdownMenuItem>
								<DropdownMenuItem
									className="w-full text-left cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										openDialog(task);
									}}
								>
									Delete Task
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[user]
	);
	const dialog = (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={false}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>This action cannot be undone.</DialogDescription>
				</DialogHeader>
				<div className="ml-4 text-base">
					{hasRelation && (
						<>
							<span className="text-yellow-800">Warning: Task has subtasks</span>
							<br />
							<span>Do you wish to delete subtasks as well?</span>
						</>
					)}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					{hasRelation && (
						<Button
							disabled={loading}
							variant="destructive"
							onClick={(e) => {
								setDialogOpen(false);
								handleDelete(selectedTaskId, true);
							}}
						>
							Delete with subtasks
						</Button>
					)}
					<Button
						disabled={loading}
						onClick={(e) => {
							setDialogOpen(false);
							handleDelete(selectedTaskId);
						}}
					>
						{hasRelation ? "Delete this task only" : "Yes, delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
	// Return columns and dialog as an object (consumer should use columns and render dialog outside table)
	return { columnsTask: baseColumns, dialog };
};
