import { create } from "zustand";
import { createTasksSlice } from "./tasks/tasksSlice";
import { createUsersSlice } from "./users/usersSlice";
import { createDashboardSlice } from "./dashboard/dashboardSlice";
import { createProjectsSlice } from "./projects/projectsSlice";

export const useAppStore = create((set) => ({
	...createDashboardSlice(set),
	...createProjectsSlice(set),
	...createTasksSlice(set),
	...createUsersSlice(set),
}));
