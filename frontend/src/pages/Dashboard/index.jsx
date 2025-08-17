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
import GalaxyProgressBar from "@/components/design/GalaxyProgressBar";
// Zustand centralized store
import { useUsersStore } from "@/store/users/usersStore";
import { useDashboardStore } from "@/store/dashboard/dashboardStore";
import { useProjectsStore } from "@/store/projects/projectsStore";
export default function UserProfile() {
	const { loading, setLoading } = useLoadContext();
	const { users, setUsers } = useUsersStore();
	const { projects, setProjects } = useProjectsStore();
	const {
		reports,
		setReports,
		userFilter,
		setUserFilter,
		projectFilter,
		setProjectFilter,
		filters,
		setFilters,
		selectedProjects,
		setSelectedProjects,
		selectedUsers,
		setSelectedUsers,
	} = useDashboardStore();

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		document.title = "Task Management";
		if (!reports || Object.keys(reports).length === 0) fetchReports();
		if (!users || users.length === 0) fetchUsers();
		if (!projects || projects.length === 0) fetchProjects();
		if (users.length !== userFilter.length) mapUserFilter(users);
		if (projects.length !== projectFilter.length) mapProjectFilter(projects);
	}, []);
	const fetchReports = async () => {
		setLoading(true);
		try {
			const reportsRes = await axiosClient.get(API().dashboard());
			setReports(reportsRes.data.data);
			setLoading(false);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchUsers = async () => {
		setLoading(true);
		try {
			const userResponse = await axiosClient.get(API().user());
			setUsers(userResponse.data.data);
			mapUserFilter(userResponse.data.data);
			setLoading(false);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const mapUserFilter = (users) => {
		const mappedUsers = users?.map((user) => ({
			value: user.id,
			label: user.name,
		}));
		setUserFilter(mappedUsers);
	};
	const fetchProjects = async () => {
		setLoading(true);
		try {
			const projectResponse = await axiosClient.get(API().project());
			setProjects(projectResponse.data.data);
			mapProjectFilter(projectResponse.data.data);
			setLoading(false);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const mapProjectFilter = (projects) => {
		const mappedProjects = projects?.map((project) => ({
			value: project.id,
			label: project.title,
		}));
		setProjectFilter(mappedProjects);
	};
	const handleRemoveFilter = async (key) => {
		// Deep copy filters to avoid mutating state directly
		const updated = {
			values: { ...filters.values },
			display: { ...filters.display },
		};
		updated.values[key] = "";
		updated.display[key] = "";
		setFilters(updated);
		const from = updated.values["Date Range"] ? updated.values["Date Range"]?.split(" to ")[0] : "";
		const to = updated.values["Date Range"] ? updated.values["Date Range"]?.split(" to ")[1] : "";
		const projects = updated.values["Projects"] ?? "";
		const members = updated.values["Members"] ?? "";
		setLoading(true);
		try {
			// Fetch all reports in one call
			const reportsRes = await axiosClient.get(API().dashboard(from, to, members, projects));
			setReports(reportsRes.data.data);
			setLoading(false);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
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
							<DialogTrigger asChild>{!loading && <Button variant="default">Filter</Button>}</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Select filter</DialogTitle>
									<DialogDescription>Apply available filters to view specific reports</DialogDescription>
								</DialogHeader>
								{/* <FilterForm setIsOpen={setIsOpen} /> */}
								<FilterForm
									setIsOpen={setIsOpen}
									setReports={setReports}
									filters={filters}
									setFilters={setFilters}
									projects={projectFilter}
									users={userFilter}
									selectedProjects={selectedProjects}
									setSelectedProjects={setSelectedProjects}
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
			{/* Overall Progress */}
			<div className="md:col-span-12 w-full">
				<GalaxyProgressBar
					progress={reports?.overall_progress?.progress}
					label={
						reports?.overall_progress?.filters && !Object.values(reports.overall_progress.filters).every((value) => value === null)
							? "Overall Progress (Filtered)"
							: "Overall Progress (All Time)"
					}
					variant="dashboard"
					className="w-full"
				/>
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
