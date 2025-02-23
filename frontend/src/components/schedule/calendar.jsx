import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subMonths, addMonths, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Calendar
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "../ui/label";
// import { toast } from "sonner";

const formSchema = z.object({
	employee: z.string(),
	event: z.string(),
	shift_start: z.date(),
	shift_end: z.date(),
});

export default function CalendarSchedule() {
	// CALENDAR Schedule
	const sampleEvent = {
		"2025-02-25": {
			employee: "Elizabeth Keen",
			event: "Meeting with the team of professionals",
			color: "green",
			shift_start: new Date("2025-02-25 12:23"),
			shift_end: new Date("2025-02-25 15:24"),
		},
		"2025-02-10": {
			employee: "John Doe",
			event: "Meeting with the team of professionals",
			color: "red",
			shift_start: new Date("2025-02-25 12:23"),
			shift_end: new Date("2025-02-25 15:23"),
		},
		"2025-02-14": {
			employee: "John Doe",
			event: "Meeting with the team of professionals Meeting with the team of professionals Meeting with the team of professionals",
			color: "blue",
			shift_start: new Date("2025-02-25 12:23"),
			shift_end: new Date("2025-02-25 15:23"),
		},
		"2025-02-11": {
			employee: "John Doe",
			event: "Meeting with the team of professionals",
			color: "yellow",
			shift_start: new Date("2025-02-25 12:23"),
			shift_end: new Date("2025-02-25 15:23"),
		},
	};
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [events, setEvents] = useState(sampleEvent);
	const [selectedDate, setSelectedDate] = useState(null);
	const [modalData, setModalData] = useState({ employee: undefined, event: undefined, shift_start: undefined, shift_end: undefined });
	const [hoveredEvent, setHoveredEvent] = useState(null);
	const startDate = startOfWeek(startOfMonth(currentMonth));
	const endDate = endOfWeek(endOfMonth(currentMonth));

	const days = [];
	let day = startDate;
	while (day <= endDate) {
		days.push(day);
		day = addDays(day, 1);
	}

	const openModal = (date) => {
		setSelectedDate(date);
		setModalData(events[date] || { employee: undefined, event: undefined, shift_start: undefined, shift_end: undefined });
	};

	const closeModal = () => {
		setSelectedDate(null);
		setModalData({ employee: undefined, event: undefined, shift_start: undefined, shift_end: undefined });
	};

	// Calendar Input
	const [date, setDate] = useState();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			employee: modalData?.employee || undefined,
			event: modalData?.event || undefined,
			shift_start: modalData?.shift_start || undefined,
			shift_end: modalData?.shift_end || undefined,
		},
	});

	useEffect(() => {
		form.reset({
			employee: modalData?.employee || undefined,
			event: modalData?.event || undefined,
			shift_start: modalData?.shift_start || undefined,
			shift_end: modalData?.shift_end || undefined,
		});
	}, [modalData, form]);

	const handleTimeChange = (type, value, field) => {
		const currentDate = form.getValues(field) || new Date();
		let newDate = new Date(currentDate);

		if (type === "hour") {
			const hour = parseInt(value, 10);
			newDate.setHours(hour);
		} else if (type === "minute") {
			newDate.setMinutes(parseInt(value, 10));
		}

		form.setValue(field, newDate);
	};

	const handleSubmit = (form) => {
		console.log({ ...form });
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
					const event = events[format(date, "yyyy-MM-dd")];
					return (
						<div
							key={index}
							className={`bg-${events[format(date, "yyyy-MM-dd")]?.color}-100 text-${events[format(date, "yyyy-MM-dd")]?.color}-900
							border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-gray-300 rounded-lg relative `}
							onClick={() => openModal(format(date, "yyyy-MM-dd"))}
							onMouseEnter={() => setHoveredEvent(event)}
							onMouseLeave={() => setHoveredEvent(null)}
						>
							<div className="text-sm font-bold">{format(date, "d")}</div>
							{event && (
								<div className="text-xs mt-1 line-clamp-3 overflow-hidden w-full">
									<span className=" font-black">{events[format(date, "yyyy-MM-dd")].employee}</span>:{" "}
									{events[format(date, "yyyy-MM-dd")].event}
								</div>
							)}
							{hoveredEvent === event && event && (
								<div
									className={`bg-${events[format(date, "yyyy-MM-dd")]?.color}-100 text-${
										events[format(date, "yyyy-MM-dd")]?.color
									}-900 absolute left-0 top-full mt-1 bg-white shadow-lg p-2 text-xs w-40 z-10 rounded`}
								>
									<strong>{event.employee}</strong>: {event.event}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{selectedDate && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
					<div className="bg-background p-6 rounded shadow-lg w-full max-w-md">
						<h3 className="text-lg font-bold mb-2">Event on {selectedDate}</h3>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
								<FormField
									control={form.control}
									name="employee"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Employee</FormLabel>
												<FormControl>
													<Input placeholder="Employee" {...field} value={field.value ?? ""} />
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="event"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Event</FormLabel>
												<FormControl>
													<Textarea placeholder="Event" {...field} value={field.value ?? ""} />
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="shift_start"
									render={({ field }) => {
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
																{field.value ? format(field.value, "hh:mm aa") : <span>hh:mm</span>}
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
																							field.value && field.value.getHours() === hour ? "default" : "ghost"
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
																						field.value && field.value.getMinutes() === minute ? "default" : "ghost"
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
																{field.value ? format(field.value, "hh:mm aa") : <span>hh:mm</span>}
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
																							field.value && field.value.getHours() === hour ? "default" : "ghost"
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
																						field.value && field.value.getMinutes() === minute ? "default" : "ghost"
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
								<div className="flex justify-between">
									<Button onClick={closeModal} type="button" variant="secondary">
										Cancel
									</Button>
									<Button type="submit">Submit</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			)}
		</div>
	);
}
