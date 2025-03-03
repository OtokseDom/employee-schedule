import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	subMonths,
	addMonths,
	startOfYear,
	endOfYear,
	eachMonthOfInterval,
	parse,
} from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Calendar
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "../ui/label";
import CalendarCell from "./CalendarCell";
import axiosClient from "@/axios.client";
// import { toast } from "sonner";

const formSchema = z.object({
	// coerce ensures that even if it's a string, it will convert it to a number.
	event_id: z.coerce.number(),
	shift_start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Invalid time format (HH:MM:SS)"),
	shift_end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Invalid time format (HH:MM:SS)"),
});

export default function CalendarSchedule({ employees, events, schedules, setSchedules, loading, setLoading, selectedEmployee }) {
	// TODO: opening modal not getting schdule data
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(null);
	const [modalData, setModalData] = useState({ event: 0, shift_start: undefined, shift_end: undefined });
	const [hoveredEvent, setHoveredEvent] = useState(null);
	const startDate = startOfWeek(startOfMonth(currentMonth));
	const endDate = endOfWeek(endOfMonth(currentMonth));
	const days = [];
	const [message, setMessage] = useState({ code: null, message: null });
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
		setModalData(
			schedule
				? { event_id: schedule?.event_id, shift_start: schedule?.shift_start, shift_end: schedule?.shift_end }
				: { event_id: 0, shift_start: undefined, shift_end: undefined }
		);
	};

	const closeModal = () => {
		setSelectedDate(null);
		setMessage({ code: null, message: null });
		setModalData({ event_id: 0, shift_start: undefined, shift_end: undefined });
	};

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
		const newForm = { ...form, employee_id: selectedEmployee?.id, date: selectedDate, status: "Pending" };
		try {
			let scheduleResponse;
			if (modalData?.event_id > 0) {
				scheduleResponse = await axiosClient.put(`/schedule/${selectedEmployee?.id}`, newForm);
				const updatedSchedule = scheduleResponse.data;
				// Update one object from schedules array based on the updated schedule
				const updatedSchedules = schedules.map((schedule) => (schedule.id === updatedSchedule.id ? updatedSchedule : schedule));
				setSchedules(updatedSchedules);
				setMessage({ message: "Successfully Updated!" });
			} else {
				scheduleResponse = await axiosClient.post(`/schedule`, newForm);
				const updatedSchedule = scheduleResponse.data;
				// Add one object from schedules array based on the added schedule
				const updatedSchedules = [...schedules, updatedSchedule];
				setSchedules(updatedSchedules);
				setMessage({ message: "Successfully Added!" });
			}
		} catch (e) {
			setMessage({ code: e.status, message: e.response.data.message });
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
		// Reset the message after 5 seconds
		setTimeout(() => {
			setMessage({ code: null, message: null });
		}, 5000); // 5000 milliseconds = 5 seconds
	};

	return (
		<div className="p-1 md:p-4 max-w-3xl mx-auto mt-5">
			<div className="flex justify-between mb-4">
				<button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 border rounded">
					Prev
				</button>
				<h2 className="text-xl font-bold text-center">{format(currentMonth, "MMMM yyyy")}</h2>
				<button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 border rounded">
					Next
				</button>
			</div>
			<div className="bg-background text-foreground grid grid-cols-7 gap-0 md:gap-1  rounded-lg p-2 md:p-8 mt-10 text-xs sm:text-base">
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
						<CalendarCell
							key={index}
							color={color}
							loading={loading}
							formattedSchedules={formattedSchedules}
							hoveredEvent={hoveredEvent}
							setHoveredEvent={setHoveredEvent}
							openModal={openModal}
							date={date}
						/>
					);
				})}
			</div>

			{selectedDate && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
					<div className="bg-background p-6 rounded shadow-lg w-full max-w-md">
						<h3 className="text-lg font-bold mb-2">
							Event on {format(selectedDate, "MMMM d, yyyy")} for {selectedEmployee?.name}
						</h3>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
								<FormField
									control={form.control}
									name="event_id"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Event</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select an event">
																{modalData.event_id && !field.value
																	? events.find((event) => event?.id == modalData.event)?.name
																	: field.value
																	? events.find((event) => event?.id == field.value)?.name
																	: "Select an event"}
															</SelectValue>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Array.isArray(events) && events.length > 0 ? (
															events?.map((event) => (
																<SelectItem key={event?.id} value={event?.id}>
																	{event?.name}
																</SelectItem>
															))
														) : (
															<SelectItem disabled>No events available</SelectItem>
														)}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="shift_start"
									render={({ field }) => {
										const parsedTime = field.value ? parse(field.value, "HH:mm:ss", new Date()) : null;
										return (
											<FormItem>
												<FormLabel>Shift Start</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={"outline"}
																className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
															>
																{field.value ? format(parsedTime, "hh:mm aa") : <span>hh:mm</span>}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<div className="sm:flex">
															<div className="flex sm:flex-col">
																<div className="hidden md:flex justify-between py-6">
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Hour</Label>
																	</div>
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Minute</Label>
																	</div>
																</div>
																<div className="flex flex-col sm:flex-row sm:h-[300px] border-t divide-y sm:divide-y-0 sm:divide-x">
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 24 }, (_, i) => i)
																				.reverse()
																				.map((hour) => (
																					<Button
																						key={hour}
																						size="icon"
																						variant={
																							field.value && parsedTime.getHours() === hour ? "default" : "ghost"
																						}
																						className="sm:w-full shrink-0 aspect-square"
																						onClick={() => handleTimeChange("hour", hour.toString(), "shift_start")}
																					>
																						{hour}
																					</Button>
																				))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
																				<Button
																					key={minute}
																					size="icon"
																					variant={
																						field.value && parsedTime.getMinutes() === minute ? "default" : "ghost"
																					}
																					className="sm:w-full shrink-0 aspect-square"
																					onClick={() => handleTimeChange("minute", minute.toString(), "shift_start")}
																				>
																					{minute.toString().padStart(2, "0")}
																				</Button>
																			))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																</div>
															</div>
														</div>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="shift_end"
									render={({ field }) => {
										const parsedTime = field.value ? parse(field.value, "HH:mm:ss", new Date()) : null;
										return (
											<FormItem>
												<FormLabel>Shift End</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={"outline"}
																className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
															>
																{field.value ? format(parsedTime, "hh:mm aa") : <span>hh:mm</span>}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<div className="sm:flex">
															<div className="flex sm:flex-col">
																<div className="hidden md:flex justify-between py-6">
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Hour</Label>
																	</div>
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Minute</Label>
																	</div>
																</div>
																<div className="flex flex-col sm:flex-row sm:h-[300px] border-t divide-y sm:divide-y-0 sm:divide-x">
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 24 }, (_, i) => i)
																				.reverse()
																				.map((hour) => (
																					<Button
																						key={hour}
																						size="icon"
																						variant={
																							field.value && parsedTime.getHours() === hour ? "default" : "ghost"
																						}
																						className="sm:w-full shrink-0 aspect-square"
																						onClick={() => handleTimeChange("hour", hour.toString(), "shift_end")}
																					>
																						{hour}
																					</Button>
																				))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
																				<Button
																					key={minute}
																					size="icon"
																					variant={
																						field.value && parsedTime.getMinutes() === minute ? "default" : "ghost"
																					}
																					className="sm:w-full shrink-0 aspect-square"
																					onClick={() => handleTimeChange("minute", minute.toString(), "shift_end")}
																				>
																					{minute.toString().padStart(2, "0")}
																				</Button>
																			))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																</div>
															</div>
														</div>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								{message.code == 422 ? (
									<div className="flex justify-center text-red-500">{message.message}</div>
								) : (
									<div className="flex justify-center text-green-500">{message.message}</div>
								)}

								<div className="flex justify-between">
									<Button onClick={closeModal} type="button" variant="secondary">
										Cancel
									</Button>
									<Button type="submit" disabled={loading}>
										{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />} Submit
									</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			)}
		</div>
	);
}
