import { useAppStore } from "../appStore";

export const useProjectsStore = () => {
	return {
		projects: useAppStore((state) => state.projects),
		projectsLoaded: useAppStore((state) => state.projectsLoaded),
		setProjects: useAppStore((state) => state.setProjects),
		addProject: useAppStore((state) => state.addProject),
		updateProject: useAppStore((state) => state.updateProject),
		removeProject: useAppStore((state) => state.removeProject),
		selectedProject: useAppStore((state) => state.selectedProject),
		setSelectedProject: useAppStore((state) => state.setSelectedProject),
		removeSelectedProject: useAppStore((state) => state.removeSelectedProject),
	};
};
