"use client";
import { ArrowUpDown } from "lucide-react";
// Define your columns without TypeScript types
export const columnsEvent = [
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
];
