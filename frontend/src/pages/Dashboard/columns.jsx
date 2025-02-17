"use client";
import { ArrowUpDown } from "lucide-react";
// Define your columns without TypeScript types
export const columns = [
	{
		accessorKey: "status",
		// header: "Status",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Status <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		accessorKey: "email",
		// header: "Email",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Email <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		accessorKey: "amount",
		// header: "Amount",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Amount <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
];
