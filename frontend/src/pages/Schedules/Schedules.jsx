import axiosClient from "@/axios.client";
import React, { useEffect, useRef, useState } from "react";
import CalendarSchedule from "@/components/schedule/calendar";
import { columnsEvent } from "./Events/columns-event";
import { DataTableEvents } from "./Events/data-table-events";
import { useToast } from "@/contexts/ToastContextProvider";
import { DataTableUsers } from "./Users/data-table-users";
import { columnsUser } from "./Users/columns-user";
import { useLoadContext } from "@/contexts/LoadContextProvider";

export default function Schedules() {
	const { loading, setLoading } = useLoadContext();

	const showToast = useToast();
	const [users, setUsers] = useState([]);
	const [events, setEvents] = useState([]);
	const [schedules, setSchedules] = useState([]);
	// const [loading, setLoading] = useState(false);
	const [selectedUser, setSelectedUser] = useState(users[0] || null);
	const [selectedTab, setSelectedTab] = useState(1);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenEvent, setIsOpenEvent] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [updateData, setUpdateData] = useState({});
	// Refs to store previous values
	const prevUsersRef = useRef([]);
	const prevEventsRef = useRef([]);
	const prevSchedulesRef = useRef([]);
	useEffect(() => {
		fetchData();
	}, [selectedUser]);

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);

	useEffect(() => {
		if (!isOpenEvent) setUpdateData({});
	}, [isOpenEvent]);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const [userResponse, eventResponse, scheduleResponse] = await Promise.all([
				axiosClient.get("/user-auth"),
				axiosClient.get("/event"),
				axiosClient.get(`/schedule-by-user/${selectedUser?.id}`),
			]);
			// Prevent re-renders if data is the same
			// Set the data after both requests succeed
			setUsers(userResponse.data.users);
			setEvents(eventResponse.data.events);
			setSchedules(scheduleResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	// TODO: Add validation before deletion of event and user
	// TODO: delete schedule reselects user which loads different calendar schedule
	const handleDelete = async (table, id) => {
		setLoading(true);
		try {
			if (table == "user") {
				const userResponse = await axiosClient.delete(`/user-auth/${id}`);
				setDeleted(true);
				setUsers(userResponse.data);
				setSelectedUser(userResponse.data[0]);
				showToast("Success!", "User deleted.", 3000);
			} else if (table == "event") {
				const eventResponse = await axiosClient.delete(`/event/${id}`);
				setUsers(eventResponse.data);
				showToast("Success!", "Event deleted.", 3000);
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000);
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	return (
		<div className="flex flex-col lg:flex-row gap-2 w-screen md:w-full">
			<div className="lg:order-1 order-2 lg:w-1/2 w-full bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 lg:max-w-[600px] shadow-md">
				<div>
					{selectedTab == 1 ? (
						<div className="flex flex-row justify-between ml-4 md:ml-0 hover:cursor-pointer">
							<div>
								<h1 className=" font-extrabold text-3xl">Users</h1>
								<p>List of all users</p>
							</div>
							<div className="flex flex-col items-end opacity-40 hover:opacity-100 hover:cursor-pointer" onClick={() => setSelectedTab(2)}>
								<h1 className=" font-extrabold text-3xl">Events</h1>
								<p className="underline">View list of all events</p>
							</div>
						</div>
					) : (
						<div className="flex flex-row justify-between ml-4 md:ml-0">
							<div className="opacity-40 hover:opacity-100 hover:cursor-pointer" onClick={() => setSelectedTab(1)}>
								<h1 className=" font-extrabold text-3xl">Users</h1>
								<p className="underline">View list of all users</p>
							</div>
							<div className="flex flex-col items-end hover:cursor-pointer">
								<h1 className=" font-extrabold text-3xl">Events</h1>
								<p>List of all events</p>
							</div>
						</div>
					)}
					<div className={`${selectedTab == 2 && "hidden"}`}>
						<DataTableUsers
							columns={columnsUser({ handleDelete, setIsOpen, setUpdateData })}
							data={users}
							setUsers={setUsers}
							setSelectedUser={setSelectedUser}
							firstRow={users[0]?.id}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							deleted={deleted}
							setDeleted={setDeleted}
							updateData={updateData}
							setUpdateData={setUpdateData}
							fetchData={fetchData}
						/>
					</div>
					<div className={`${selectedTab == 1 && "hidden"}`}>
						<DataTableEvents
							columns={columnsEvent({ handleDelete, setIsOpenEvent, setUpdateData })}
							data={events}
							setEvents={setEvents}
							updateData={updateData}
							setUpdateData={setUpdateData}
							isOpenEvent={isOpenEvent}
							setIsOpenEvent={setIsOpenEvent}
							fetchData={fetchData}
						/>
					</div>
				</div>
			</div>
			<div className="lg:order-2 order-1 w-screen md:w-full bg-card overflow-auto h-full text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
				<div className="flex flex-col ml-4 md:ml-0">
					<h1 className=" font-extrabold text-3xl">Schedules</h1>
					<p>List of Schedules</p>
				</div>
				<CalendarSchedule users={users} events={events} schedules={schedules} setSchedules={setSchedules} selectedUser={selectedUser} />
			</div>
		</div>
	);
}
