export const createUsersSlice = (set) => ({
	users: [],

	setUsers: (users) => set({ users }),

	addUser: (user) =>
		set((state) => ({
			users: [...state.users, user],
		})),

	updateUser: (id, updates) =>
		set((state) => ({
			users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
		})),

	removeUser: (id) =>
		set((state) => ({
			users: state.users.filter((u) => u.id !== id),
		})),
});
