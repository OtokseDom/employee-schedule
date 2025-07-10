"use client";

export const columns = [
	{
		id: "rowNumber",
		header: "#",
		cell: ({ row }) => row.index + 1,
	},
	{
		id: "name",
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const name = row.original.name;
			const position = row.original.position;
			return (
				<div className="min-w-52">
					{name}
					<br />
					<span className="text-sm text-gray-500">{position}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "avg_performance_rating",
		header: "Performance Rating",
	},
];
