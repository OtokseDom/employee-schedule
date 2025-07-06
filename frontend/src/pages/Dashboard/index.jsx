import { useEffect, useState } from "react";
import axiosClient from "@/axios.client";
import { SectionCard } from "@/components/chart/section-card";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { PieChartDonut } from "@/components/chart/pie-chart-donut";
import { ChartBarMultiple } from "@/components/chart/bar-chart-multiple";
// TODO: Datatable sort not working properly. Sorting by text instead of date value
export default function UserProfile() {
	const { setLoading } = useLoadContext();
	const [reports, setReports] = useState();

	useEffect(() => {
		document.title = "Task Management";
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Fetch all user reports in one call
			const reportsRes = await axiosClient.get(`/dashboard`);
			setReports(reportsRes.data.data);
			setLoading(false);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col w-screen md:w-full h-full gap-4 overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
			<div className="w-full mb-5">
				<h1 className="font-extrabold text-3xl">Dashboard</h1>
				<p>Your workspace at a glance</p>
			</div>
			{/* -------------------------------- first row ------------------------------- */}
			<div className="flex flex-col md:flex-row gap-4">
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
				<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
			</div>
			<div className="flex flex-col md:flex-row gap-4 w-full h-full">
				{/* <div className="md:w-1/2"> */}
				<PieChartDonut report={reports?.tasks_by_status?.data} variant="dashboard" />
				{/* </div> */}
				<ChartBarMultiple report={reports?.estimate_vs_actual?.data} variant="dashboard" />
			</div>
		</div>
	);
}
