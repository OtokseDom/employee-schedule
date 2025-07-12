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
		<div className="w-screen md:w-fit grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 auto-rows-auto bg-background rounded-2xl p-4 md:p-10 border border-border">
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
					<CardTitle>All Time Top Performers</CardTitle>
					<CardDescription>
						Showing{" "}
						{reports?.performance_leaderboard?.length == 1
							? "(Top 1) user"
							: reports?.performance_leaderboard?.length > 1
							? "(Top " + reports?.performance_leaderboard?.length + ") users"
							: ""}
					</CardDescription>
				</CardHeader>
				<DataTable columns={columns} data={reports?.performance_leaderboard} />
			</div>
		</div>
	);
}
