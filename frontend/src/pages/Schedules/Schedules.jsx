import axiosClient from "@/axios.client";
import React, { useEffect, useRef, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import CalendarSchedule from "@/components/schedule/calendar";
import { columnsEvent } from "./columns-event";
import { DataTableEvents } from "./data-table-events";
import { useToast } from "@/contexts/ToastContextProvider";

export default function Schedules() {
	const showToast = useToast();
	const [employees, setEmployees] = useState([]);
	const [events, setEvents] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedEmployee, setSelectedEmployee] = useState(employees[0] || null);
	const [selectedTab, setSelectedTab] = useState(1);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenEvent, setIsOpenEvent] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		fetchData();
	}, [selectedEmployee]);

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
			const [employeeResponse, eventResponse, scheduleResponse] = await Promise.all([
				axiosClient.get("/employee"),
				axiosClient.get("/event"),
				axiosClient.get(`/schedule-by-employee/${selectedEmployee?.id}`),
			]);
			// Prevent re-renders if data is the same
			// Set the data after both requests succeed
			setEmployees(employeeResponse.data.employees);
			setEvents(eventResponse.data.events);
			setSchedules(scheduleResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	// TODO: Add validation before deletion of event and employee
	// TODO: delete schedule reselects employee which loads different calendar schedule
	const handleDelete = async (table, id) => {
		setLoading(true);
		try {
			if (table == "employee") {
				const employeeResponse = await axiosClient.delete(`/employee/${id}`);
				setDeleted(true);
				setEmployees(employeeResponse.data);
				setSelectedEmployee(employeeResponse.data[0]);
				showToast("Success!", "Employee deleted.", 3000);
			} else if (table == "event") {
				const eventResponse = await axiosClient.delete(`/event/${id}`);
				setEmployees(eventResponse.data);
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
			<div className="lg:order-1 order-2 lg:w-1/2 w-full bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10">
				<div>
					{selectedTab == 1 ? (
						<div className="flex flex-row justify-between ml-4 md:ml-0 hover:cursor-pointer">
							<div>
								<h1 className=" font-extrabold text-3xl">Employees</h1>
								<p>List of all employees</p>
							</div>
							<div className="flex flex-col items-end opacity-40 hover:opacity-100 hover:cursor-pointer" onClick={() => setSelectedTab(2)}>
								<h1 className=" font-extrabold text-3xl">Events</h1>
								<p className="underline">View list of all events</p>
							</div>
						</div>
					) : (
						<div className="flex flex-row justify-between ml-4 md:ml-0">
							<div className="opacity-40 hover:opacity-100 hover:cursor-pointer" onClick={() => setSelectedTab(1)}>
								<h1 className=" font-extrabold text-3xl">Employees</h1>
								<p className="underline">View list of all employees</p>
							</div>
							<div className="flex flex-col items-end hover:cursor-pointer">
								<h1 className=" font-extrabold text-3xl">Events</h1>
								<p>List of all events</p>
							</div>
						</div>
					)}
					<div className={`${selectedTab == 2 && "hidden"}`}>
						<DataTable
							columns={columns({ handleDelete, setIsOpen, setUpdateData })}
							data={employees}
							setEmployees={setEmployees}
							loading={loading}
							setLoading={setLoading}
							setSelectedEmployee={setSelectedEmployee}
							firstRow={employees[0]?.id}
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
							loading={loading}
							setLoading={setLoading}
							updateData={updateData}
							setUpdateData={setUpdateData}
							isOpenEvent={isOpenEvent}
							setIsOpenEvent={setIsOpenEvent}
							fetchData={fetchData}
						/>
					</div>
				</div>
			</div>
			<div className="lg:order-2 order-1 w-screen md:w-full bg-card overflow-auto h-full text-card-foreground border border-border rounded-md container p-4 md:p-10">
				<div className="flex flex-col ml-4 md:ml-0">
					<h1 className=" font-extrabold text-3xl">Schedules</h1>
					<p>List of Schedules</p>
				</div>
				<CalendarSchedule
					employees={employees}
					events={events}
					schedules={schedules}
					setSchedules={setSchedules}
					loading={loading}
					setLoading={setLoading}
					selectedEmployee={selectedEmployee}
				/>
			</div>
		</div>
	);
}
