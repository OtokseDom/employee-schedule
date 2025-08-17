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
import { flattenTasks } from "@/utils/taskHelpers";
import { useUsersStore } from "@/store/users/usersStore";
import { useProjectsStore } from "@/store/projects/projectsStore";
import { useCategoriesStore } from "@/store/categories/categoriesStore";
import { useTasksStore } from "@/store/tasks/tasksStore";
import { useUserStore } from "@/store/user/userStore";
import UserForm from "../form";

export default function UserProfile() {
	const { user: user_auth, setUser: setUserAuth } = useAuthContext();
	const { id } = useParams(); // Get user ID from URL
	const { users, setUsers, removeUser } = useUsersStore();
	const {
		user,
		setUser,
		userReports,
		setUserReports,
		profileProjectFilter,
		setProfileProjectFilter,
		profileFilters,
		setProfileFilters,
		profileSelectedProjects,
		setProfileSelectedProjects,
	} = useUserStore();
	const { projects, setProjects } = useProjectsStore();
	const { categories, setCategories } = useCategoriesStore();
	const { taskHistory, setTaskHistory, selectedTaskHistory, setSelectedTaskHistory, relations, setRelations } = useTasksStore();
	const { loading, setLoading } = useLoadContext();
	const [detailsLoading, setDetailsLoading] = useState(false);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenUser, setIsOpenUser] = useState(false);
	const [isOpenFilter, setIsOpenFilter] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [updateDataUser, setUpdateDataUser] = useState({});
	// Subtasks
	// const [relations, setRelations] = useState([]);

	const [activeTab, setActiveTab] = useState(false);
	const [parentId, setParentId] = useState(null); //for adding subtasks from relations tab

	// Flatten tasks for datatable usage (also groups children below parent)
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		if (userReports?.user_tasks?.data) setTableData(flattenTasks(userReports?.user_tasks?.data));
	}, [userReports?.user_tasks?.data]);

	const navigate = useNavigate();
	useEffect(() => {
		if (!isOpen) {
			setUpdateData({});
			setRelations({});
			setActiveTab("update");
			setParentId(null);
		}
		if (!isOpenUser) setUpdateDataUser({});
	}, [isOpen, isOpenUser]);

	useEffect(() => {
		document.title = "Task Management | User Profile";
		if (Object.keys(user).length === 0 || user.id !== id) fetchDetails();
		if (!projects || projects.length === 0) fetchProjects();
		if (!users || users.length === 0) fetchUsers();
		if (!categories || categories.length === 0) fetchCategories();
		if (!userReports || userReports.length === 0 || user.id != parseInt(id)) fetchData();
	}, []);

	useEffect(() => {
		// Because 'view account' when on profile page already does not trigger rerender
		if (Object.keys(user).length === 0 || user.id !== id) fetchDetails();
		if (!userReports || userReports.length === 0 || user.id != parseInt(id)) fetchData();
	}, [user.id, id]);

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
	const fetchData = async () => {
		setLoading(true);
		try {
			const reportsRes = await axiosClient.get(API().user_reports(id));
			setUserReports(reportsRes?.data?.data);
			setTaskHistory(reportsRes?.data?.data?.user_tasks?.task_history);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchProjects = async () => {
		setLoading(true);
		try {
			// selection items
			const projectResponse = await axiosClient.get(API().project());
			const mappedProjects = projectResponse.data.data.map((project) => ({
				value: project.id,
				label: project.title,
			}));
			setProfileProjectFilter(mappedProjects);
			setProjects(projectResponse?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchUsers = async () => {
		setLoading(true);
		try {
			// selection items
			const userResponse = await axiosClient.get(API().user());
			setUsers(userResponse?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};
	const fetchCategories = async () => {
		setLoading(true);
		try {
			// selection items
			const categoryResponse = await axiosClient.get(API().category());
			setCategories(categoryResponse?.data?.data);
		} catch (e) {
			if (e.message !== "Request aborted") console.error("Error fetching data:", e.message);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateUser = async (user) => {
		setIsOpenUser(true);
		setUpdateDataUser(user);
		// Update sidebar user if current user is updated
		if (user.id == user_auth.id) {
			axiosClient.get(API().user_auth).then(({ data }) => {
				setUserAuth(data);
			});
		}
	};

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(API().task(id));
			fetchData();
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
					isOpenUser || isOpenFilter ? "opacity-100" : "opacity-0"
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
				<UserDetails handleUpdateUser={handleUpdateUser} setDetailsLoading={setDetailsLoading} detailsLoading={detailsLoading} />
			</GalaxyProfileBanner>
			{/* Update user Form Sheet */}
			<Sheet open={isOpenUser} onOpenChange={setIsOpenUser} modal={false}>
				<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Update User</SheetTitle>
						<SheetDescription className="sr-only">Navigate through the app using the options below.</SheetDescription>
					</SheetHeader>
					<UserForm setIsOpen={setIsOpenUser} updateData={updateDataUser} setUpdateData={setUpdateDataUser} userProfileId={id} />
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
								projects={profileProjectFilter}
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
					<SectionCard
						variant=""
						description="Performance Rating (10)"
						showBadge={false}
						value={`${userReports?.section_cards?.avg_performance}`}
						percentage={12.2}
					/>
					<SectionCard
						variant=""
						description="Time Efficiency"
						showBadge={false}
						value={`${userReports?.section_cards?.time_efficiency}%`}
						percentage={12.2}
					/>
					<SectionCard
						variant=""
						description="Completion Rate"
						showBadge={false}
						value={`${userReports?.section_cards?.completion_rate}%`}
						percentage={12.2}
					/>
					<SectionCard variant="" description="Tasks Due Soon" showBadge={false} value={userReports?.section_cards?.task_at_risk} percentage={12.2} />
					<SectionCard variant="" description="Overdue Tasks" showBadge={false} value={userReports?.section_cards?.task_at_risk} percentage={12.2} />
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

						<DataTableTasks
							columns={columnsTask(
								{ tableData, handleDelete, setIsOpen, setUpdateData, taskHistory, setSelectedTaskHistory, setRelations },
								false
							)}
							data={tableData}
							taskHistory={taskHistory}
							selectedTaskHistory={selectedTaskHistory}
							relations={relations}
							setRelations={setRelations}
							setSelectedTaskHistory={setSelectedTaskHistory}
							projects={projects}
							users={users}
							categories={categories}
							updateData={updateData}
							setUpdateData={setUpdateData}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							fetchData={fetchData}
							showLess={true}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							parentId={parentId}
							setParentId={setParentId}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
