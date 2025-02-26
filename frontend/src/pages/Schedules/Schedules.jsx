import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Calendar from "@/components/schedule/calendar";
import CalendarSchedule from "@/components/schedule/calendar";

export default function Schedules() {
	const [employees, setEmployees] = useState([]);
	const [events, setEvents] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchData();
		// if (alert.session !== 0) {
		// 	showAlert();
		// }
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const [employeeResponse, eventResponse, scheduleResponse] = await Promise.all([
				axiosClient.get("/employee"),
				axiosClient.get("/event"),
				axiosClient.get("/schedule"),
			]);

			// Set the data after both requests succeed
			setEmployees(employeeResponse.data.employees);
			setEvents(eventResponse.data.events);
			setSchedules(scheduleResponse.data.schedules);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	return (
		<div className="flex flex-col lg:flex-row gap-2 w-screen md:w-full">
			<div className="lg:order-1 order-2 lg:w-1/2 w-full bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10">
				<div className="flex flex-col ml-4 md:ml-0">
					<h1 className=" font-extrabold text-3xl">Employees</h1>
					<p>List of all employees</p>
				</div>
				<DataTable columns={columns} data={employees} loading={loading} />
			</div>
			<div className="lg:order-2 order-1 w-screen md:w-full bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10">
				<div className="flex flex-col ml-4 md:ml-0">
					<h1 className=" font-extrabold text-3xl">Schedules</h1>
					<p>List of Schedules</p>
				</div>
				<CalendarSchedule employees={employees} events={events} schedules={schedules} loading={loading} />
			</div>
		</div>
	);
}
