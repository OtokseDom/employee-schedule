// components/task/TaskDiscussions.jsx
import React, { useEffect, useState } from "react";
import { useTaskDiscussionsStore } from "@/store/taskDiscussions/taskDiscussionsStore";
import { fetchTaskDiscussions, storeTaskDiscussion, deleteTaskDiscussion } from "@/utils/taskDiscussionHelpers";

export const TaskDiscussions = ({ taskId }) => {
	const { taskDiscussions, setTaskDiscussions, addTaskDiscussion, removeTaskDiscussion } = useTaskDiscussionsStore();

	const [newContent, setNewContent] = useState("");
	const [attachments, setAttachments] = useState([]);

	useEffect(() => {
		const loadDiscussions = async () => {
			const discussions = await fetchTaskDiscussions();
			setTaskDiscussions(discussions);
		};
		loadDiscussions();
	}, [setTaskDiscussions]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newContent) return;

		const discussion = await storeTaskDiscussion({
			content: newContent,
			task_id: taskId,
			attachments,
		});

		addTaskDiscussion(discussion);
		setNewContent("");
		setAttachments([]);
	};

	const handleDelete = async (id) => {
		await deleteTaskDiscussion(id);
		removeTaskDiscussion(id);
	};

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="flex flex-col gap-2">
				<textarea
					value={newContent}
					onChange={(e) => setNewContent(e.target.value)}
					className="border p-2 rounded"
					placeholder="Add a comment..."
					required
				/>
				<input type="file" multiple onChange={(e) => setAttachments(Array.from(e.target.files))} />
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
					Post Comment
				</button>
			</form>

			<div className="space-y-2">
				{taskDiscussions
					.filter((d) => d.task_id === taskId && !d.parent_id)
					.map((discussion) => (
						<div key={discussion.id} className="border p-2 rounded">
							<div className="flex justify-between items-center">
								<span className="font-semibold">{discussion.user.name}</span>
								<button onClick={() => handleDelete(discussion.id)} className="text-red-600 hover:underline">
									Delete
								</button>
							</div>
							<p className="mt-1">{discussion.content}</p>
							{discussion.attachments?.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-2">
									{discussion.attachments.map((att) => (
										<a
											key={att.id}
											href={`/storage/${att.file_path}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline"
										>
											{att.original_name}
										</a>
									))}
								</div>
							)}
							{/* You can render replies here if needed */}
						</div>
					))}
			</div>
		</div>
	);
};
