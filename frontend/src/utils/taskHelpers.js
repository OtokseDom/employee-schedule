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
