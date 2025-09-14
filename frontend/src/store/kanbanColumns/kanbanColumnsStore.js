import { useAppStore } from "../appStore";

export const useKanbanColumnsStore = () => {
	return {
		kanbanColumns: useAppStore((state) => state.kanbanColumns),
		setKanbanColumns: useAppStore((state) => state.setKanbanColumns),
		addKanbanColumn: useAppStore((state) => state.addKanbanColumn),
		updateKanbanColumn: useAppStore((state) => state.updateKanbanColumn),
		removeKanbanColumnByStatus: useAppStore((state) => state.removeKanbanColumnByStatus),
		removeKanbanColumnByProject: useAppStore((state) => state.removeKanbanColumnByProject),
		updateKanbanColumns: useAppStore((state) => state.updateKanbanColumns),
	};
};
