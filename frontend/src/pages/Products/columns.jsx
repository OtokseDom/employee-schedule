"use client";
import { ArrowUpDown } from "lucide-react";
// Define your columns without TypeScript types
export const columns = [
	{
		id: "name",
		accessorKey: "product_variation.name",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Name <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		id: "short_name",
		accessorKey: "product_variation.short_name",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					Short Name <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	{
		id: "sku",
		accessorKey: "product_variation.SKU",
		header: ({ column }) => {
			return (
				<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
					SKU <ArrowUpDown className="ml-2 h-4 w-4" />
				</button>
			);
		},
	},
	// {
	// 	id: "Specification",
	// 	accessorKey: "product.specification",
	// 	header: ({ column }) => {
	// 		return (
	// 			<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
	// 				Specification <ArrowUpDown className="ml-2 h-4 w-4" />
	// 			</button>
	// 		);
	// 	},
	// },
	// {
	// 	id: "Description",
	// 	accessorKey: "product.description",
	// 	// header: "Amount",
	// 	header: ({ column }) => {
	// 		return (
	// 			<button className="flex" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
	// 				Description <ArrowUpDown className="ml-2 h-4 w-4" />
	// 			</button>
	// 		);
	// 	},
	// },
];
