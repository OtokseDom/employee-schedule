// components/task/TaskDiscussions.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useTaskDiscussionsStore } from "@/store/taskDiscussions/taskDiscussionsStore";
import { storeTaskDiscussion, deleteTaskDiscussion } from "@/utils/taskDiscussionHelpers";
import { useTaskHelpers } from "@/utils/taskHelpers";
import { Skeleton } from "@/components/ui/skeleton";

// shadcn/ui components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useLoadContext } from "@/contexts/LoadContextProvider";

export const TaskDiscussions = ({ taskId }) => {
	const { taskDiscussions, taskDiscussionsLoaded, addTaskDiscussion, removeTaskDiscussion } = useTaskDiscussionsStore();
	const { fetchTaskDiscussions } = useTaskHelpers();
	const [newContent, setNewContent] = useState("");
	const [attachments, setAttachments] = useState([]);
	const { loading } = useLoadContext();

	useEffect(() => {
		if ((!taskDiscussions || taskDiscussions.length === 0) && !taskDiscussionsLoaded) {
			fetchTaskDiscussions();
		}
	}, []);

	// TODO: Update store on add/update/delete
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newContent.trim()) return;

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
		<div className="flex flex-col h-full">
			{/* Discussions Scroll Area */}
			<ScrollArea className="flex-1 pr-2">
				<div className="space-y-4 pb-32">
					{loading ? (
						<div className="flex flex-col space-y-3 w-full">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} index={i * 0.9} className="h-24 w-full" />
							))}
						</div>
					) : (
						taskDiscussions
							.filter((d) => d.task_id === taskId)
							.map((discussion) => (
								<Card key={discussion.id} className="shadow-sm bg-secondary/50">
									<CardHeader className="flex flex-row items-center justify-between p-3 border-b">
										<div className="font-semibold text-sm">{discussion.user?.name}</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleDelete(discussion.id)}
											className="text-red-500 hover:text-red-600"
										>
											Delete
										</Button>
									</CardHeader>
									<CardContent className="p-3 space-y-2">
										<p className="text-sm whitespace-pre-line">{discussion.content}</p>

										{/* Attachments */}
										{discussion.attachments?.length > 0 && (
											<div className="flex flex-wrap gap-2 mt-2">
												{discussion.attachments.map((att) => {
													const isImage = att.original_name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
													return (
														<div key={att.id} className="w-32">
															{isImage ? (
																<Dialog>
																	<DialogTrigger asChild>
																		<img
																			src={att.file_url}
																			alt={att.original_name}
																			className="rounded border w-32 h-24 object-cover hover:cursor-pointer"
																		/>
																	</DialogTrigger>
																	<DialogContent className="max-w-4xl">
																		<DialogHeader>
																			<DialogTitle>{att.original_name}</DialogTitle>
																		</DialogHeader>
																		<div className="flex justify-center">
																			<img
																				src={att.file_url}
																				alt={att.original_name}
																				className="max-w-full max-h-[70vh] object-contain"
																			/>
																		</div>
																	</DialogContent>
																</Dialog>
															) : (
																<a
																	href={`/storage/${att.file_url}`}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-blue-600 underline text-sm"
																>
																	{att.original_name}
																</a>
															)}
														</div>
													);
												})}
											</div>
										)}
									</CardContent>
								</Card>
							))
					)}
				</div>
			</ScrollArea>

			{/* Sticky Input Area */}
			<div className="sticky bottom-0 backdrop-blur-sm bg-background/30 backdrop-saturate-150">
				<form onSubmit={handleSubmit} className="flex flex-col gap-2">
					<Textarea
						value={newContent}
						onChange={(e) => setNewContent(e.target.value)}
						placeholder="Write a comment..."
						className="resize-none bg-secondary"
						required
					/>

					<div className="flex items-start justify-between gap-2">
						<Input
							type="file"
							multiple
							onChange={(e) => setAttachments(Array.from(e.target.files))}
							className="cursor-pointer bg-secondary/50 text-foreground"
						/>
						<Button type="submit">Submit</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
