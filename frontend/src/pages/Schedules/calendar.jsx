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
import Week from "./week";
import Month from "./month";

// Status colors
const statusColors = {
	"In Progress": "bg-blue-100 border-blue-300 text-blue-800",
	Pending: "bg-yellow-100 border-yellow-300 text-yellow-800",
	Completed: "bg-green-100 border-green-300 text-green-800",
	"On Hold": "bg-gray-100 border-gray-300 text-gray-800",
	Cancelled: "bg-red-100 border-red-300 text-red-800",
	Delayed: "bg-purple-100 border-purple-300 text-purple-800",
};

export default function ScheduleCalendar() {
	const { loading, setLoading } = useLoadContext();
	const [selectedView, setSelectedView] = useState("month"); // 'month' or 'week'
	const [currentDate, setCurrentDate] = useState(new Date());

	const [currentMonth, setCurrentMonth] = useState(new Date());
	const start_date = startOfWeek(startOfMonth(currentMonth));
	const end_date = endOfWeek(endOfMonth(currentMonth));

	// API Data
	const [tasks, setTasks] = useState([]);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(users || null);

	useEffect(() => {
		document.title = "Task Management | Calendar";
		fetchUsers();
		fetchTasks();
	}, []);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const userResponse = await axiosClient.get("/user");
			setUsers(userResponse.data.data);
			setSelectedUser(userResponse.data.data[0]);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	const fetchTasks = async () => {
		setLoading(true);
		try {
			const taskResponse = await axiosClient.get(`/task`);
			setTasks(taskResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};

	// For week view - get the start of the week (Sunday)
	const getWeekstart_date = (date) => {
		const d = new Date(date);
		const day = d.getDay();
		return new Date(d.setDate(d.getDate() - day));
	};

	const weekstart_date = getWeekstart_date(currentDate);

	// Get days in month for calendar view
	const days = [];
	let day = start_date;
	while (day <= end_date) {
		days.push(day);
		day = addDays(day, 1);
	}

	// Get all days for the week view
	const getWeekDays = (start_date) => {
		const days = [];
		const currentDate = new Date(start_date);

		for (let i = 0; i < 7; i++) {
			days.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return days;
	};

	// Get tasks for a specific date
	const getTaskForDate = (date, tasks) => {
		const formattedDate = format(date, "yyyy-MM-dd");
		return tasks.filter((task) => {
			const start = format(new Date(task.start_date), "yyyy-MM-dd");
			const end = format(new Date(task.end_date), "yyyy-MM-dd");
			return task.assignee_id === selectedUser?.id && start <= formattedDate && end >= formattedDate;
		});
	};

	// Generate time slots for week view
	const getTimeSlots = () => {
		const slots = [];
		for (let hour = 7; hour <= 19; hour++) {
			slots.push(`${hour.toString().padStart(2, "0")}:00`);
		}
		return slots;
	};

	// Check if a task is within a time slot
	const isInTimeSlot = (task, time, date) => {
		const formattedDate = format(date, "yyyy-MM-dd");
		const [slotHour] = time?.split(":").map(Number);
		const [startHour] = task.start_time ? task.start_time.split(":").map(Number) : [];
		const [endHour, endMinutes] = task.end_time ? task.end_time.split(":").map(Number) : [];
		const taskStartDate = format(new Date(task?.start_date), "yyyy-MM-dd");
		const taskEndDate = format(new Date(task?.end_date), "yyyy-MM-dd");

		return (
			task?.assignee_id === selectedUser?.id &&
			formattedDate >= taskStartDate &&
			formattedDate <= taskEndDate &&
			startHour <= slotHour &&
			(endHour > slotHour || (endHour === slotHour && endMinutes > 0))
		);
	};

	// Navigate to previous/next month or week
	const navigatePrev = () => {
		if (selectedView === "month") {
			setCurrentMonth(subMonths(currentMonth, 1));
		} else {
			const newDate = new Date(weekstart_date);
			newDate.setDate(newDate.getDate() - 7);
			setCurrentDate(newDate);
		}
	};

	const navigateNext = () => {
		if (selectedView === "month") {
			setCurrentMonth(addMonths(currentMonth, 1));
		} else {
			const newDate = new Date(weekstart_date);
			newDate.setDate(newDate.getDate() + 7);
			setCurrentDate(newDate);
		}
	};

	return (
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
								{Array.isArray(users) && users?.length > 0 ? (
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
					{/* Navigation */}
					<div className="flex flex-col justify-center gap-2 w-full">
						{/* <h2 className="block md:hidden text-xl font-bold text-center">{format(currentMonth, "MMMM yyyy")}</h2> */}
						<div className="flex items-center justify-center">
							<span className="block md:hidden text-lg font-bold">
								{selectedView === "month"
									? `${format(currentMonth, "MMMM yyyy")}`
									: `${weekstart_date.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${new Date(
											weekstart_date.getTime() + 6 * 24 * 60 * 60 * 1000
									  ).toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`}
							</span>
						</div>
						<div className="flex flex-row justify-between w-full">
							{/* View toggle */}
							<div className="flex justify-start gap-2">
								<Button variant={`${selectedView === "month" ? "" : "outline"}`} onClick={() => setSelectedView("month")} disabled={loading}>
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
										: `${weekstart_date.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${new Date(
												weekstart_date.getTime() + 6 * 24 * 60 * 60 * 1000
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
			<div className="bg-background overflow-x-auto">
				{selectedView === "month" ? (
					<Month
						days={days}
						data={tasks}
						fetchData={fetchTasks}
						currentMonth={currentMonth}
						getTaskForDate={getTaskForDate}
						statusColors={statusColors}
						selectedUser={selectedUser}
					/>
				) : (
					<Week
						data={tasks}
						fetchData={fetchTasks}
						getWeekDays={getWeekDays}
						getTimeSlots={getTimeSlots}
						weekstart_date={weekstart_date}
						isInTimeSlot={isInTimeSlot}
						selectedUser={selectedUser}
						statusColors={statusColors}
					/>
				)}
			</div>
		</div>
	);
}
