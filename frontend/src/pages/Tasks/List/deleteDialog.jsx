"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { API } from "@/constants/api";
import axiosClient from "@/axios.client";
import { useTaskHelpers } from "@/utils/taskHelpers";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useToast } from "@/contexts/ToastContextProvider";

export default function DeleteDialog({ dialogOpen, setDialogOpen, hasRelation, selectedTaskId }) {
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const { fetchTasks } = useTaskHelpers();

	const handleDelete = async (id, deleteSubtasks = false) => {
		setLoading(true);
		try {
			if (deleteSubtasks) {
				await axiosClient.delete(API().task(id), {
					data: { delete_subtasks: true }, // send in request body
				});
			} else {
				await axiosClient.delete(API().task(id), {
					data: { delete_subtasks: false }, // send in request body
				});
			}
			// needs to remove all children tasks as well
			fetchTasks();
			showToast("Success!", "Task deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	return (
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
}
