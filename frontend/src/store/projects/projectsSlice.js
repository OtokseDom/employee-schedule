export const createProjectsSlice = (set) => ({
	projects: [],

	setProjects: (projects) => set({ projects }),

	addProject: (project) =>
		set((state) => ({
			projects: [project, ...state.projects],
		})),

	updateProject: (id, updates) =>
		set((state) => ({
			projects: state.projects.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeProject: (id) =>
		set((state) => ({
			projects: state.projects.filter((t) => t.id !== id),
		})),
	// Kanban filter
	selectedProject: null,
	setSelectedProject: (selectedProject) => set({ selectedProject }),
});
