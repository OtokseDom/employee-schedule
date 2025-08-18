import { useAppStore } from "../appStore";

export const useOrganizationStore = () => {
	return {
		organization: useAppStore((state) => state.organization),
		setOrganization: useAppStore((state) => state.setOrganization),
	};
};
