import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import CalendarSchedule from "@/pages/Schedules/calendar";
import { useToast } from "@/contexts/ToastContextProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import ScheduleCalendar from "./calendarV2";

export default function Schedules() {
	const { loading, setLoading } = useLoadContext();

	const showToast = useToast();
	const [users, setUsers] = useState([]);
	const [events, setEvents] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [selectedUser, setSelectedUser] = useState(users || null);

	useEffect(() => {
		fetchUsers();
		fetchEvents();
	}, []);

	useEffect(() => {
		if (selectedUser.id) fetchSchedule();
	}, [selectedUser]);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const userResponse = await axiosClient.get("/user");
			setUsers(userResponse.data.users);
			setSelectedUser(userResponse.data.users[0]);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	const fetchSchedule = async () => {
		setLoading(true);
		try {
			const scheduleResponse = await axiosClient.get(`/schedule-by-user/${selectedUser?.id}`);
			setSchedules(scheduleResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	const fetchEvents = async () => {
		setLoading(true);
		try {
			const eventResponse = await axiosClient.get(`/event`);
			setEvents(eventResponse.data.events);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex flex-col xl:flex-row justify-center gap-2 -mb-32 md:mb-0 w-screen md:w-[1000px] h-screen md:h-fit container">
			<div className="xl:order-2 order-1 bg-card overflow-auto scrollbar-custom h-full text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
				<h1 className=" font-extrabold text-3xl">Schedules</h1>
				<div className="flex flex-row justify-start items-center gap-2 mt-2 w-full">
					<span className="min-w-80 w-screen md:w-fit">
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
				<CalendarSchedule events={events} schedules={schedules} setSchedules={setSchedules} selectedUser={selectedUser} />
			</div>
		</div>
	);
}
