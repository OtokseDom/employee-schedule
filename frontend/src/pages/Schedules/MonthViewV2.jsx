import { Skeleton } from "@/components/ui/skeleton";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import TaskForm from "../Tasks/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosClient from "@/axios.client";

export default function MonthViewV2({ days, currentMonth, getSchedulesForDate, handleCellClick, handleScheduleClick, statusColors }) {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
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
		<div className="grid grid-cols-7 gap-1">
			{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
				<div key={day} className="p-2 font-semibold text-center text-foreground">
					{day}
				</div>
			))}
			{days.map((day, index) => {
				const isCurrentMonth = day.getMonth() === currentMonth;
				// const isToday = formatDate(day) === formatDate(new Date());
				const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
				const daySchedules = getSchedulesForDate(day);
				// const daySchedules = schedules.filter((s) => formatDate(s.start_time) === formatDate(day));

				return (
					<Dialog key={index}>
						<DialogTrigger>
							{/* <DialogTrigger onClick={() => openModal(format(date, "yyyy-MM-dd"))}> */}
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
												<Skeleton className="h-4 w-full" />
											</div>
										) : (
											daySchedules.length > 0 && (
												<span className="text-xs bg-muted-foreground text-background rounded-full px-1">{daySchedules.length}</span>
											)
										)}
									</div>
									{loading ? (
										<div className="flex flex-col w-full">
											<Skeleton className="h-4 mt-1 w-full" />
											<Skeleton className="h-4 mt-1 w-full" />
											<Skeleton className="h-4 mt-1 w-full" />
										</div>
									) : (
										<div className="mt-1 space-y-1 overflow-y-auto max-h-20">
											{daySchedules.slice(0, 3).map((schedule) => (
												<div
													key={schedule.id}
													// onClick={(e) => handleScheduleClick(schedule, e)}
													className={`
											text-xs p-1 rounded border truncate
											${statusColors[schedule.status] || "bg-gray-100 border-gray-300"}
										`}
												>
													<div className="flex items-center gap-1">
														<span>{schedule.start_time.substring(0, 5)}</span>
														<span className="truncate">{schedule.title}</span>
													</div>
												</div>
											))}
											{daySchedules.length > 3 && <div className="text-xs text-blue-600">+{daySchedules.length - 3} more</div>}
										</div>
									)}
								</div>
							</div>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader className="text-left">
								<DialogTitle>Update Schedule</DialogTitle>
								<DialogDescription>Update schedule for </DialogDescription>
							</DialogHeader>
							<div className="max-h-[80vh] overflow-y-auto scrollbar-custom">
								<TaskForm
									data={tasks}
									setTasks={setTasks}
									// isOpen={isOpen}
									// setIsOpen={setIsOpen}
									updateData={updateData}
									setUpdateData={setUpdateData}
									fetchData={fetchData}
								/>
							</div>
						</DialogContent>
					</Dialog>
				);
			})}
		</div>
	);
}
