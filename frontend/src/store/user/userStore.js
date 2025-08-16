import { useAppStore } from "../appStore";

export const useUserStore = () => {
	return {
		user: useAppStore((state) => state.user),
		setUser: useAppStore((state) => state.setUser),
		addUser: useAppStore((state) => state.addUser),
		updateUser: useAppStore((state) => state.updateUser),
		removeUser: useAppStore((state) => state.removeUser),
		userReports: useAppStore((state) => state.userReports),
		setUserReports: useAppStore((state) => state.setUserReports),
		filterProjects: useAppStore((state) => state.filterProjects),
		setFilterProjects: useAppStore((state) => state.setFilterProjects),
		selectedProjects: useAppStore((state) => state.selectedProjects),
		setSelectedProjects: useAppStore((state) => state.setSelectedProjects),
		filters: useAppStore((state) => state.filters),
		setFilters: useAppStore((state) => state.setFilters),
		updateFilterValues: useAppStore((state) => state.updateFilterValues),
		updateFilterDisplay: useAppStore((state) => state.updateFilterDisplay),
	};
};
