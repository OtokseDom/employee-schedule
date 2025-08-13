// src/utils/taskHelpers.js

export function flattenTasks(tasks) {
	// Get IDs of all children
	const childIds = new Set();
	tasks.forEach((task) => {
		task.children?.forEach((child) => {
			childIds.add(child.id);
		});
	});

	// Filter only tasks NOT in children list (top-level only)
	const topLevelTasks = tasks.filter((task) => !childIds.has(task.id));

	const flatten = (taskList, depth = 0) => {
		let flat = [];
		for (const task of taskList) {
			flat.push({ ...task, depth });
			if (task.children?.length) {
				flat = flat.concat(flatten(task.children, depth + 1));
			}
		}
		return flat;
	};

	return flatten(topLevelTasks);
}

export const statusColors = {
	Pending: "bg-yellow-100 border border-yellow-800 border-2 text-yellow-800",
	"In Progress": "bg-blue-100 border border-blue-800 border-2 text-blue-800",
	"For Review": "bg-orange-100 border border-orange-800 border-2 text-orange-800",
	Completed: "bg-green-100 border border-green-800 border-2 text-green-800",
	Cancelled: "bg-red-100 border border-red-800 border-2 text-red-800",
	Delayed: "bg-purple-100 border border-purple-800 border-2 text-purple-800",
	"On Hold": "bg-gray-100 border border-gray-800 border-2 text-gray-800",
};
