export const createUserSlice = (set) => ({
	user: {},
	userReports: {},
	filterProjects: [],
	selectedProjects: [],
	filters: {
		values: {
			"Date Range": null,
			Projects: [],
		},
		display: {
			"Date Range": null,
			Projects: [],
		},
	},

	setUser: (user) => set({ user }),
	addUser: (user) =>
		set((state) => ({
			users: [user, ...state.users],
		})),
	updateUser: (id, updates) =>
		set((state) => ({
			users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
		})),
	removeUser: (id) =>
		set((state) => ({
			users: state.users.filter((u) => u.id !== id),
		})),
	setUserReports: (userReports) => set({ userReports }),
	setFilterProjects: (filterProjects) => set({ filterProjects }),
	setSelectedProjects: (selectedProjects) => set({ selectedProjects }),
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
