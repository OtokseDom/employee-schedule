export const createKanbanColumnsSlice = (set) => ({
	kanbanColumns: [],

	setKanbanColumns: (kanbanColumns) => set({ kanbanColumns }),

	addKanbanColumn: (newColumns) =>
		set((state) => ({
			kanbanColumns: [...newColumns, ...state.kanbanColumns],
		})),

	updateKanbanColumn: (id, updates) =>
		set((state) => ({
			kanbanColumns: state.kanbanColumns.map((t) => (t.id === id ? { ...t, ...updates } : t)),
		})),

	removeKanbanColumnByStatus: (statusId) =>
		set((state) => ({
			kanbanColumns: state.kanbanColumns.filter((c) => c.task_status_id !== statusId),
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
