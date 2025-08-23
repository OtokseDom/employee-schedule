"use client";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useToast } from "@/contexts/ToastContextProvider";
import axiosClient from "@/axios.client";
import { API } from "@/constants/api";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
import { statusColors } from "@/utils/taskHelpers";
export const columnsTaskStatus = ({ setIsOpen, setUpdateData, dialogOpen, setDialogOpen }) => {
	const { loading, setLoading } = useLoadContext();
	const { removeTaskStatus } = useTaskStatusesStore();
	const showToast = useToast();
	const { user } = useAuthContext(); // Get authenticated user details
	const [selectedTaskStatusId, setSelectedTaskStatusId] = useState(null);
	const [hasRelation, setHasRelation] = useState(false);
	const openDialog = async (taskStatus = {}) => {
		setLoading(true);
		setDialogOpen(true);
		setSelectedTaskStatusId(taskStatus.id);
		try {
			const hasRelationResponse = await axiosClient.post(API().relation_check("status", taskStatus.id));
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
	const handleUpdateTaskStatus = (taskStatus) => {
		setIsOpen(true);
		setUpdateData(taskStatus);
	};
	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(API().task_status(id));
			removeTaskStatus(id);
			showToast("Success!", "Task Status deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setDialogOpen(false);
			setLoading(false);
		}
	};
	const baseColumns = useMemo(
		() => [
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
				cell: ({ row }) => {
					const taskStatus = row.original;
					return (
						<div className="flex items-center">
							<span
								className={`px-2 py-1 text-center whitespace-nowrap rounded-2xl text-xs ${
									statusColors[taskStatus?.color?.toLowerCase()] || ""
								}`}
							>
								{taskStatus?.name}
							</span>
						</div>
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
		],
		[user]
	);
	// Add actions column for Superadmin
	if (user?.data?.role === "Superadmin" || user?.data?.role === "Admin" || user?.data?.role === "Manager") {
		baseColumns.push({
			id: "actions",
			cell: ({ row }) => {
				const taskStatus = row.original;
				return (
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateTaskStatus(taskStatus)}>
								Update Task Status
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									openDialog(taskStatus);
								}}
							>
								Delete Task Status
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		});
	}

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
							<span className="text-yellow-800">Warning: Status is assigned to tasks.</span>
							<br />
							<span> Deleting this will set task status to null</span>
						</>
					)}
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
					<Button
						disabled={loading}
						onClick={() => {
							handleDelete(selectedTaskStatusId);
							setDialogOpen(false);
						}}
					>
						Yes, delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
	// Return columns and dialog as an object (consumer should use columns and render dialog outside table)
	return { columnsTaskStatus: baseColumns, dialog };
};
