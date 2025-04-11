import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subMonths, addMonths, parse, subWeeks, addWeeks } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import CalendarCell from "./CalendarCell";
import axiosClient from "@/axios.client";
import { useToast } from "@/contexts/ToastContextProvider";
import WeekView from "./WeekView";
import { Skeleton } from "../../components/ui/skeleton";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import ScheduleForm from "./ScheduleForm";

const formSchema = z.object({
	// coerce ensures that even if it's a string, it will convert it to a number.
	event_id: z.coerce.number(),
	shift_start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Invalid time format (HH:MM:SS)"),
	shift_end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Invalid time format (HH:MM:SS)"),
	status: z.string(),
});

export default function CalendarSchedule({ events, schedules, setSchedules, selectedUser }) {
	const { loading, setLoading } = useLoadContext();
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [currentWeek, setCurrentWeek] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedScheduleId, setSelectedScheduleId] = useState(null);
	const [modalData, setModalData] = useState({ event: 0, shift_start: undefined, shift_end: undefined, status: "Select a status" });
	const [hoveredEvent, setHoveredEvent] = useState(null);
	const [viewMode, setViewMode] = useState("month"); // "month" or "week"
	const showToast = useToast();

	const startDate = startOfWeek(startOfMonth(currentMonth));
	const endDate = endOfWeek(endOfMonth(currentMonth));
	const days = [];
	let day = startDate;
	while (day <= endDate) {
		days.push(day);
		day = addDays(day, 1);
	}

	const matchingSchedule = (date) => {
		if (Array.isArray(schedules)) {
			return schedules.find((schedule) => format(schedule.date, "yyyy-MM-dd") === date);
		}
		return null;
	};

	const openModal = (date) => {
		const schedule = schedules.find((schedule) => format(schedule.date, "yyyy-MM-dd") === date);
		setSelectedDate(date);
		setSelectedScheduleId(schedule?.id);
		setModalData(
			schedule
				? { event_id: schedule?.event_id, shift_start: schedule?.shift_start, shift_end: schedule?.shift_end, status: schedule?.status }
				: { event_id: 0, shift_start: undefined, shift_end: undefined }
		);
	};

	// const closeModal = () => {
	// 	setSelectedScheduleId(null);
	// 	setSelectedDate(null);
	// 	setModalData({ event_id: 0, shift_start: undefined, shift_end: undefined, status: "Select a status" });
	// };

	// Calendar Input
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			event_id: modalData?.event_id || 0,
			shift_start: modalData?.shift_start || undefined,
			shift_end: modalData?.shift_end || undefined,
		},
	});

	useEffect(() => {
		form.reset({
			event_id: modalData?.event_id || 0,
			shift_start: modalData?.shift_start || undefined,
			shift_end: modalData?.shift_end || undefined,
			status: modalData?.status || "Select a status",
		});
	}, [modalData, form]);

	const handleTimeChange = (type, value, field) => {
		// Turn time to a date format to get hours and minutes
		const currentTime = form.getValues(field) ? parse(form.getValues(field), "HH:mm:ss", new Date()) : new Date();
		let newDate = new Date(currentTime);
		if (type === "hour") {
			const hour = parseInt(value, 10);
			newDate.setHours(hour);
		} else if (type === "minute") {
			newDate.setMinutes(parseInt(value, 10));
		}
		// Turn back time format to string for expected field value
		form.setValue(field, format(newDate, "HH:mm:ss"));
	};

	const handleSubmit = async (form) => {
		setLoading(true);
		const newForm = { ...form, user_id: selectedUser?.id, date: selectedDate };
		try {
			let scheduleResponse;
			if (selectedScheduleId) {
				scheduleResponse = await axiosClient.put(`/schedule/${selectedScheduleId}`, newForm);
				const updatedSchedule = scheduleResponse.data;
				// Update one object from schedules array based on the updated schedule
				const updatedSchedules = schedules.map((schedule) => (schedule.id === updatedSchedule.id ? updatedSchedule : schedule));
				setSchedules(updatedSchedules);
				showToast("Success!", "Schedule updated.", 3000);
			} else {
				scheduleResponse = await axiosClient.post(`/schedule`, newForm);
				const updatedSchedule = scheduleResponse.data;
				// Add one object from schedules array based on the added schedule
				const updatedSchedules = [...schedules, updatedSchedule];
				setSchedules(updatedSchedules);
				setSelectedScheduleId(updatedSchedule?.id);
				// set modal data to be able to update it after adding
				setModalData(newForm);
				showToast("Success!", "Schedule added.", 3000);
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 7000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	const handleDelete = async () => {
		setLoading(true);
		try {
			let scheduleResponse;
			scheduleResponse = await axiosClient.delete(`/schedule/${selectedScheduleId}`, selectedUser?.id);
			setSchedules(scheduleResponse.data);
			showToast("Success!", "Schedule deleted.", 3000);
			setSelectedScheduleId(null);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 7000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};

	return (
		<div className="p-1 md:p-4 mx-auto mt-5">
			<div className="flex flex-col justify-center gap-2">
				<h2 className="block md:hidden text-xl font-bold text-center">{format(currentMonth, "MMMM yyyy")}</h2>
				<div className="flex flex-row justify-between">
					<div className="flex justify-start gap-2 mb-4">
						<Button variant={`${viewMode === "month" ? "" : "outline"}`} onClick={() => setViewMode("month")} disabled={loading}>
							Month View
						</Button>
						<Button variant={`${viewMode === "week" ? "" : "outline"}`} onClick={() => setViewMode("week")} disabled={loading}>
							Week View
						</Button>
					</div>
					<h2 className="hidden md:block text-xl font-bold text-center">{format(currentMonth, "MMMM yyyy")}</h2>
					{viewMode == "month" ? (
						<div className="flex justify-end mb-4 gap-2">
							<Button variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
								Prev
							</Button>
							<Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
								Next
							</Button>
						</div>
					) : (
						<div className="flex justify-end mb-4 gap-2">
							<Button variant="outline" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
								Prev
							</Button>
							<Button variant="outline" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
								Next
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className="  overflow-auto border border-foreground rounded-xl">
				{viewMode === "month" ? (
					<div className="bg-background text-foreground grid grid-cols-7 gap-0 md:gap-1 rounded-lg p-2 md:p-8 mt-10 text-xs sm:text-base">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
							<div key={d} className="text-center font-semibold my-4">
								{d}
							</div>
						))}
						{days.map((date, index) => {
							const formattedSchedules = matchingSchedule(format(date, "yyyy-MM-dd"));
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
											className={`${
												format(date, "yyyy-MM-dd") == format(new Date(), "yyyy-MM-dd")
													? "outline outline-5 outline-foreground rounded-lg"
													: ""
											}`}
										>
											<CalendarCell
												color={color}
												loading={loading}
												formattedSchedules={formattedSchedules}
												hoveredEvent={hoveredEvent}
												setHoveredEvent={setHoveredEvent}
												openModal={openModal}
												date={date}
											/>
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
				) : (
					<>
						{!loading ? (
							<WeekView
								currentWeek={currentWeek}
								schedules={schedules}
								loading={loading}
								openModal={openModal}
								hoveredEvent={hoveredEvent}
								setHoveredEvent={setHoveredEvent}
								form={form}
								modalData={modalData}
								events={events}
								selectedScheduleId={selectedScheduleId}
								handleTimeChange={handleTimeChange}
								handleSubmit={handleSubmit}
								handleDelete={handleDelete}
							/>
						) : (
							<div className="flex flex-col space-1 md:space-y-3 w-full">
								{Array.from({ length: 26 }).map((_, i) => (
									<div key={i} className="flex flex-row gap-2">
										<Skeleton className="h-4 w-1/5" />
										<Skeleton className="h-4 w-1/5" />
										<Skeleton className="h-4 w-1/5" />
										<Skeleton className="h-4 w-1/5" />
										<Skeleton className="h-4 w-1/5" />
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
