import { useEffect, useState } from "react";
import axiosClient from "@/axios.client";
import { SectionCard } from "@/components/chart/section-card";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { PieChartDonut } from "@/components/chart/pie-chart-donut";
import { ChartBarMultiple } from "@/components/chart/bar-chart-multiple";
import { ChartBarHorizontal } from "@/components/chart/chart-bar-horizontal";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLineLabel } from "@/components/chart/line-chart-label";
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
		<div className="w-screen md:w-fit grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto bg-background rounded-2xl p-4 md:p-10 border border-border">
			<div className="md:col-span-12">
				<h1 className="font-extrabold text-3xl">Dashboard</h1>
				<p>Your workspace at a glance</p>
			</div>
			{/* Section Cards */}
			{/* <div className="md:col-span-3">
				<SectionCard description="test" value={100} percentage={12.2} insight="sample" footer="sample" />
			</div>
			<div className="md:col-span-3">
				<SectionCard description="test" value={100} percentage={12.2} insight="sample" footer="sample" />
			</div>
			<div className="md:col-span-3">
				<SectionCard description="test" value={100} percentage={12.2} insight="sample" footer="sample" />
			</div>
			<div className="md:col-span-3">
				<SectionCard description="test" value={100} percentage={12.2} insight="sample" footer="sample" />
			</div> */}

			{/* Pie Chart */}
			<div className="md:col-span-4">
				<PieChartDonut report={reports?.tasks_by_status} variant="dashboard" />
			</div>

			{/* Multi Bar Chart */}
			<div className="md:col-span-4">
				<ChartBarMultiple report={reports?.estimate_vs_actual} variant="dashboard" />
			</div>

			{/* Line Chart */}
			<div className="md:col-span-4">
				<ChartLineLabel report={reports?.performance_rating_trend} variant="dashboard" />
			</div>

			{/* Horizontal Bar Chart */}
			<div className="md:col-span-6">
				<ChartBarHorizontal report={reports?.users_task_load} variant="dashboard" />
			</div>

			{/* Datatable */}
			<div className="md:col-span-6 max-h-[600px] overflow-auto scrollbar-custom bg-primary-foreground text-card-foreground border border-border rounded-md container px-4 shadow-md">
				<CardHeader>
					<CardTitle>
						Performance Leaderboard {reports?.performance_leaderboard?.length > 0 ? "(Top " + reports?.performance_leaderboard?.length + ")" : ""}
					</CardTitle>
					<CardDescription>All Time</CardDescription>
				</CardHeader>
				<DataTable columns={columns} data={reports?.performance_leaderboard} />
			</div>
		</div>

		// <div className="flex flex-col w-screen md:w-full h-fit gap-4 overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
		// 	<div className="w-full mb-5">
		// 		<h1 className="font-extrabold text-3xl">Dashboard</h1>
		// 		<p>Your workspace at a glance</p>
		// 	</div>
		// 	{/* -------------------------------- first row ------------------------------- */}
		// 	<div className="flex flex-col md:flex-row gap-4">
		// 		<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
		// 		<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
		// 		<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
		// 		<SectionCard description={"test"} value={100} percentage={12.2} insight={"sample"} footer={"sample"} />
		// 	</div>
		// 	<div className="flex flex-col md:flex-row gap-4 w-full h-fit">
		// 		<PieChartDonut report={reports?.tasks_by_status} variant="dashboard" />
		// 		<ChartBarMultiple report={reports?.estimate_vs_actual} variant="dashboard" />
		// 	</div>
		// 	<div className="flex flex-col md:flex-row gap-4 w-full h-fit">
		// 		{/* Chart - 3/4 width, auto height */}
		// 		<div className="w-full">
		// 			<ChartBarHorizontal report={reports?.users_task_load} variant="dashboard" />
		// 		</div>

		// 		{/* DataTable - 1/4 width, scrollable */}
		// 		<div className="w-full max-h-[600px] overflow-auto scrollbar-custom bg-primary-foreground text-card-foreground border border-border rounded-2xl container px-4 shadow-md">
		// 			<CardHeader>
		// 				<CardTitle>
		// 					Performance Leaderboard{" "}
		// 					{reports?.performance_leaderboard?.length > 0 ? "(Top " + reports?.performance_leaderboard?.length + ")" : ""}
		// 				</CardTitle>
		// 				<CardDescription>All Time</CardDescription>
		// 			</CardHeader>
		// 			<DataTable columns={columns} data={reports?.performance_leaderboard} />
		// 		</div>
		// 	</div>
		// </div>
	);
}
