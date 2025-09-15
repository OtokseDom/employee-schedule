import { useAppStore } from "../appStore";

export const useDashboardStore = () => {
	return {
		reports: useAppStore((state) => state.reports),
		userFilter: useAppStore((state) => state.userFilter),
		projectFilter: useAppStore((state) => state.projectFilter),
		selectedUsers: useAppStore((state) => state.selectedUsers),
		selectedProjects: useAppStore((state) => state.selectedProjects),
		filters: useAppStore((state) => state.filters),
		setReports: useAppStore((state) => state.setReports),
		setUserFilter: useAppStore((state) => state.setUserFilter),
		setProjectFilter: useAppStore((state) => state.setProjectFilter),
		addProjectFilter: useAppStore((state) => state.addProjectFilter),
		updateProjectFilter: useAppStore((state) => state.updateProjectFilter),
		removeProjectFilter: useAppStore((state) => state.removeProjectFilter),
		setSelectedUsers: useAppStore((state) => state.setSelectedUsers),
		setSelectedProjects: useAppStore((state) => state.setSelectedProjects),
		setFilters: useAppStore((state) => state.setFilters),
	};
};
