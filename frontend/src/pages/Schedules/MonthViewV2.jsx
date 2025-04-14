import { format } from "date-fns";
import React from "react";

export default function MonthViewV2({ days, currentMonth, getSchedulesForDate, handleCellClick, handleScheduleClick, statusColors }) {
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

				return (
					<div
						key={index}
						onClick={() => handleCellClick(day)}
						className={`
                min-h-24 p-1 border transition-colors duration-200 cursor-pointer rounded-sm
                ${isCurrentMonth ? "bg-white" : "bg-sidebar text-gray-400"} 
                ${isToday ? "bg-blue-50 border-blue-200" : "border-gray-500"}
              `}
					>
						<div className="flex justify-between items-center">
							<span className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day.getDate()}</span>
							{daySchedules.length > 0 && (
								<span className="text-xs bg-muted-foreground text-background rounded-full px-1">{daySchedules.length}</span>
							)}
						</div>

						<div className="mt-1 space-y-1 overflow-y-auto max-h-20">
							{daySchedules.slice(0, 3).map((schedule) => (
								<div
									key={schedule.id}
									onClick={(e) => handleScheduleClick(schedule, e)}
									className={`
                      text-xs p-1 rounded border truncate
                      ${statusColors[schedule.status] || "bg-gray-100 border-gray-300"}
                    `}
								>
									<div className="flex items-center gap-1">
										<span>{schedule.startTime.substring(0, 5)}</span>
										<span className="truncate">{schedule.title}</span>
									</div>
								</div>
							))}
							{daySchedules.length > 3 && <div className="text-xs text-blue-600">+{daySchedules.length - 3} more</div>}
						</div>
					</div>
				);
			})}
		</div>
	);
}
