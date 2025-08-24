import { useAppStore } from "../appStore";

export const useUsersStore = () => {
	return {
		users: useAppStore((state) => state.users),
		setUsers: useAppStore((state) => state.setUsers),
		addUser: useAppStore((state) => state.addUser),
		updateUser: useAppStore((state) => state.updateUser),
		removeUser: useAppStore((state) => state.removeUser),
	};
};
