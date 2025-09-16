"use client";

import { useState } from "react";
import { flexRender, getSortedRowModel, getFilteredRowModel, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import TaskForm from "../form";
import History from "@/components/task/History";
import Relations from "@/components/task/Relations";
import Tabs from "@/components/task/Tabs";
import { useTasksStore } from "@/store/tasks/tasksStore";

export function DataTableTasks({
	columns,
	data,
	isOpen,
	setIsOpen,
	updateData,
	setUpdateData,
	fetchData,
	showLess = true,
	parentId,
	setParentId,
	projectId,
	setProjectId,
}) {
	const { selectedTaskHistory, activeTab, setActiveTab } = useTasksStore();
	const { loading } = useLoadContext();
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [selectedColumn, setSelectedColumn] = useState(null);
	const [filterValue, setFilterValue] = useState("");
	const handleUpdate = (task) => {
		setIsOpen(true);
		setUpdateData(task);
	};
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
	// Initially hides some column, showing only the main details
	const [columnVisibility, setColumnVisibility] = useState(
		showLess
			? {
					// status: false,
					"start date": false,
					"end date": true,
					"start time": false,
					"end time": false,
					"expected output": false,
					"time estimate": false,
					"time taken": false,
					"delay reason": false,
					"performance rating": false,
					delay: false,
					remarks: false,
			  }
			: {
					"expected output": false,
					"time estimate": false,
					"time taken": false,
					"delay reason": false,
					delay: false,
					remarks: false,
			  }
	);
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
		enableRowSelection: true,
	});
	return (
		<div className="w-full scrollbar-custom">
			<div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/>

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
									<SheetTitle>
										<Tabs loading={loading} updateData={updateData} activeTab={activeTab} setActiveTab={setActiveTab} parentId={parentId} />
									</SheetTitle>
									<SheetDescription className="sr-only">Navigate through the app using the options below.</SheetDescription>
								</SheetHeader>
								{activeTab == "history" ? (
									<History selectedTaskHistory={selectedTaskHistory} />
								) : activeTab == "relations" ? (
									<Relations setUpdateData={setUpdateData} setParentId={setParentId} setProjectId={setProjectId} />
								) : (
									<TaskForm
										parentId={parentId}
										projectId={projectId}
										isOpen={isOpen}
										setIsOpen={setIsOpen}
										updateData={updateData}
										setUpdateData={setUpdateData}
										fetchData={fetchData}
									/>
								)}
							</SheetContent>
						</Sheet>
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
			<div className="flex justify-between items-center w-full m-0">
				{table.getFilteredSelectedRowModel().rows.length > 0 && (
					<div className="text-muted-foreground flex-1 text-sm">
						{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} task(s) selected.
					</div>
				)}
				<Button variant="link" className="text-muted-foreground" onClick={() => setSorting([])}>
					Reset sort
				</Button>
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
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24">
									<div className="flex items-center justify-center">
										<div className="flex flex-col space-y-3 w-full">
											{Array.from({ length: 6 }).map((_, i) => (
												<Skeleton key={i} index={i * 0.9} className="h-24 w-full" />
											))}
										</div>
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows.length ? (
							// Show table data if available
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									//  onClick={() => handleUpdate(row.original)} className="cursor-pointer"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
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
				{table.getFilteredSelectedRowModel().rows.length > 0 ? (
					<div className="text-muted-foreground flex-1 text-sm">
						{table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} task(s) selected.
					</div>
				) : (
					<div className="text-muted-foreground flex-1 text-sm">Showing 10 out of {table.getFilteredRowModel().rows.length} task(s).</div>
				)}
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
