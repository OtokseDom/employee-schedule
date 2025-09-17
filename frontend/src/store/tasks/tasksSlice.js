// ...existing code...
export const createTasksSlice = (set) => ({
	// ...existing code...
	// Merge/replace tasks from backend (bulk update)
	mergeTasks: (updatedTasks) =>
		set((state) => {
			const updatedMap = new Map(updatedTasks.map((t) => [t.id, t]));
			return {
				tasks: state.tasks.map((t) => updatedMap.get(t.id) || t),
			};
		}),
	tasks: [],
	tasksLoaded: false, // flag to know if fetched

	setTasks: (tasks) => set({ tasks, tasksLoaded: true }),
	setTasksLoaded: (loaded) => set({ tasksLoaded: loaded }),
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
	// Multi-select users
	options: [],
	setOptions: (options) => set({ options }),
	addOption: (option) =>
		set((state) => ({
			options: [...state.options, option],
		})),
	// Move task position
	updateTaskPosition: (taskId, newStatusId, newPosition) =>
		set((state) => {
			const tasks = [...state.tasks];
			const task = tasks.find((t) => t.id === taskId);
			if (!task) return { tasks };

			const oldStatusId = task.status_id;
			const oldPosition = task.position;

			// Remove task from old column and shift
			tasks.filter((t) => t.status_id === oldStatusId && t.position > oldPosition).forEach((t) => t.position--);

			// Shift tasks in new column
			tasks.filter((t) => t.status_id === newStatusId && t.position >= newPosition).forEach((t) => t.position++);

			// Update moved task
			task.status_id = newStatusId;
			task.position = newPosition;

			return { tasks };
		}),
	// Merge backend authoritative data
	mergeTaskPositions: (affectedTasks) =>
		set((state) => {
			const affectedMap = new Map();
			affectedTasks.forEach((t) => affectedMap.set(t.id, t));

			return {
				tasks: state.tasks.map((t) => affectedMap.get(t.id) ?? t),
			};
		}),
});
