"use client";

import { useState } from "react";
import { flexRender, getSortedRowModel, getFilteredRowModel, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import TaskForm from "../TaskForm";

// Convert the DataTable component to JavaScript
export function DataTableTasks({ columns, data, setTasks, isOpen, setIsOpen, updateData, setUpdateData, fetchData }) {
	const { loading, setLoading } = useLoadContext();
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [selectedColumn, setSelectedColumn] = useState(null);
	const [filterValue, setFilterValue] = useState("");
	// Select what column to filter
	const handleColumnChange = (columnId) => {
		setSelectedColumn(columnId);
		setFilterValue("");
	};
	// Apply filter as value changes
	const handleFilterChange = (value) => {
		setFilterValue(value);
		if (selectedColumn) {
			table.getColumn(selectedColumn)?.setFilterValue(value);
		}
	};
	const [columnVisibility, setColumnVisibility] = useState({
		"expected output": false,
		"time estimate": false,
		delay: false,
		remarks: false,
	});
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});
	return (
		<div className="w-full scrollbar-custom">
			<div className="flex flex-col md:flex-row justify-between py-4">
				<div className="flex flex-row gap-4">
					{/* Input field to enter filter value */}
					<Input
						type="text"
						placeholder={selectedColumn ? `Filter by ${selectedColumn}` : "Select a column first"}
						value={filterValue}
						onChange={(e) => handleFilterChange(e.target.value)}
						disabled={!selectedColumn} // Disable until a column is selected
						className="max-w-sm"
					/>
					{/* Dropdown Menu for selecting column */}
					<Select onValueChange={handleColumnChange}>
						<SelectTrigger className="w-60 capitalize">
							<SelectValue placeholder="Select Column" />
						</SelectTrigger>
						<SelectContent>
							{table
								.getAllColumns()
								.filter((col) => col.getCanFilter())
								.map((col) => (
									<SelectItem key={col.id} value={col.id} className="capitalize">
										{col.id}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-row justify-between gap-2">
					<div className="flex gap-2">
						<Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
							<SheetTrigger asChild>
								<Button variant="">Add Task</Button>
							</SheetTrigger>
							<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
								<SheetHeader>
									<SheetTitle>Add Task</SheetTitle>
								</SheetHeader>
								<TaskForm
									data={data}
									setTasks={setTasks}
									isOpen={isOpen}
									setIsOpen={setIsOpen}
									updateData={updateData}
									setUpdateData={setUpdateData}
									fetchData={fetchData}
								/>
							</SheetContent>
						</Sheet>
						{/* <Link to="/products/add">
						<Button variant="">Add Product</Button>
					</Link> */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">Columns</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{table
									.getAllColumns()
									.filter((column) => column.getCanHide())
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize"
												checked={column.getIsVisible()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{column.id}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="flex gap-2">
						<Button variant="outline" size="" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
							<ChevronLeft />
						</Button>
						<Button variant="outline" size="" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
							<ChevronRight />
						</Button>
					</div>
				</div>
			</div>
			<div className="rounded-md">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{loading ? (
							// Show skeleton while loading
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24">
									<div className="flex items-center justify-center">
										<div className="flex flex-col space-y-3 w-full">
											{Array.from({ length: 6 }).map((_, i) => (
												<Skeleton key={i} className="h-24 w-2/5 md:w-full" />
											))}
										</div>
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows.length ? (
							// Show table data if available
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							// Show "No Results" only if data has finished loading and is truly empty
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No Results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button variant="outline" size="" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
					<ChevronLeft />
				</Button>
				<Button variant="outline" size="" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					<ChevronRight />
				</Button>
			</div>
		</div>
	);
}
