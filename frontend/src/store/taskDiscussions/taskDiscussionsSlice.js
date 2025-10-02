export const createTaskDiscussionsSlice = (set) => ({
	taskDiscussions: [],

	setTaskDiscussions: (taskDiscussions) => set({ taskDiscussions }),

	addTaskDiscussion: (discussion) =>
		set((state) => ({
			taskDiscussions: [discussion, ...state.taskDiscussions],
		})),

	updateTaskDiscussion: (id, updates) =>
		set((state) => ({
			taskDiscussions: state.taskDiscussions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
		})),

	removeTaskDiscussion: (id) =>
		set((state) => ({
			taskDiscussions: state.taskDiscussions.filter((d) => d.id !== id),
		})),
});
