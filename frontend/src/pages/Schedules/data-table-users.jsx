"use client";

import { useEffect, useRef, useState } from "react";
import { flexRender, getSortedRowModel, getFilteredRowModel, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Userform from "./Userform";

// Convert the DataTable component to JavaScript
export function DataTableUsers({
	columns,
	data,
	setUsers,
	loading,
	setLoading,
	setSelectedUser,
	firstRow,
	isOpen,
	setIsOpen,
	deleted,
	setDeleted,
	updateData,
	setUpdateData,
	fetchData,
}) {
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState([]);
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
	const prevFirstRowRef = useRef(null);
	// TODO: when first user is selected, adding new user removes selected indicator
	// TODO: When any user is selected, deeleting first user removes selected indicator
	useEffect(() => {
		if (firstRow !== prevFirstRowRef.current) {
			const defaultRow = table.getRowModel().rows.find((row) => row.original.id === firstRow);
			setSelectedUser(defaultRow?.original);
			table.toggleAllRowsSelected(false);
			defaultRow?.toggleSelected();
			prevFirstRowRef.current = firstRow; // Update the reference
		}
		if (deleted) {
			const firstRow = table.getRowModel().rows[0];
			if (firstRow) {
				table.toggleAllRowsSelected(false);
				firstRow.toggleSelected();
				setSelectedUser(firstRow.original);
			}
			setDeleted(false);
		}
	}, [firstRow, deleted]);

	return (
		<div className="w-full">
			<div className="flex py-4">
				<Input
					placeholder={"filter name..."}
					value={table.getColumn("name")?.getFilterValue() || ""}
					onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<div className="flex gap-2 ml-auto">
					<Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
						<SheetTrigger asChild>
							<Button variant="">Add User</Button>
						</SheetTrigger>
						<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Add User</SheetTitle>
							</SheetHeader>
							<Userform
								data={data}
								setUsers={setUsers}
								loading={loading}
								setLoading={setLoading}
								setIsOpen={setIsOpen}
								updateData={updateData}
								setUpdateData={setUpdateData}
								fetchData={fetchData}
							/>
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
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									// to select only 1 row at a time
									onClick={() => {
										if (!row.getIsSelected(true)) {
											table.toggleAllRowsSelected(false);
											row.toggleSelected();
										}
										setSelectedUser(row.original);
									}}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24">
									<div className="flex items-center justify-center">
										{loading ? (
											<div className="flex flex-col space-y-3 w-full">
												<Skeleton className="h-4 w-2/5 md:w-full" />
												<Skeleton className="h-4 w-1/3 md:w-3/4" />
												<Skeleton className="h-4 w-2/5 md:w-full" />
												<Skeleton className="h-4 w-1/3 md:w-3/4" />
												<Skeleton className="h-4 w-2/5 md:w-full" />
												<Skeleton className="h-4 w-1/3 md:w-3/4" />
												<Skeleton className="h-4 w-2/5 md:w-full" />
												<Skeleton className="h-4 w-1/3 md:w-3/4" />
												<Skeleton className="h-4 w-2/5 md:w-full" />
												<Skeleton className="h-4 w-1/3 md:w-3/4" />
												<Skeleton className="h-4 w-2/5 md:w-full" />
											</div>
										) : (
											"No Results."
										)}
									</div>
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
