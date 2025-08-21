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
import { useCategoriesStore } from "@/store/categories/categoriesStore";
export const columnsCategory = ({ setIsOpen, setUpdateData, dialogOpen, setDialogOpen }) => {
	const { loading, setLoading } = useLoadContext();
	const { setCategories } = useCategoriesStore();
	const showToast = useToast();
	const { user } = useAuthContext(); // Get authenticated user details
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);
	const [hasRelation, setHasRelation] = useState(false);

	const openDialog = async (category = {}) => {
		setLoading(true);
		setDialogOpen(true);
		setSelectedCategoryId(category.id);
		try {
			const hasRelationResponse = await axiosClient.post(API().relation_check("category", category.id));
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
	const handleUpdateCategory = (category) => {
		setIsOpen(true);
		setUpdateData(category);
	};
	const handleDelete = async (id) => {
		setLoading(true);
		try {
			const categoryResponse = await axiosClient.delete(API().category(id));
			setCategories(categoryResponse.data.data);
			showToast("Success!", "Category deleted.", 3000);
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
				const category = row.original;
				return (
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateCategory(category)}>
								Update Category
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									openDialog(category);
								}}
							>
								Delete Category
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
							<span className="text-yellow-800">Warning: Category is assigned to tasks.</span>
							<br />
							<span> Deleting this will set task category to null</span>
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
							handleDelete(selectedCategoryId);
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
	return { columnsCategory: baseColumns, dialog };
};
