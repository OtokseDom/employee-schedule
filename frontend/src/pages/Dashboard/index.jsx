import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/axios.client";
import { SectionCard } from "@/components/chart/section-card";
import { useLoadContext } from "@/contexts/LoadContextProvider";
// TODO: Datatable sort not working properly. Sorting by text instead of date value
export default function UserProfile() {
	const { loading, setLoading } = useLoadContext();
	const { id } = useParams(); // Get user ID from URL

	// useEffect(() => {
	// 	fetchData();
	// }, []);

	// const fetchData = async () => {
	// 	setLoading(true);
	// 	try {
	// 		// Fetch all user reports in one call
	// 		const reportsRes = await axiosClient.get(`/user/${id}/reports`);
	// 		setUserReports(reportsRes.data.data);
	// 		setLoading(false);
	// 	} catch (e) {
	// 		console.error("Error fetching data:", e);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	return (
		<div className="flex flex-col w-screen md:w-full h-full overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
			<div className="w-full mb-5">
				<h1 className="font-extrabold text-3xl">Dashboard</h1>
				<p>Your workspace at a glance</p>
			</div>
			{/* -------------------------------- first row ------------------------------- */}
			<div className="flex flex-row gap-4">
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
			</div>
		</div>
	);
}
