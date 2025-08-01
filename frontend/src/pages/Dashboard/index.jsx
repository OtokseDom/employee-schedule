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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FilterForm from "../../components/form/filter-form";
import FilterTags from "@/components/form/FilterTags";
import { API } from "@/constants/api";
export default function UserProfile() {
	const { setLoading } = useLoadContext();
	const [reports, setReports] = useState();
	const [users, setUsers] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [filters, setFilters] = useState({
		// Need to separate values and display becase values are used for API calls and display is used for Filter Tags UI
		values: {
			"Date Range": null,
			Members: [],
		},
		display: {
			"Date Range": null,
			Members: [],
		},
	});
	const [selectedUsers, setSelectedUsers] = useState([]);

	useEffect(() => {
		document.title = "Task Management";
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Fetch all user reports in one call
			const reportsRes = await axiosClient.get(API().dashboard());
			setReports(reportsRes.data.data);
			// fetch users only if not already fetched
			if (!users) {
				const userResponse = await axiosClient.get(API().user());
				const mappedUsers = userResponse.data.data.map((user) => ({
					value: user.id,
					label: user.name,
				}));
				setUsers(mappedUsers);
			}
			setLoading(false);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	const handleRemoveFilter = async (key) => {
		// Deep copy filters to avoid mutating state directly
		const updated = {
			values: { ...filters.values },
			display: { ...filters.display },
		};
		delete updated.values[key];
		delete updated.display[key];
		setFilters(updated);
		let from = "";
		let to = "";
		let members = "";
		if (updated.values["Date Range"]) {
			from = updated.values["Date Range"]?.split(" to ")[0];
			to = updated.values["Date Range"]?.split(" to ")[1];
		}
		if (updated.values["Members"]) {
			members = updated.values["Members"];
		}
		setLoading(true);
		try {
			// Fetch all user reports in one call
			const reportsRes = await axiosClient.get(API().dashboard(from, to, members));
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
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
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
									<DialogTitle>Select filter</DialogTitle>
									<DialogDescription>Apply available filters to view specific reports</DialogDescription>
								</DialogHeader>
								<FilterForm
									setIsOpen={setIsOpen}
									setReports={setReports}
									filters={filters}
									setFilters={setFilters}
									users={users}
									selectedUsers={selectedUsers}
									setSelectedUsers={setSelectedUsers}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
			<div className="md:col-span-12 flex flex-wrap justify-end gap-2">
				<FilterTags filters={filters.display} onRemove={handleRemoveFilter} />
			</div>
			{/* Section Cards */}
			<div className="flex flex-col md:flex-row gap-4 md:col-span-12 overflow-auto">
				{/* <SectionCard description={`Active Members`} showBadge={false} value={reports?.section_cards?.user_count} variant="dashboard" /> */}
				<SectionCard description="Members Avg Performance (10)" showBadge={false} value={reports?.section_cards?.avg_performance} variant="dashboard" />
				<SectionCard description="Avg Time Efficiency" showBadge={false} value={`${reports?.section_cards?.time_efficiency}%`} variant="dashboard" />
				<SectionCard description="Avg Completion Rate" showBadge={false} value={`${reports?.section_cards?.completion_rate}%`} variant="dashboard" />
				<SectionCard description="Tasks Due Soon" showBadge={false} value={reports?.section_cards?.task_at_risk} variant="dashboard" />
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
					<CardTitle>
						{reports?.performance_leaderboard?.filters?.from && reports?.performance_leaderboard?.filters?.to
							? `${new Date(reports.performance_leaderboard.filters.from).toLocaleDateString("en-CA", {
									month: "short",
									day: "numeric",
									year: "numeric",
							  })} - ${new Date(reports.performance_leaderboard.filters.to).toLocaleDateString("en-CA", {
									month: "short",
									day: "numeric",
									year: "numeric",
							  })}`
							: "All Time"}{" "}
						Top Performers
					</CardTitle>
					<CardDescription>
						Showing{" "}
						{reports?.performance_leaderboard?.chart_data?.length == 1
							? "(Top 1) user"
							: reports?.performance_leaderboard?.chart_data?.length > 1
							? "(Top " + reports?.performance_leaderboard?.chart_data?.length + ") users"
							: ""}
					</CardDescription>
				</CardHeader>
				<DataTable columns={columns} data={reports?.performance_leaderboard?.chart_data} />
			</div>
		</div>
	);
}
