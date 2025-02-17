"use client";
import { ArrowUpDown } from "lucide-react";
// Define your columns without TypeScript types
export const columns = [
	{
		id: "Highlight",
		accessorKey: "product.highlight",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Highlight <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		id: "Specification",
		accessorKey: "product.specification",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Specification <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		id: "Description",
		accessorKey: "product.description",
		// header: "Amount",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Description <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
];
