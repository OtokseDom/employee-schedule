import axiosClient from "@/axios.client";
import React, { useEffect, useState } from "react";
import { columnsEvent } from "./columns";
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { DataTableEvents } from "./data-table";

export default function Events() {
	const { loading, setLoading } = useLoadContext();
	const [events, setEvents] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
	useEffect(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const eventResponse = await axiosClient.get("/event");
			setEvents(eventResponse.data.events);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(`/event/${id}`);
			fetchData();
			showToast("Success!", "Event deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	return (
		<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
			<div>
				<h1 className=" font-extrabold text-3xl">Events</h1>
				<p>View list of all events</p>
			</div>
			<DataTableEvents
				columns={columnsEvent({ handleDelete, setIsOpen, setUpdateData })}
				data={events}
				setEvents={setEvents}
				updateData={updateData}
				setUpdateData={setUpdateData}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				fetchData={fetchData}
			/>
		</div>
	);
}
