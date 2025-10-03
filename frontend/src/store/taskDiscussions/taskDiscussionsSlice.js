export const createTaskDiscussionsSlice = (set) => ({
	taskDiscussions: [],
	selectedTaskDiscussion: {},
	taskDiscussionsLoaded: false, // flag to know if fetched

	setTaskDiscussions: (taskDiscussions) => set({ taskDiscussions }),
	setSelectedTaskDiscussion: (selectedTaskDiscussion) => set({ selectedTaskDiscussion }),
	setTaskDiscussionsLoaded: (loaded) => set({ taskDiscussionsLoaded: loaded }),

	addTaskDiscussion: (discussion) =>
		set((state) => ({
			taskDiscussions: [...state.taskDiscussions, discussion],
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
