import { useAppStore } from "../appStore";

export const useTasksStore = () => {
	return {
		tasks: useAppStore((state) => state.tasks),
		setTasks: useAppStore((state) => state.setTasks),
		addTask: useAppStore((state) => state.addTask),
		updateTask: useAppStore((state) => state.updateTask),
		removeTask: useAppStore((state) => state.removeTask),
	};
};
