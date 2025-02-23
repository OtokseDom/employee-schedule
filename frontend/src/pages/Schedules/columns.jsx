"use client";
import { ArrowUpDown } from "lucide-react";
// Define your columns without TypeScript types
export const columns = [
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
		id: "position",
		accessorKey: "position",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Position <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
];
