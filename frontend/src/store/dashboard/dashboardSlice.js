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
	setFilters: (filters) => set({ filters }),

	updateFilterValues: (key, value) =>
		set((state) => ({
			filters: {
				...state.filters,
				values: { ...state.filters.values, [key]: value },
				display: { ...state.filters.display },
			},
		})),

	updateFilterDisplay: (key, value) =>
		set((state) => ({
			filters: {
				...state.filters,
				values: { ...state.filters.values },
				display: { ...state.filters.display, [key]: value },
			},
		})),
});
