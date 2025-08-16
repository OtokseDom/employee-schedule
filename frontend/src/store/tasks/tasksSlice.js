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

	// Task History
	taskHistories: [],
	selectedTaskHistory: {},

	setTaskHistory: (taskHistory) => set({ taskHistory }),
	setSelectedTaskHistory: (selectedTaskHistory) => set({ selectedTaskHistory }),

	addTaskHistory: (taskHistory) =>
		set((state) => ({
			taskHistories: [...state.taskHistories, taskHistory],
		})),

	updateTaskHistory: (id, updates) =>
		set((state) => ({
			taskHistories: state.taskHistories.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeTaskHistory: (id) =>
		set((state) => ({
			taskHistories: state.taskHistories.filter((t) => t.id !== id),
		})),

	// Relations
	relations: [],

	setRelations: (relations) => set({ relations }),

	addRelation: (relation) =>
		set((state) => ({
			relations: [...state.relations, relation],
		})),

	updateRelation: (id, updates) =>
		set((state) => ({
			relations: state.relations.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeRelation: (id) =>
		set((state) => ({
			relations: state.relations.filter((t) => t.id !== id),
		})),
});
