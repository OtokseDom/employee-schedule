import { useAppStore } from "../appStore";

export const useTasksStore = () => {
	return {
		tasks: useAppStore((state) => state.tasks),
		setTasks: useAppStore((state) => state.setTasks),
		addTask: useAppStore((state) => state.addTask),
		updateTask: useAppStore((state) => state.updateTask),
		removeTask: useAppStore((state) => state.removeTask),
		// Task History
		taskHistory: useAppStore((state) => state.taskHistory),
		selectedTaskHistory: useAppStore((state) => state.selectedTaskHistory),
		setTaskHistory: useAppStore((state) => state.setTaskHistory),
		setSelectedTaskHistory: useAppStore((state) => state.setSelectedTaskHistory),
		addTaskHistory: useAppStore((state) => state.addTaskHistory),
		updateTaskHistory: useAppStore((state) => state.updateTaskHistory),
		removeTaskHistory: useAppStore((state) => state.removeTaskHistory),
		// Relations
		relations: useAppStore((state) => state.relations),
		setRelations: useAppStore((state) => state.setRelations),
		addRelation: useAppStore((state) => state.addRelation),
		updateRelation: useAppStore((state) => state.updateRelation),
		removeRelation: useAppStore((state) => state.removeRelation),
		// Tab
		activeTab: useAppStore((state) => state.activeTab),
		setActiveTab: useAppStore((state) => state.setActiveTab),
		// Calendar
		selectedUser: useAppStore((state) => state.selectedUser),
		setSelectedUser: useAppStore((state) => state.setSelectedUser),
		// Multi-select users
		options: useAppStore((state) => state.options),
		setOptions: useAppStore((state) => state.setOptions),
		addOption: useAppStore((state) => state.addOption),
	};
};
