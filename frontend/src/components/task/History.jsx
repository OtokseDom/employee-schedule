import { format } from "date-fns";
export default function History({ selectedTaskHistory }) {
	return (
		<div className="flex flex-col text-sm">
			{selectedTaskHistory.map((history, index) => {
				if (history?.remarks === "Task Added") {
					return (
						<div key={index} className="w-full overflow-y-auto text-muted-foreground p-5">
							<div>
								<span className="font-bold">{history?.changedBy?.name}</span> created this task
							</div>
							<div className="text-blue-500">{format(new Date(history?.created_at), "MMMM dd, yyyy, hh:mm a")}</div>
						</div>
					);
				} else {
					return (
						<div key={index} className="w-full overflow-y-auto text-muted-foreground p-5 border-t">
							<div>
								<span className="font-bold">{history?.changedBy?.name}</span> updated this task
							</div>
							<div className="text-blue-500">{format(new Date(history?.changed_at), "MMMM dd, yyyy, hh:mm a")}</div>
							<div className="flex flex-col gap-4 text-foreground mt-2">
								<div className="flex flex-col px-5 border-l-2 border-muted-foreground">
									<span className="font-bold text-muted-foreground">From</span>
									{Object.entries(history.remarks).map(([key, value]) => {
										const label = key.endsWith("_id")
											? key.replace(/_id$/, "") // remove '_id' at the end
											: key;

										const formattedLabel = label.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
										const renderValue = (val) => {
											if (!val) return null;

											if (key === "description") {
												return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: val }} />;
											}

											return <span>{val}</span>;
										};
										return (
											<span key={key}>
												<span className="text-muted-foreground">{formattedLabel}: </span>
												{renderValue(value.from)}
											</span>
										);
									})}
								</div>
								<div className="flex flex-col px-5 border-l-2 border-muted-foreground">
									<span className="font-bold text-muted-foreground">To</span>
									{Object.entries(history.remarks).map(([key, value]) => {
										const label = key.endsWith("_id")
											? key.replace(/_id$/, "") // remove '_id' at the end
											: key;

										const formattedLabel = label.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word
										const renderValue = (val) => {
											if (!val) return null;

											if (key === "description") {
												return (
													<div
														className="prose prose-sm max-w-none
												 			[&_ul]:list-disc [&_ul]:pl-6
															[&_ol]:list-decimal [&_ol]:pl-6
															[&_li]:my-1"
														dangerouslySetInnerHTML={{ __html: val }}
													/>
												);
											}

											return <span>{val}</span>;
										};
										return (
											<span key={key}>
												<span className="text-muted-foreground">{formattedLabel}: </span>
												{renderValue(value.to)}
											</span>
										);
									})}
								</div>
							</div>
						</div>
					);
				}
			})}
		</div>
	);
}
