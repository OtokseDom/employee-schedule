import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import axiosClient from "@/axios.client";
import { useToast } from "@/contexts/ToastContextProvider";
import { columnsTask } from "@/pages/Tasks/List/columns";
import { DataTableTasks } from "@/pages/Tasks/List/data-table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChartDonut } from "@/components/chart/pie-chart-donut";
import GalaxyProfileBanner from "@/components/design/galaxy";
import { AreaChartGradient } from "@/components/chart/area-chart-gradient";
import { RadarChartGridFilled } from "@/components/chart/radar-chart-grid-filled";
import { ChartLineLabel } from "@/components/chart/line-chart-label";
import { ChartBarMultiple } from "@/components/chart/bar-chart-multiple";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import UserDetails from "@/pages/Users/Show/details";
import { SectionCard } from "@/components/chart/section-card";
import FilterForm from "@/components/form/filter-form";
import FilterTags from "@/components/form/FilterTags";
import { API } from "@/constants/api";
import GalaxyProgressBar from "@/components/design/GalaxyProgressBar";
import { flattenTasks, useTaskHelpers } from "@/utils/taskHelpers";
import { useUsersStore } from "@/store/users/usersStore";
import { useProjectsStore } from "@/store/projects/projectsStore";
import { useCategoriesStore } from "@/store/categories/categoriesStore";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useUserStore } from "@/store/user/userStore";
import UserForm from "../form";
import { useTaskStatusesStore } from "@/store/taskStatuses/taskStatusesStore";
import { useDashboardStore } from "@/store/dashboard/dashboardStore";
export default function UserProfile() {
	const { id } = useParams(); // Get user ID from URL
	const { user, setUser, userReports, setUserReports, profileFilters, setProfileFilters, profileSelectedProjects, setProfileSelectedProjects } =
		useUserStore();
	const { projectFilter } = useDashboardStore();
	const { users } = useUsersStore();
	const { projects, projectsLoaded } = useProjectsStore();
	const { categories } = useCategoriesStore();
	const { tasks, tasksLoaded, setRelations, setActiveTab } = useTasksStore();
	const { taskStatuses } = useTaskStatusesStore();
	// Fetch Hooks
	const { fetchTasks, fetchProjects, fetchUsers, fetchCategories, fetchTaskStatuses, fetchUserReports } = useTaskHelpers();
	const { loading, setLoading } = useLoadContext();
	const [detailsLoading, setDetailsLoading] = useState(false);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenUser, setIsOpenUser] = useState(false);
	const [isOpenFilter, setIsOpenFilter] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [updateDataUser, setUpdateDataUser] = useState({});
	// datatable props
	const [hasRelation, setHasRelation] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [parentId, setParentId] = useState(null); //for adding subtasks from relations tab

	// Flatten tasks for datatable usage (also groups children below parent)
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		// if (tasks !== null) {
		const filteredUserTasks = tasks.filter((task) => Array.isArray(task.assignees) && task.assignees.some((user) => user.id === parseInt(id)));
		setTableData(flattenTasks(filteredUserTasks));
		// }
	}, [tasks, id]);

	useEffect(() => {
		if (!isOpen) {
			setUpdateData({});
			setRelations({});
			setActiveTab("update");
			setParentId(null);
			setHasRelation(false);
		}
		if (!isOpenUser) setUpdateDataUser({});
	}, [isOpen, isOpenUser]);

	useEffect(() => {
		document.title = "Task Management | User Profile";
		if (!taskStatuses || taskStatuses.length === 0) fetchTaskStatuses();
		if (!users || users.length === 0) fetchUsers();
		if (!categories || categories.length === 0) fetchCategories();
		if ((!tasks || tasks.length === 0) && !tasksLoaded) fetchTasks();
		if ((!projects || projects.length === 0) && !projectsLoaded) fetchProjects();
	}, []);

	useEffect(() => {
		// Because 'view account' when on profile page already does not trigger rerender
		if (Object.keys(user).length === 0 || parseInt(user.id) !== parseInt(id)) fetchDetails();
		if (!userReports || userReports.length === 0 || user.id != parseInt(id)) fetchUserReports(id);
	}, [id]);

	const fetchDetails = async () => {
		setDetailsLoading(true);
		try {
			const response = await axiosClient.get(API().user(id));
			setUser(response?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setDetailsLoading(false);
		}
	};

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(API().task(id));
			fetchUserReports(id);
			showToast("Success!", "Task deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};
	const handleRemoveFilter = async (key) => {
		const updated = {
			values: { ...profileFilters.values },
			display: { ...profileFilters.display },
		};
		updated.values[key] = "";
		updated.display[key] = "";
		setProfileFilters(updated);
		const from = updated.values["Date Range"] ? updated.values["Date Range"]?.split(" to ")[0] : "";
		const to = updated.values["Date Range"] ? updated.values["Date Range"]?.split(" to ")[1] : "";
		const projects = updated.values["Projects"] ?? "";
		setLoading(true);
		try {
			// Fetch all user reports in one call
			const reportsRes = await axiosClient.get(API().user_reports(id, from, to, projects));
			setUserReports(reportsRes?.data?.data);
			setLoading(false);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={"flex flex-col w-screen md:w-full container p-5 md:p-0 sm:text-sm -mt-10"}>
			<div
				className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none ${
					isOpenUser || isOpenFilter || dialogOpen ? "opacity-100" : "opacity-0"
				}`}
				aria-hidden="true"
			/>
			{/* ------------------------------- Back button ------------------------------ */}
			<Link to="/users">
				<Button variant="ghost" className="flex items-center">
					<ArrowLeft />
				</Button>
			</Link>
			{/* ------------------------------ User Details ------------------------------ */}
			<GalaxyProfileBanner>
				<UserDetails setIsOpenUser={setIsOpenUser} setDetailsLoading={setDetailsLoading} detailsLoading={detailsLoading} />
			</GalaxyProfileBanner>
			{/* Update user Form Sheet */}
			<Sheet open={isOpenUser} onOpenChange={setIsOpenUser} modal={false}>
				<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Update User</SheetTitle>
						<SheetDescription className="sr-only">Navigate through the app using the options below.</SheetDescription>
					</SheetHeader>
					<UserForm setIsOpen={setIsOpenUser} updateData={user} setUpdateData={setUpdateDataUser} userProfileId={id} />
				</SheetContent>
			</Sheet>
			<div className="flex flex-col gap-4 w-full">
				<div className="flex flex-wrap justify-start items-center gap-4">
					<Dialog modal={false} open={isOpenFilter} onOpenChange={setIsOpenFilter}>
						<DialogTrigger asChild>{!loading && <Button variant="default">Filter</Button>}</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Select filter</DialogTitle>
								<DialogDescription>Apply available filters to view specific reports</DialogDescription>
							</DialogHeader>
							<FilterForm
								setIsOpen={setIsOpenFilter}
								setReports={setUserReports}
								filters={profileFilters}
								setFilters={setProfileFilters}
								projects={projectFilter}
								selectedProjects={profileSelectedProjects}
								setSelectedProjects={setProfileSelectedProjects}
								userId={id}
							/>
						</DialogContent>
					</Dialog>
					<FilterTags filters={profileFilters.display} onRemove={handleRemoveFilter} />
				</div>
				{/* Overall Progress */}
				<div className="md:col-span-12 w-full">
					<GalaxyProgressBar
						progress={userReports?.overall_progress?.progress}
						label={
							userReports?.overall_progress?.filters && !Object.values(userReports.overall_progress.filters).every((value) => value === null)
								? "Overall Progress (Filtered)"
								: "Overall Progress (All Time)"
						}
						className="w-full"
					/>
				</div>
				{/* ---------------------------- Task and Insight ---------------------------- */}
				<div className="flex flex-col bg-card p-4 rounded-2xl lg:flex-row justify-between gap-4 w-full items-stretch">
					<SectionCard variant="" description="Tasks Due Soon" showBadge={false} value={userReports?.section_cards?.task_at_risk} />
					<SectionCard variant="" description="Performance Rating (10)" showBadge={false} value={`${userReports?.section_cards?.avg_performance}`} />
					<SectionCard variant="" description="Time Efficiency" showBadge={false} value={`${userReports?.section_cards?.time_efficiency}%`} />
					<SectionCard variant="" description="Completion Rate" showBadge={false} value={`${userReports?.section_cards?.completion_rate}%`} />
					<SectionCard variant="" description="Avg Delayed Days" showBadge={false} value={userReports?.section_cards?.average_delay_days} />
					<SectionCard variant="" description="Total Delayed Days" showBadge={false} value={userReports?.section_cards?.total_delay_days} />
				</div>
				{/* ---------------------------- Task and Insight ---------------------------- */}
				<div className="flex flex-col lg:flex-row justify-between gap-4 w-full items-stretch">
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						<PieChartDonut report={userReports?.tasks_by_status} />
					</div>
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						<AreaChartGradient report={userReports?.task_activity_timeline} />
					</div>
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						<RadarChartGridFilled report={userReports?.rating_per_category} />
					</div>
				</div>
				{/* ---------------------------- Performance Trend & Estimate vs Actual time ---------------------------- */}
				<div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						<ChartLineLabel report={userReports?.performance_rating_trend} />
					</div>
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						<ChartBarMultiple report={userReports?.estimate_vs_actual} />
					</div>
				</div>
				{/* ---------------------------- Task and Insight ---------------------------- */}
				<div className="flex min-h-[500px] max-h-[700px] flex-col lg:flex-row justify-between gap-4 w-full">
					<div className="w-full overflow-auto scrollbar-custom bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						<div>
							<h1 className=" font-extrabold text-3xl">Tasks</h1>
							<p>
								View list of all tasks
								{userReports?.user_tasks?.filters?.from && userReports?.user_tasks?.filters?.to
									? ` for ${new Date(userReports?.user_tasks?.filters.from).toLocaleDateString("en-CA", {
											month: "short",
											day: "numeric",
											year: "numeric",
									  })} - ${new Date(userReports?.user_tasks?.filters.to).toLocaleDateString("en-CA", {
											month: "short",
											day: "numeric",
											year: "numeric",
									  })}`
									: ""}
							</p>
						</div>

						{/* Updated table to fix dialog per column issue */}
						{(() => {
							const { columnsTask: taskColumns, dialog } = columnsTask({
								dialogOpen,
								setDialogOpen,
								hasRelation,
								setHasRelation,
								setIsOpen,
								setUpdateData,
								fetchTasks,
							});
							return (
								<>
									<DataTableTasks
										columns={taskColumns}
										data={tableData}
										updateData={updateData}
										setUpdateData={setUpdateData}
										isOpen={isOpen}
										setIsOpen={setIsOpen}
										parentId={parentId}
										setParentId={setParentId}
										fetchData={fetchTasks}
										showLess={true}
									/>
									{dialog}
								</>
							);
						})()}
					</div>
				</div>
			</div>
		</div>
	);
}
