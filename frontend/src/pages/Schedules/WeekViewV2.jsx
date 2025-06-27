import axiosClient from "@/axios.client";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "../Tasks/form";
import { Skeleton } from "@/components/ui/skeleton";

export default function WeekViewV2({ getWeekDays, getTimeSlots, weekstart_date: weekStartDate, isInTimeSlot, statusColors, selectedUser }) {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const weekDays = getWeekDays(weekStartDate);
	const timeSlots = getTimeSlots();
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
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const taskResponse = await axiosClient.get("/task");
			setTasks(taskResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	return (
		<div className="overflow-x-auto">
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
				{weekDays.map((day, dayIndex) => {
					const formattedDate = format(day, "yyyy-MM-dd");
					const isToday = formattedDate === format(new Date(), "yyyy-MM-dd");
					const isDialogOpen = openDialogIndex === dayIndex; //added to prevent aria-hidden warning

					return (
						<Dialog key={dayIndex} open={isDialogOpen} onOpenChange={(open) => setOpenDialogIndex(open ? dayIndex : null)}>
							<DialogTrigger
								onClick={() => {
									setUpdateData({
										calendar_add: true,
										assignee: selectedUser.id !== "undefined" ? selectedUser : null,
										assignee_id: selectedUser.id !== "undefined" ? selectedUser.id : null,
										start_date: format(day, "yyyy-MM-dd"),
										end_date: format(day, "yyyy-MM-dd"),
									});
									setOpenDialogIndex(dayIndex);
								}}
							>
								<div key={dayIndex} className="col-span-1 min-w-32 text-left">
									<div className={`h-12 p-2 text-center font-medium ${isToday ? "text-blue-600" : ""}`}>
										<div>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()]}</div>
										<div className="text-sm">{day.getDate()}</div>
									</div>

									{timeSlots.map((time, timeIndex) => {
										const tasksInSlot = (Array.isArray(tasks) ? tasks : []).filter((s) => isInTimeSlot(s, time, day));
										return (
											<div
												key={`${dayIndex}-${timeIndex}`}
												// onClick={() => handleCellClick(day, time)}
												className={`
                                                h-16 p-1 border-t   relative
                                                ${isToday ? "bg-blue-50" : "bg-sidebar"} 
                                                ${timeIndex === timeSlots.length - 1 ? "border-b" : ""}
                                                ${dayIndex === 6 ? "border-r" : ""}
                                            `}
											>
												{loading ? (
													<div className="flex flex-col w-full">
														<div className="flex flex-row items-center gap-2">
															<Skeleton className="h-3 mt-1 w-1/3 bg-sidebar-border" />
															<Skeleton className="h-3 mt-1 w-2/3 bg-sidebar-border" />
														</div>
														<Skeleton className="h-3 mt-1 w-full bg-sidebar-border" />
														<Skeleton className="h-3 mt-1 w-full bg-sidebar-border" />
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
																setOpenDialogIndex(dayIndex);
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
							</DialogTrigger>
							<DialogContent>
								<DialogHeader className="text-left">
									<DialogTitle>{updateData?.calendar_add ? "Add to Calendar" : "Update Schedule"}</DialogTitle>
									<DialogDescription>
										{updateData?.calendar_add ? "Add task for" : "Update task for"} {selectedUser?.name}
									</DialogDescription>
								</DialogHeader>
								<div className="max-h-[80vh] overflow-y-auto scrollbar-custom">
									<TaskForm
										data={tasks}
										isOpen={isDialogOpen}
										setIsOpen={(open) => setOpenDialogIndex(open ? dayIndex : null)}
										updateData={updateData}
										setUpdateData={setUpdateData}
										fetchData={fetchData}
										setTaskAdded={setTaskAdded}
									/>
								</div>
							</DialogContent>
						</Dialog>
					);
				})}
			</div>
		</div>
	);
}
