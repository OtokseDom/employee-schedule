export const createUserSlice = (set) => ({
	user: {},
	userReports: {},
	profileProjectFilter: [],
	profileSelectedProjects: [],
	profileFilters: {
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
	setUserReports: (userReports) => set({ userReports }),
	setProfileProjectFilter: (profileProjectFilter) => set({ profileProjectFilter }),
	setProfileSelectedProjects: (profileSelectedProjects) => set({ profileSelectedProjects }),

	setProfileFilters: (newDisplay) =>
		set((state) => ({
			profileFilters: {
				values: { ...state.profileFilters.values, ...newDisplay.values },
				display: { ...state.profileFilters.display, ...newDisplay.display },
			},
		})),
});
