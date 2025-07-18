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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DateInput from "@/components/form/DateInput";
import FilterForm from "./filter-form";
import FilterTags from "@/components/form/FilterTags";
// TODO: Section card reports
// TODO: Report cards to show filter description instead of "All Time"
export default function UserProfile() {
	const { setLoading } = useLoadContext();
	const [reports, setReports] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [filters, setFilters] = useState({
		"Date Range": null,
	});

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
	const handleRemoveFilter = async (key) => {
		const updated = { ...filters };
		delete updated[key];
		setFilters(updated);
		const from = updated["Date Range"]?.split(" to ")[0].toISOString().slice(0, 10) || "";
		const to = updated["Date Range"]?.split(" to ")[1].toISOString().slice(0, 10) || "";

		setLoading(true);
		try {
			// Fetch all user reports in one call
			const reportsRes = await axiosClient.get(`/dashboard?from=${from}&to=${to}`);
			setReports(reportsRes.data.data);
			setLoading(false);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-screen md:w-fit grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-auto bg-background rounded-2xl p-4 md:p-10 border border-border">
			<div
				className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 pointer-events-none ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/>
			<div className="md:col-span-12">
				<div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
					<div className="">
						<h1 className="font-extrabold text-3xl">Dashboard</h1>
						<p>Your workspace at a glance</p>
					</div>
					<div className="flex flex-row gap-2">
						<Dialog modal={false} open={isOpen} onOpenChange={setIsOpen}>
							<DialogTrigger asChild>
								<Button variant="default">Filter</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Apply filter</DialogTitle>
									<DialogDescription className="sr-only">Apply available filters to view specific reports</DialogDescription>
								</DialogHeader>
								<FilterForm setIsOpen={setIsOpen} setReports={setReports} filters={filters} setFilters={setFilters} />
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
			<div className="md:col-span-12 flex flex-wrap justify-end gap-2">
				<FilterTags filters={filters} onRemove={handleRemoveFilter} />
			</div>
			{/* Section Cards */}
			<div className="md:col-span-3 h-stretch">
				<SectionCard description="Active Members" showBadge={false} value={100} variant="dashboard" />
			</div>
			<div className="md:col-span-3">
				<SectionCard description="Avg Performance" showBadge={false} value={8.3} variant="dashboard" />
			</div>
			<div className="md:col-span-3">
				<SectionCard description="Tasks at Risk" showBadge={false} value={3} variant="dashboard" />
			</div>
			<div className="md:col-span-3">
				<SectionCard description="Avg Completion Time" showBadge={false} value={"4 hrs"} variant="dashboard" />
			</div>

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
