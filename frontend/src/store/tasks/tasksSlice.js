export const createTasksSlice = (set) => ({
	tasks: [],

	setTasks: (tasks) => set({ tasks }),

	addTask: (task) =>
		set((state) => ({
			tasks: [task, ...state.tasks],
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
	taskHistory: [],
	selectedTaskHistory: {},

	setTaskHistory: (taskHistory) => set({ taskHistory }),
	setSelectedTaskHistory: (selectedTaskHistory) => set({ selectedTaskHistory }),

	addTaskHistory: (taskHistory) =>
		set((state) => ({
			taskHistory: [...state.taskHistory, taskHistory],
		})),

	updateTaskHistory: (id, updates) =>
		set((state) => ({
			taskHistory: state.taskHistory.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeTaskHistory: (id) =>
		set((state) => ({
			taskHistory: state.taskHistory.filter((t) => t.id !== id),
		})),

	// Relations
	relations: {},

	setRelations: (relations) => set({ relations }),

	addRelation: (relation) =>
		set((state) => ({
			relations: {
				...state.relations,
				children: [...state.relations.children, relation],
			},
		})),

	updateRelation: (id, updates) =>
		set((state) => ({
			relations: state.relations.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeRelation: (id) =>
		set((state) => ({
			relations: state.relations.filter((t) => t.id !== id),
		})),

	// Tab
	activeTab: "update",
	setActiveTab: (activeTab) => set({ activeTab }),
	// Calendar
	selectedUser: null,
	setSelectedUser: (selectedUser) => set({ selectedUser }),
});
