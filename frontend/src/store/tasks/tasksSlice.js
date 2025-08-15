export const createTasksSlice = (set) => ({
	tasks: [],

	setTasks: (tasks) => set({ tasks }),

	addTask: (task) =>
		set((state) => ({
			tasks: [...state.tasks, task],
		})),

	updateTask: (id, updates) =>
		set((state) => ({
			tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeTask: (id) =>
		set((state) => ({
			tasks: state.tasks.filter((t) => t.id !== id),
		})),
});
