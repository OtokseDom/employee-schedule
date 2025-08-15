export const createProjectsSlice = (set) => ({
	projects: [],

	setProjects: (projects) => set({ projects }),

	addProject: (project) =>
		set((state) => ({
			projects: [...state.projects, project],
		})),

	updateProject: (id, updates) =>
		set((state) => ({
			projects: state.projects.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeProject: (id) =>
		set((state) => ({
			projects: state.projects.filter((t) => t.id !== id),
		})),
});
