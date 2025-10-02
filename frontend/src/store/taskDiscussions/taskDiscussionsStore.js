import { useAppStore } from "../appStore";

export const useTaskDiscussionsStore = () => {
	return {
		taskDiscussions: useAppStore((state) => state.taskDiscussions),
		setTaskDiscussions: useAppStore((state) => state.setTaskDiscussions),
		addTaskDiscussion: useAppStore((state) => state.addTaskDiscussion),
		updateTaskDiscussion: useAppStore((state) => state.updateTaskDiscussion),
		removeTaskDiscussion: useAppStore((state) => state.removeTaskDiscussion),
	};
};
