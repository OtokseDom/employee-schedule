export const createKanbanColumnsSlice = (set) => ({
	kanbanColumns: [],

	setKanbanColumns: (kanbanColumns) => set({ kanbanColumns }),

	addKanbanColumn: (kanbanColumns) =>
		set((state) => ({
			kanbanColumns: [kanbanColumns, ...state.kanbanColumns],
		})),

	updateKanbanColumn: (id, updates) =>
		set((state) => ({
			kanbanColumns: state.kanbanColumns.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeKanbanColumn: (id) =>
		set((state) => ({
			kanbanColumns: state.kanbanColumns.filter((t) => t.id !== id),
		})),
	/** new bulk updater */
	updateKanbanColumns: (projectId, updatedColumns) =>
		set((state) => {
			// Remove existing columns for this project
			const filtered = state.kanbanColumns.filter((col) => col.project_id !== projectId);

			// Add back updated ones
			return {
				kanbanColumns: [...filtered, ...updatedColumns],
			};
		}),
});
