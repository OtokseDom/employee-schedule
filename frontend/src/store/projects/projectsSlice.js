export const createProjectsSlice = (set) => ({
	projects: [],
	projectsLoaded: false,

	setProjects: (projects) => set({ projects, projectsLoaded: true }),

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
	removeSelectedProject: () => set({ selectedProject: null }),
});
