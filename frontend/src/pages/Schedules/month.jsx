"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import TaskForm from "../Tasks/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import axiosClient from "@/axios.client";
import { Loader2 } from "lucide-react";

export default function Month({ data, users, categories, fetchData, days, currentMonth, getTaskForDate, statusColors, selectedUser }) {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState(data);
	const [openDialogIndex, setOpenDialogIndex] = useState(null);
	const [updateData, setUpdateData] = useState({});
	const [taskAdded, setTaskAdded] = useState(false);
	useEffect(() => {
		if (taskAdded) {
			fetchData();
			setTaskAdded(false);
		}
	}, [taskAdded]);

	useEffect(() => {
		setTasks(data);
	}, [data]);
	return (
		<div className="grid grid-cols-7 gap-0 md:gap-1">
			<div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					openDialogIndex ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/>
			{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
				<div key={day} className="p-2 font-semibold text-center text-foreground">
					{day}
				</div>
			))}
			{days.map((day, index) => {
				const isCurrentMonth = day.getMonth() === currentMonth;
				const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
				const dayTasks = getTaskForDate(day, tasks);

				const isDialogOpen = openDialogIndex === index; //added to prevent aria-hidden warning
				return (
					<Sheet key={index} open={isDialogOpen} onOpenChange={(open) => setOpenDialogIndex(open ? index : null)} modal={false}>
						<SheetTrigger
							asChild
							onClick={() => {
								setUpdateData({
									calendar_add: true,
									assignee: selectedUser.id !== "undefined" ? selectedUser : null,
									assignee_id: selectedUser.id !== "undefined" ? selectedUser.id : null,
									start_date: format(day, "yyyy-MM-dd"),
									end_date: format(day, "yyyy-MM-dd"),
								});
								setOpenDialogIndex(index);
							}}
						>
							<div>
								{/* Calendar cell Clickable */}
								<div
									key={index}
									// onClick={() => handleCellClick(day)}
									className={`
										min-h-24 p-1 border transition-colors duration-200 cursor-pointer rounded-sm
										${isCurrentMonth ? "bg-white" : "bg-sidebar text-gray-400"} 
										${isToday ? "bg-blue-50 border-blue-200" : "border-gray-500"}
									`}
								>
									<div className="flex justify-between items-center">
										<span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day.getDate()}</span>
										{loading ? (
											<div className="flex flex-col w-full">
												<Skeleton index={index * 0.5} className="h-4 w-full bg-sidebar-border" />
											</div>
										) : (
											dayTasks?.length > 0 && (
												<span className="text-xs bg-muted-foreground text-background rounded-full px-1">{dayTasks?.length}</span>
											)
										)}
									</div>
									{loading ? (
										<div className="flex flex-col w-full">
											<Skeleton index={index * 0.5} className="h-4 mt-1 w-full bg-sidebar-border" />
											<Skeleton index={index * 0.5} className="h-4 mt-1 w-full bg-sidebar-border" />
											<Skeleton index={index * 0.5} className="h-4 mt-1 w-full bg-sidebar-border" />
										</div>
									) : (
										<div className="mt-1 space-y-1 overflow-y-auto max-h-20">
											{(dayTasks || []).slice(0, 3).map((task) => (
												<div
													key={task.id}
													onClick={(e) => {
														//set update data when a task is clicked
														e.stopPropagation();
														setUpdateData({});
														setTimeout(() => setUpdateData(task), 0);
														setOpenDialogIndex(index);
													}}
													className={`
											text-xxs md:text-xs py-1 md:p-1 rounded border truncate
											${statusColors[task.status] || "bg-gray-100 border-gray-300"}
										`}
												>
													<div className="flex items-center">
														<span>{task.title}</span>
													</div>
												</div>
											))}
											{dayTasks?.length > 3 && <div className="text-xs text-blue-600">+{dayTasks?.length - 3} more</div>}
										</div>
									)}
								</div>
							</div>
						</SheetTrigger>
						<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle>
									<div className="flex flex-row gap-5">
										<span>{updateData?.id ? "Update Task" : "Add Task"}</span>
										<span>{loading && <Loader2 className="animate-spin" />}</span>
									</div>
								</SheetTitle>
								<SheetDescription className="sr-only">Navigate through the app using the options below.</SheetDescription>
							</SheetHeader>
							<TaskForm
								users={users}
								categories={categories}
								isOpen={isDialogOpen}
								setIsOpen={(open) => setOpenDialogIndex(open ? index : null)}
								updateData={updateData}
								setUpdateData={setUpdateData}
								fetchData={fetchData}
								setTaskAdded={setTaskAdded}
							/>
						</SheetContent>
					</Sheet>
				);
			})}
		</div>
	);
}
