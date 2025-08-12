"use client";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import TaskForm from "../Tasks/form";
import { Skeleton } from "@/components/ui/skeleton";
import History from "@/components/task/History";
import { flattenTasks } from "@/utils/taskHelpers";

export default function Week({
	data,
	projects,
	users,
	categories,
	fetchData,
	getWeekDays,
	getTimeSlots,
	weekstart_date: weekStartDate,
	isInTimeSlot,
	statusColors,
	selectedUser,
	showHistory,
	setShowHistory,
	taskHistory,
}) {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState(data);
	const weekDays = getWeekDays(weekStartDate);
	const timeSlots = getTimeSlots();
	const [openDialogIndex, setOpenDialogIndex] = useState(null);
	const [updateData, setUpdateData] = useState({});
	const [taskAdded, setTaskAdded] = useState(false);
	const [selectedTaskHistory, setSelectedTaskHistory] = useState([]);

	useEffect(() => {
		if (taskAdded) {
			fetchData();
			setTaskAdded(false);
		}
	}, [taskAdded]);

	useEffect(() => {
		setTasks(data);
	}, [data]);
	useEffect(() => {
		if (!openDialogIndex) setShowHistory(false);
	}, [openDialogIndex]);
	return (
		<div className="overflow-x-auto">
			<div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					openDialogIndex ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/>
			<div className="min-w-max grid grid-cols-8 gap-1">
				{/* Time column */}
				<div className="col-span-1">
					<div className="h-12 p-2"></div> {/* Empty header cell */}
					{timeSlots.map((time) => {
						const [hour, minute] = time.split(":").map(Number);
						const date = new Date();
						date.setHours(hour, minute, 0, 0);
						return (
							<div key={time} className="h-16 p-2 text-xs text-right pr-2 text-gray-500">
								{format(date, "hh:mm a")}
							</div>
						);
					})}
				</div>

				{/* Days columns */}
				{weekDays.map((day, index) => {
					const formattedDate = format(day, "yyyy-MM-dd");
					const isToday = formattedDate === format(new Date(), "yyyy-MM-dd");
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
								<div key={index} className="col-span-1 min-w-32 text-left cursor-pointer">
									<div className={`h-12 p-2 text-center font-medium ${isToday ? "text-blue-600" : ""}`}>
										<div>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()]}</div>
										<div className="text-sm">{day.getDate()}</div>
									</div>

									{timeSlots.map((time, timeIndex) => {
										const tasksInSlot = (Array.isArray(tasks) ? tasks : []).filter((s) => isInTimeSlot(s, time, day));
										return (
											<div
												key={`${index}-${timeIndex}`}
												className={`
                                                h-16 p-1 border-t   relative
                                                ${isToday ? "bg-blue-50" : "bg-sidebar"} 
                                                ${timeIndex === timeSlots.length - 1 ? "border-b" : ""}
                                                ${index === 6 ? "border-r" : ""}
                                            `}
											>
												{loading ? (
													<div className="flex flex-col w-full">
														<div className="flex flex-row items-center gap-2">
															<Skeleton index={timeIndex * 0.5} className="h-3 mt-1 w-1/3 bg-sidebar-border" />
															<Skeleton index={timeIndex * 0.5} className="h-3 mt-1 w-2/3 bg-sidebar-border" />
														</div>
														<Skeleton index={timeIndex * 0.5} className="h-3 mt-1 w-full bg-sidebar-border" />
														<Skeleton index={timeIndex * 0.5} className="h-3 mt-1 w-full bg-sidebar-border" />
													</div>
												) : (
													""
												)}
												{tasksInSlot.map((task) => {
													// Calculate position and height based on time
													const [startHour, startMin] = task.start_time?.split(":").map(Number);
													const formattedStartTime = new Date();
													formattedStartTime.setHours(startHour, startMin, 0, 0);

													const [endHour, endMin] = task.end_time?.split(":").map(Number);
													const formattedEndTime = new Date();
													formattedEndTime.setHours(endHour, endMin, 0, 0);
													const [slotHour] = time.split(":").map(Number);
													// Only show if this is the starting slot for this task
													if (startHour !== slotHour) return null;

													// Calculate duration in hours
													const duration = endHour - startHour + (endMin - startMin) / 60;
													// console.log(duration ?? duration);
													return (
														<div
															key={task.id}
															onClick={(e) => {
																//set update data when a task is clicked
																e.stopPropagation();
																setUpdateData({});
																setTimeout(() => setUpdateData(task), 0);
																setOpenDialogIndex(index);
																const filteredHistory = taskHistory.filter((th) => th.task_id === task.id);
																setSelectedTaskHistory(filteredHistory);
															}}
															className={`
														absolute left-0 right-0 mx-1 p-1 rounded border z-10 overflow-clip
														${statusColors[task.status] || "bg-gray-100 border-gray-300 text-black"}
														`}
															style={{ height: `${duration * 4}rem`, top: `${(startMin / 60) * 4}rem` }}
														>
															<div className="text-xs flex items-center gap-1 truncate">
																{format(formattedStartTime, "hh:mm a")} - {format(formattedEndTime, "hh:mm a")}
															</div>
															<div className={`text-xs mt-2`}>
																<b>Title:</b> {task.title}
															</div>
															<div className="text-xs mt-2 font-medium">
																<b>Description:</b> {task.description}
															</div>
														</div>
													);
												})}
											</div>
										);
									})}
								</div>
							</SheetTrigger>
							<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
								<SheetHeader>
									<SheetTitle>
										{Object.keys(updateData).length > 0 && !updateData?.calendar_add ? (
											<div className="flex flex-row items-center">
												<div className="flex flex-row w-fit h-fit bg-card rounded-sm text-base">
													<div className={`w-fit py-2 px-5 ${!showHistory ? "bg-secondary" : "text-muted-foreground"} rounded`}>
														<button onClick={() => setShowHistory(false)}>Update Task</button>
													</div>
													<div className={`w-fit py-2 px-5 ${showHistory ? "bg-secondary" : "text-muted-foreground"} rounded`}>
														<button onClick={() => setShowHistory(true)}>History</button>
													</div>
												</div>
												<span>{loading && <Loader2 className="animate-spin" />}</span>
											</div>
										) : (
											"Add Task"
										)}
									</SheetTitle>
									<SheetDescription className="sr-only">Navigate through the app using the options below.</SheetDescription>
								</SheetHeader>
								{showHistory ? (
									<History selectedTaskHistory={selectedTaskHistory} />
								) : (
									<TaskForm
										tasks={flattenTasks(data)}
										projects={projects}
										users={users}
										categories={categories}
										isOpen={isDialogOpen}
										setIsOpen={(open) => setOpenDialogIndex(open ? index : null)}
										updateData={updateData}
										setUpdateData={setUpdateData}
										fetchData={fetchData}
										setTaskAdded={setTaskAdded}
									/>
								)}
							</SheetContent>
						</Sheet>
					);
				})}
			</div>
		</div>
	);
}
