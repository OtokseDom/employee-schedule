import React from "react";
import { format, addDays, startOfWeek, addHours, startOfDay, parse, min, max, subHours } from "date-fns";
import CalendarCell from "./CalendarCell";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ScheduleForm from "./ScheduleForm";

export default function WeekView({
	currentWeek,
	schedules,
	loading,
	openModal,
	hoveredEvent,
	setHoveredEvent,
	form,
	modalData,
	events,
	handleTimeChange,
	handleSubmit,
	handleDelete,
	selectedScheduleId,
}) {
	const startDate = startOfWeek(currentWeek);
	const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

	const matchingSchedule = (date) => {
		if (Array.isArray(schedules)) {
			return schedules.find((schedule) => format(schedule.date, "yyyy-MM-dd") === date);
		}
		return null;
	};

	const getEventStyle = (shiftStart, shiftEnd) => {
		const startHour = shiftStart.getHours() - minTime.getHours();
		const startMinutes = shiftStart.getMinutes();
		const endHour = shiftEnd.getHours() - minTime.getHours();
		const endMinutes = shiftEnd.getMinutes();
		const durationMinutes = endHour * 60 + endMinutes - (startHour * 60 + startMinutes) - (startMinutes + endMinutes); //- (startMinutes + endMinutes) is for offset

		return {
			top: `${startHour * 50 + (startMinutes / 60) * 50}px`, // Each hour is 50px high, calculate top position considering minutes
			height: `${(durationMinutes / 60) * 50}px`, // Duration in minutes converted to height in pixels
			marginTop: "75px",
		};
	};

	// Calculate min start time and max end time for the active week
	const eventTimes = schedules.flatMap((schedule) => {
		const scheduleDate = format(schedule.date, "yyyy-MM-dd");
		if (scheduleDate >= format(startDate, "yyyy-MM-dd") && scheduleDate < format(addDays(startDate, 7), "yyyy-MM-dd")) {
			const shiftStart = schedule?.shift_start ?? null;
			const shiftEnd = schedule?.shift_end ?? null;
			return shiftStart && shiftEnd ? [parse(shiftStart, "HH:mm:ss", new Date()), parse(shiftEnd, "HH:mm:ss", new Date())] : [];
		}
		return [];
	});

	const defaultMinTime = addHours(startOfDay(new Date()), 6);
	const defaultMaxTime = addHours(startOfDay(new Date()), 16);

	let minTime = eventTimes.length ? min(eventTimes) : defaultMinTime;
	let maxTime = eventTimes.length ? max(eventTimes) : defaultMaxTime;
	// Ensure at least 10 hours are displayed
	const hourDiff = subHours(maxTime, minTime.getHours()).getHours();
	if (hourDiff < 10) {
		const additionalHours = 10 - hourDiff;
		if (maxTime.getHours() + additionalHours > 23) {
			const hoursToAddToMax = 23 - maxTime.getHours();
			const hoursToSubtractFromMin = additionalHours - hoursToAddToMax;
			maxTime = addHours(maxTime, hoursToAddToMax);
			minTime = subHours(minTime, hoursToSubtractFromMin);
		} else {
			maxTime = addHours(maxTime, additionalHours);
		}
	}

	const hours = Array.from({ length: maxTime.getHours() - minTime.getHours() + 1 }, (_, i) => addHours(minTime, i));
	return (
		<div className="bg-background text-foreground grid grid-cols-8 rounded-lg p-2 md:p-8 mt-10 text-sm min-w-[1000px] relative">
			<div className="col-span-1 sticky left-0 bg-background z-10 mt-20">
				{hours.map((hour, index) => (
					<div key={index} className="h-12 border-t bg-background border-gray-200 text-center">
						{format(hour, "h a")}
					</div>
				))}
			</div>
			<div className="col-span-7 relative">
				<div className="absolute top-0 left-0 right-0 bottom-0 grid grid-rows-24 grid-cols-7 pointer-events-none">
					{Array.from({ length: 49 }).map((_, i) => (
						<div key={i} className="border-l border-gray-200"></div>
					))}
				</div>
				<div className="grid grid-cols-7 gap-0 md:gap-1 relative">
					{days.map((date, index) => {
						const formattedSchedules = matchingSchedule(format(date, "yyyy-MM-dd"));
						const shiftStart = formattedSchedules?.shift_start ? parse(formattedSchedules.shift_start, "HH:mm:ss", new Date()) : null;
						const shiftEnd = formattedSchedules?.shift_end ? parse(formattedSchedules.shift_end, "HH:mm:ss", new Date()) : null;
						const status = formattedSchedules?.status;
						let color = "";

						switch (status) {
							case "Pending":
								color = "yellow";
								break;
							case "In Progress":
								color = "blue";
								break;
							case "Completed":
								color = "green";
								break;
							case "Cancelled":
								color = "red";
								break;
							default:
								color = "gray";
								break;
						}
						return (
							<Dialog key={index}>
								<DialogTrigger onClick={() => openModal(format(date, "yyyy-MM-dd"))}>
									<div
										key={index}
										className={`col-span-1 border-b border-foreground relative  ${
											format(date, "yyyy-MM-dd") == format(new Date(), "yyyy-MM-dd") ? "bg-secondary" : ""
										}`}
									>
										<div className={` text-center font-semibold my-4`}>
											{format(date, "MMM d")}
											<br />
											{format(date, "EEEE")}
										</div>
										{formattedSchedules && shiftStart && shiftEnd && (
											<div
												className={`flex flex-col absolute left-0 right-0 bg-${color}-100 text-${color}-900 border border-foreground p-2 rounded-lg line-clamp-3 overflow-hidden`}
												style={getEventStyle(shiftStart, shiftEnd)}
												onClick={() => openModal(format(date, "yyyy-MM-dd"))}
												onMouseEnter={() => setHoveredEvent(formattedSchedules)}
												onMouseLeave={() => setHoveredEvent(null)}
											>
												<span className=" font-bold">{formattedSchedules?.event?.name}</span>
												<br />
												<span className="text-xs">
													{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
												</span>
												<br />
												<span>{formattedSchedules?.event?.description}</span>
											</div>
										)}
									</div>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you absolutely sure?</DialogTitle>
										<DialogDescription>This action cannot be undone.</DialogDescription>
									</DialogHeader>
									<ScheduleForm
										form={form}
										modalData={modalData}
										events={events}
										loading={loading}
										selectedScheduleId={selectedScheduleId}
										handleTimeChange={handleTimeChange}
										handleSubmit={handleSubmit}
										handleDelete={handleDelete}
									/>
								</DialogContent>
							</Dialog>
						);
					})}
				</div>
			</div>
		</div>
	);
}
