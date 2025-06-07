import { format } from "date-fns";
import { Clock } from "lucide-react";
import React from "react";

export default function WeekViewV2({
	getWeekDays,
	getTimeSlots,
	weekStartDate,
	isScheduleInTimeSlot,
	schedules,
	statusColors,
	handleCellClick,
	handleScheduleClick,
}) {
	const weekDays = getWeekDays(weekStartDate);
	const timeSlots = getTimeSlots();

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

					return (
						<div key={dayIndex} className="col-span-1 min-w-32">
							<div className={`h-12 p-2 text-center font-medium ${isToday ? "text-blue-600" : ""}`}>
								<div>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.getDay()]}</div>
								<div className="text-sm">{day.getDate()}</div>
							</div>

							{timeSlots.map((time, timeIndex) => {
								const schedulesInSlot = schedules.filter((s) => isScheduleInTimeSlot(s, time, day));

								return (
									<div
										key={`${dayIndex}-${timeIndex}`}
										onClick={() => handleCellClick(day, time)}
										className={`
                                                h-16 p-1 border-t   relative
                                                ${isToday ? "bg-blue-50" : "bg-sidebar"} 
                                                ${timeIndex === timeSlots.length - 1 ? "border-b" : ""}
                                                ${dayIndex === 6 ? "border-r" : ""}
                                            `}
									>
										{schedulesInSlot.map((schedule) => {
											// Calculate position and height based on time
											const [startHour, startMin] = schedule.start_time.split(":").map(Number);
											const formattedStartTime = new Date();
											formattedStartTime.setHours(startHour, startMin, 0, 0);

											const [endHour, endMin] = schedule.end_time.split(":").map(Number);
											const formattedEndTime = new Date();
											formattedEndTime.setHours(endHour, endMin, 0, 0);
											const [slotHour] = time.split(":").map(Number);

											// Only show if this is the starting slot for this schedule
											if (startHour !== slotHour) return null;

											// Calculate duration in hours
											const duration = endHour - startHour + (endMin - startMin) / 60;

											return (
												<div
													key={schedule.id}
													onClick={(e) => handleScheduleClick(schedule, e)}
													className={`
                                                        absolute left-0 right-0 mx-1 p-1 rounded border overflow-hidden
                                                        ${statusColors[schedule.status] || "bg-gray-100 border-gray-300"}
                                                        `}
													style={{ height: `${duration * 4}rem` }}
												>
													<div className="text-xs font-medium truncate">{schedule.title}</div>
													<div className="text-xs flex items-center gap-1 truncate">
														<Clock className="w-3 h-3" />
														{format(formattedStartTime, "hh:mm a")} - {format(formattedEndTime, "hh:mm a")}
													</div>
												</div>
											);
										})}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
}
