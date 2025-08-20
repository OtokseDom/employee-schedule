import { create } from "zustand";
import { createTasksSlice } from "./tasks/tasksSlice";
import { createUsersSlice } from "./users/usersSlice";
import { createDashboardSlice } from "./dashboard/dashboardSlice";
import { createProjectsSlice } from "./projects/projectsSlice";
import { createUserSlice } from "./user/userSlice";
import { createCategoriesSlice } from "./categories/categoriesSlice";
import { createOrganizationSlice } from "./organization/organizationSlice";
import { createTaskStatusesSlice } from "./taskStatuses/taskStatusesSlice";

export const useAppStore = create((set) => ({
	...createDashboardSlice(set),
	...createTaskStatusesSlice(set),
	...createProjectsSlice(set),
	...createTasksSlice(set),
	...createUsersSlice(set),
	...createUserSlice(set),
	...createCategoriesSlice(set),
	...createOrganizationSlice(set),
}));
