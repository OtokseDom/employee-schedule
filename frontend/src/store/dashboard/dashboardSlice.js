export const createDashboardSlice = (set) => ({
	// STATE
	reports: {},
	userFilter: [],
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

	// Project Filter
	projectFilter: [],
	setProjectFilter: (projectFilter) => set({ projectFilter }),
	addProjectFilter: (project) =>
		set((state) => ({
			projectFilter: [{ value: project.id, label: project.title }, ...state.projectFilter],
		})),

	updateProjectFilter: (value, updates) =>
		set((state) => ({
			projectFilter: state.projectFilter.map((t) => (t.value === value ? { ...t, ...updates } : t)),
		})),

	removeProjectFilter: (value) =>
		set((state) => ({
			projectFilter: state.projectFilter.filter((t) => t.value !== value),
		})),
	// ACTIONS
	setReports: (reports) => set({ reports }),
	setUserFilter: (userFilter) => set({ userFilter }),
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
