export const createDashboardSlice = (set) => ({
	// STATE
	reports: {},
	userFilter: [],
	projectFilter: [],
	selectedUsers: [],
	selectedProjects: [],
	filters: {
		values: {
			"Date Range": null,
			Members: [],
			Projects: [],
		},
		display: {
			"Date Range": null,
			Members: [],
			Projects: [],
		},
	},

	// ACTIONS
	setReports: (reports) => set({ reports }),
	setUserFilter: (userFilter) => set({ userFilter }),
	setProjectFilter: (projectFilter) => set({ projectFilter }),
	setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
	setSelectedProjects: (selectedProjects) => set({ selectedProjects }),
	// Filter Actions
	setFilters: (newDisplay) =>
		set((state) => ({
			filters: {
				values: { ...state.filters.values, ...newDisplay.values },
				display: { ...state.filters.display, ...newDisplay.display },
			},
		})),
});
