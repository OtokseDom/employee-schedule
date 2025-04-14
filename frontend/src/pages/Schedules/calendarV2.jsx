import { useState, useEffect } from "react";
import axiosClient from "@/axios.client";
import { Calendar, ChevronLeft, ChevronRight, Clock, Edit3, Users, Plus, X, Check, Trash } from "lucide-react";
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths } from "date-fns";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Contexts
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import WeekViewV2 from "./WeekViewV2";

// Mock data for demonstration
const mockUsers = [
	{ id: 11, name: "John Doe" },
	{ id: 2, name: "Jane Smith" },
	{ id: 3, name: "Bob Johnson" },
];

const mockSchedules = [
	{
		id: 1,
		title: "Project Planning",
		category: "Meeting",
		startDate: "2025-04-13",
		endDate: "2025-04-13",
		startTime: "09:00",
		endTime: "10:30",
		description: "Discuss project roadmap and milestones",
		assignee: 11,
		status: "Scheduled",
	},
	{
		id: 2,
		title: "Code Review",
		category: "Work",
		startDate: "2025-04-14",
		endDate: "2025-04-14",
		startTime: "13:00",
		endTime: "15:00",
		description: "Review pull requests for the new feature",
		assignee: 11,
		status: "Pending",
	},
	{
		id: 3,
		title: "Client Meeting",
		category: "Meeting",
		startDate: "2025-04-15",
		endDate: "2025-04-15",
		startTime: "11:00",
		endTime: "12:00",
		description: "Discuss project requirements with client",
		assignee: 2,
		status: "Scheduled",
	},
	{
		id: 4,
		title: "Team Building",
		category: "Event",
		startDate: "2025-04-16",
		endDate: "2025-04-16",
		startTime: "15:00",
		endTime: "17:00",
		description: "Team building activity",
		assignee: 11,
		status: "Confirmed",
	},
	{
		id: 5,
		title: "Weekly Report",
		category: "Task",
		startDate: "2025-04-12",
		endDate: "2025-04-12",
		startTime: "14:00",
		endTime: "16:00",
		description: "Prepare weekly progress report",
		assignee: 3,
		status: "Completed",
	},
	{
		id: 6,
		title: "I love you bby",
		category: "Meeting",
		startDate: "2025-04-13",
		endDate: "2025-04-13",
		startTime: "10:00",
		endTime: "11:30",
		description: "Discuss project roadmap and milestones",
		assignee: 11,
		status: "Cancelled",
	},
];

// Status colors
const statusColors = {
	Scheduled: "bg-blue-100 border-blue-300 text-blue-800",
	Pending: "bg-yellow-100 border-yellow-300 text-yellow-800",
	Confirmed: "bg-green-100 border-green-300 text-green-800",
	Completed: "bg-gray-100 border-gray-300 text-gray-800",
	Cancelled: "bg-red-100 border-red-300 text-red-800",
};

// Category icons
const categoryIcons = {
	Meeting: <Users className="w-4 h-4" />,
	Work: <Edit3 className="w-4 h-4" />,
	Event: <Calendar className="w-4 h-4" />,
	Task: <Check className="w-4 h-4" />,
};

export default function ScheduleCalendar() {
	const { loading, setLoading } = useLoadContext();
	const [selectedView, setSelectedView] = useState("month"); // 'month' or 'week'
	const [currentDate, setCurrentDate] = useState(new Date());
	// const [selectedUser, setSelectedUser] = useState(1);
	const [schedules, setSchedules] = useState(mockSchedules);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [selectedDay, setSelectedDay] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);

	const [currentMonth, setCurrentMonth] = useState(new Date());
	const startDate = startOfWeek(startOfMonth(currentMonth));
	const endDate = endOfWeek(endOfMonth(currentMonth));

	// API Data
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(users || null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const userResponse = await axiosClient.get("/user-auth");
			setUsers(userResponse.data.users);
			setSelectedUser(userResponse.data.users[0]);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};

	// For week view - get the start of the week (Sunday)
	const getWeekStartDate = (date) => {
		const d = new Date(date);
		const day = d.getDay();
		return new Date(d.setDate(d.getDate() - day));
	};

	const weekStartDate = getWeekStartDate(currentDate);

	// Get days in month for calendar view
	const days = [];
	let day = startDate;
	while (day <= endDate) {
		days.push(day);
		day = addDays(day, 1);
	}

	// Get all days for the week view
	const getWeekDays = (startDate) => {
		const days = [];
		const currentDate = new Date(startDate);

		for (let i = 0; i < 7; i++) {
			days.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return days;
	};

	// Format date to yyyy-MM-dd
	// const formatDate = (date) => {
	// 	const d = new Date(date);
	// 	let month = "" + (d.getMonth() + 1);
	// 	let day = "" + d.getDate();
	// 	const year = d.getFullYear();

	// 	if (month.length < 2) month = "0" + month;
	// 	if (day.length < 2) day = "0" + day;

	// 	return [year, month, day].join("-");
	// };

	// Get schedules for a specific date
	const getSchedulesForDate = (date) => {
		const formattedDate = format(date, "yyyy-MM-dd");
		return schedules.filter(
			(schedule) => schedule.assignee === selectedUser?.id && schedule.startDate <= formattedDate && schedule.endDate >= formattedDate
		);
	};

	// Generate time slots for week view
	const getTimeSlots = () => {
		const slots = [];
		for (let hour = 7; hour <= 19; hour++) {
			slots.push(`${hour.toString().padStart(2, "0")}:00`);
		}
		return slots;
	};
	// const getTimeSlots = () => {
	// 	const slots = [];
	// 	for (let hour = 7; hour <= 19; hour++) {
	// 		const timeStr = `${hour.toString().padStart(2, "0")}:00`;
	// 		const [h, m] = timeStr.split(":");
	// 		const date = new Date();
	// 		date.setHours(Number(h), Number(m), 0, 0); // set to that time
	// 		slots.push(format(date, "hh:mm a"));
	// 	}
	// 	return slots;
	// };

	// Check if a schedule is within a time slot
	const isScheduleInTimeSlot = (schedule, time, date) => {
		const formattedDate = format(date, "yyyy-MM-dd");
		const [slotHour] = time.split(":").map(Number);
		const [startHour] = schedule.startTime.split(":").map(Number);
		const [endHour, endMinutes] = schedule.endTime.split(":").map(Number);

		return (
			schedule.assignee === selectedUser?.id &&
			schedule.startDate <= formattedDate &&
			schedule.endDate >= formattedDate &&
			startHour <= slotHour &&
			(endHour > slotHour || (endHour === slotHour && endMinutes > 0))
		);
	};

	// Navigate to previous/next month or week
	const navigatePrev = () => {
		if (selectedView === "month") {
			setCurrentMonth(subMonths(currentMonth, 1));
		} else {
			const newDate = new Date(weekStartDate);
			newDate.setDate(newDate.getDate() - 7);
			setCurrentDate(newDate);
		}
	};

	const navigateNext = () => {
		if (selectedView === "month") {
			setCurrentMonth(addMonths(currentMonth, 1));
		} else {
			const newDate = new Date(weekStartDate);
			newDate.setDate(newDate.getDate() + 7);
			setCurrentDate(newDate);
		}
	};

	// Handle schedule click
	const handleScheduleClick = (schedule, e) => {
		e.stopPropagation();
		setSelectedSchedule({ ...schedule });
		setModalOpen(true);
	};

	// Handle cell click (empty area)
	const handleCellClick = (date, time) => {
		const formattedDate = format(date, "yyyy-MM-dd");
		let newSchedule = {
			id: Date.now(),
			title: "",
			category: "Meeting",
			startDate: formattedDate,
			endDate: formattedDate,
			assignee: selectedUser?.id,
			status: "Scheduled",
			description: "",
		};

		if (time) {
			const [hour] = time.split(":");
			const endHour = parseInt(hour) + 1;
			newSchedule.startTime = `${hour}:00`;
			newSchedule.endTime = `${endHour.toString().padStart(2, "0")}:00`;
		} else {
			newSchedule.startTime = "09:00";
			newSchedule.endTime = "10:00";
		}

		setSelectedSchedule(newSchedule);
		setSelectedDay(date);
		setSelectedTime(time);
		setModalOpen(true);
	};

	// Save schedule
	const saveSchedule = () => {
		if (selectedSchedule.id && schedules.some((s) => s.id === selectedSchedule.id)) {
			// Update existing schedule
			setSchedules(schedules.map((s) => (s.id === selectedSchedule.id ? selectedSchedule : s)));
		} else {
			// Add new schedule
			setSchedules([...schedules, selectedSchedule]);
		}
		setModalOpen(false);
		setSelectedSchedule(null);
	};

	// Delete schedule
	const deleteSchedule = () => {
		if (selectedSchedule && selectedSchedule.id) {
			setSchedules(schedules.filter((s) => s.id !== selectedSchedule.id));
			setModalOpen(false);
			setSelectedSchedule(null);
		}
	};

	// Render month view
	const renderMonthView = () => {
		// const days = getDaysInMonth(currentMonth);

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
	};

	return (
		<div>
			<div>
				{/* Header */}
				<div className="p-4 border-b flex flex-col justify-between items-center gap-4">
					<div className="flex flex-col justify-start items-start gap-2 mt-2 w-full">
						<h1 className=" font-extrabold text-3xl">Schedules</h1>
						<span className="w-full md:w-[300px]">
							<Select
								onValueChange={(value) => {
									const selected = users.find((user) => user.id === value);
									setSelectedUser(selected);
								}}
								value={selectedUser?.id || ""}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a user"></SelectValue>
								</SelectTrigger>
								<SelectContent>
									{Array.isArray(users) && users.length > 0 ? (
										users?.map((user) => (
											<SelectItem key={user?.id} value={user?.id}>
												{user?.name}
											</SelectItem>
										))
									) : (
										<SelectItem disabled>No users available</SelectItem>
									)}
								</SelectContent>
							</Select>
						</span>
					</div>

					<div className="flex flex-row w-full items-center gap-4">
						{/* User dropdown */}
						{/* <div className="relative w-full sm:w-auto">
							<select
								value={selectedUser}
								onChange={(e) => setSelectedUser(parseInt(e.target.value))}
								className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							>
								{mockUsers.map((user) => (
									<option key={user.id} value={user.id}>
										{user.name}
									</option>
								))}
							</select>
						</div> */}

						{/* Navigation */}
						<div className="flex flex-col justify-center gap-2 w-full">
							{/* <h2 className="block md:hidden text-xl font-bold text-center">{format(currentMonth, "MMMM yyyy")}</h2> */}
							<div className="flex items-center justify-center">
								<span className="block md:hidden text-lg font-bold">
									{selectedView === "month"
										? `${format(currentMonth, "MMMM yyyy")}`
										: `${weekStartDate.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${new Date(
												weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000
										  ).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`}
								</span>
							</div>
							<div className="flex flex-row justify-between w-full">
								{/* View toggle */}
								<div className="flex justify-start gap-2">
									<Button
										variant={`${selectedView === "month" ? "" : "outline"}`}
										onClick={() => setSelectedView("month")}
										disabled={loading}
									>
										Month View
									</Button>
									<Button variant={`${selectedView === "week" ? "" : "outline"}`} onClick={() => setSelectedView("week")} disabled={loading}>
										Week View
									</Button>
								</div>
								<div className="flex items-center justify-center">
									<span className="hidden md:block text-lg font-bold">
										{selectedView === "month"
											? `${format(currentMonth, "MMMM yyyy")}`
											: `${weekStartDate.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${new Date(
													weekStartDate.getTime() + 6 * 24 * 60 * 60 * 1000
											  ).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Button variant="outline" onClick={navigatePrev}>
										Prev
									</Button>
									<Button variant="outline" onClick={navigateNext}>
										Next
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Calendar/Week View */}
				<div className="bg-background p-1 overflow-x-auto">
					{selectedView === "month" ? (
						renderMonthView()
					) : (
						<WeekViewV2
							getWeekDays={getWeekDays}
							getTimeSlots={getTimeSlots}
							weekStartDate={weekStartDate}
							isScheduleInTimeSlot={isScheduleInTimeSlot}
							schedules={schedules}
							statusColors={statusColors}
							handleCellClick={handleCellClick}
							handleScheduleClick={handleScheduleClick}
						/>
					)}
				</div>
			</div>

			{/* Modal for adding/editing schedules */}
			{modalOpen && selectedSchedule && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
						<div className="p-4 border-b flex justify-between items-center">
							<h2 className="text-lg font-semibold text-gray-900">
								{selectedSchedule.id && schedules.some((s) => s.id === selectedSchedule.id) ? "Edit Schedule" : "Add Schedule"}
							</h2>
							<button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="p-4 space-y-4">
							{/* Title */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
								<input
									type="text"
									value={selectedSchedule.title}
									onChange={(e) => setSelectedSchedule({ ...selectedSchedule, title: e.target.value })}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="Schedule title"
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
								<select
									value={selectedSchedule.category}
									onChange={(e) => setSelectedSchedule({ ...selectedSchedule, category: e.target.value })}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="Meeting">Meeting</option>
									<option value="Work">Work</option>
									<option value="Event">Event</option>
									<option value="Task">Task</option>
								</select>
							</div>

							{/* Date Range */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
									<input
										type="date"
										value={selectedSchedule.startDate}
										onChange={(e) => setSelectedSchedule({ ...selectedSchedule, startDate: e.target.value })}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
									<input
										type="date"
										value={selectedSchedule.endDate}
										onChange={(e) => setSelectedSchedule({ ...selectedSchedule, endDate: e.target.value })}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>

							{/* Time Range */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
									<input
										type="time"
										value={selectedSchedule.startTime}
										onChange={(e) => setSelectedSchedule({ ...selectedSchedule, startTime: e.target.value })}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
									<input
										type="time"
										value={selectedSchedule.endTime}
										onChange={(e) => setSelectedSchedule({ ...selectedSchedule, endTime: e.target.value })}
										className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									/>
								</div>
							</div>

							{/* Assignee */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
								<select
									value={selectedSchedule.assignee}
									onChange={(e) => setSelectedSchedule({ ...selectedSchedule, assignee: parseInt(e.target.value) })}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								>
									{mockUsers.map((user) => (
										<option key={user.id} value={user.id}>
											{user.name}
										</option>
									))}
								</select>
							</div>

							{/* Status */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
								<select
									value={selectedSchedule.status}
									onChange={(e) => setSelectedSchedule({ ...selectedSchedule, status: e.target.value })}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="Scheduled">Scheduled</option>
									<option value="Pending">Pending</option>
									<option value="Confirmed">Confirmed</option>
									<option value="Completed">Completed</option>
									<option value="Cancelled">Cancelled</option>
								</select>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
								<textarea
									value={selectedSchedule.description}
									onChange={(e) => setSelectedSchedule({ ...selectedSchedule, description: e.target.value })}
									className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									rows="3"
									placeholder="Add description"
								></textarea>
							</div>
						</div>

						<div className="p-4 border-t flex justify-between">
							{selectedSchedule.id && schedules.some((s) => s.id === selectedSchedule.id) ? (
								<button onClick={deleteSchedule} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-1">
									<Trash className="w-4 h-4" />
									Delete
								</button>
							) : (
								<button onClick={() => setModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
									Cancel
								</button>
							)}

							<button onClick={saveSchedule} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1">
								<Check className="w-4 h-4" />
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
