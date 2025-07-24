"use client";
import { ArrowUpDown } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContextProvider";
export const columnsCategory = ({ handleDelete, setIsOpen, setUpdateData, dialogOpen, setDialogOpen }) => {
	const { user } = useAuthContext(); // Get authenticated user details
	const [selectedCategoryId, setSelectedCategoryId] = useState(null);

	const openDialog = (category = {}) => {
		setDialogOpen(true);
		setSelectedCategoryId(category.id);
	};
	const handleUpdateCategory = (category) => {
		setIsOpen(true);
		setUpdateData(category);
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
					<Button onClick={() => handleDelete(selectedCategoryId)}>Yes, delete</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
	// Return columns and dialog as an object (consumer should use columns and render dialog outside table)
	return { columnsCategory: baseColumns, dialog };
};
