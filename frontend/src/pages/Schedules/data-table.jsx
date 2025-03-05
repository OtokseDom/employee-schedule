"use client";

import { useEffect, useState } from "react";
import { flexRender, getSortedRowModel, getFilteredRowModel, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
// import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EmployeeForm from "./EmployeeForm";

// Convert the DataTable component to JavaScript
export function DataTable({ columns, data, setEmployees, loading, setLoading, setSelectedEmployee, sample, isOpen, setIsOpen }) {
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
	useEffect(() => {
		if (sample) {
			const defaultRow = table.getRowModel().rows.find((row) => row.original.id === sample);
			if (defaultRow) {
				table.toggleAllRowsSelected(false);
				defaultRow.toggleSelected();
				setSelectedEmployee(defaultRow.original);
			}
		}
	}, [sample]);

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
							<Button variant="">Add Employee</Button>
						</SheetTrigger>
						<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>Add Employee</SheetTitle>
							</SheetHeader>
							<EmployeeForm data={data} setEmployees={setEmployees} loading={loading} setLoading={setLoading} setIsOpen={setIsOpen} />
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
										setSelectedEmployee(row.original);
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
