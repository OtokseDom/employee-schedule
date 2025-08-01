"use client";

import { useState } from "react";
import { flexRender, getSortedRowModel, getFilteredRowModel, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import TaskForm from "../form";
import { format } from "date-fns";

// Convert the DataTable component to JavaScript
export function DataTableTasks({
	columns,
	data,
	selectedTaskHistory,
	users,
	categories,
	setTasks,
	isOpen,
	setIsOpen,
	updateData,
	setUpdateData,
	fetchData,
	showLess = true,
	showHistory,
	setShowHistory,
}) {
	const { loading, setLoading } = useLoadContext();
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
					"start date": true,
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
										{Object.keys(updateData).length > 0 ? (
											<div className="flex flex-row items-center">
												<div className="flex flex-row w-fit h-fit bg-card rounded-sm text-base">
													<div className={`w-fit py-2 px-5 ${!showHistory ? "bg-secondary" : "text-muted-foreground"} rounded`}>
														<button onClick={() => setShowHistory(false)}>Update Task</button>
													</div>
													<div className={`w-fit py-2 px-5 ${showHistory ? "bg-secondary" : "text-muted-foreground"} rounded`}>
														<button onClick={() => setShowHistory(true)}>History</button>
													</div>
												</div>
												{/* {!showHistory ? <span>{updateData?.id ? "Update Task" : "Add Task"}</span> : <span>Task History</span>} */}
												<span>{loading && <Loader2 className="animate-spin" />}</span>
											</div>
										) : (
											"Add Task"
										)}
									</SheetTitle>
									<SheetDescription className="sr-only">Navigate through the app using the options below.</SheetDescription>
								</SheetHeader>
								{showHistory ? (
									<div className="flex flex-col text-sm">
										{selectedTaskHistory.map((history, index) => {
											if (history?.remarks === "Task Added") {
												return (
													<div key={index} className="w-full overflow-y-auto text-muted-foreground p-5">
														<div>
															<span className="font-bold">{history?.changedBy?.name}</span> created this task
														</div>
														<div className="text-blue-500">{format(new Date(history?.created_at), "MMMM dd, yyyy, hh:mm a")}</div>
													</div>
												);
											} else {
												return (
													<div key={index} className="w-full overflow-y-auto text-muted-foreground p-5 border-t">
														<div>
															<span className="font-bold">{history?.changedBy?.name}</span> updated this task
														</div>
														<div className="text-blue-500">{format(new Date(history?.changed_at), "MMMM dd, yyyy, hh:mm a")}</div>
														<div className="flex flex-col gap-4 text-foreground mt-2">
															<div className="flex flex-col px-5 border-l-2 border-muted-foreground">
																<span className="font-bold text-muted-foreground">From</span>
																{Object.entries(history.remarks).map(([key, value]) => {
																	const label = key.endsWith("_id")
																		? key.replace(/_id$/, "") // remove '_id' at the end
																		: key;

																	const formattedLabel = label
																		.replace(/_/g, " ")
																		.replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word

																	return (
																		<span key={key}>
																			<span className="text-muted-foreground">{formattedLabel}:</span> {value.from}
																		</span>
																	);
																})}
															</div>
															<div className="flex flex-col px-5 border-l-2 border-muted-foreground">
																<span className="font-bold text-muted-foreground">To</span>
																{Object.entries(history.remarks).map(([key, value]) => {
																	const label = key.endsWith("_id")
																		? key.replace(/_id$/, "") // remove '_id' at the end
																		: key;

																	const formattedLabel = label
																		.replace(/_/g, " ")
																		.replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word

																	return (
																		<span key={key}>
																			<span className="text-muted-foreground">{formattedLabel}:</span> {value.to}
																		</span>
																	);
																})}
															</div>
														</div>
													</div>
												);
											}
										})}
									</div>
								) : (
									<TaskForm
										// data={data}
										users={users}
										categories={categories}
										isOpen={isOpen}
										setIsOpen={setIsOpen}
										updateData={updateData}
										setUpdateData={setUpdateData}
										fetchData={fetchData}
										selectedTaskHistory={selectedTaskHistory}
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
									// onClick={() => handleUpdate(row.original)}
								>
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
