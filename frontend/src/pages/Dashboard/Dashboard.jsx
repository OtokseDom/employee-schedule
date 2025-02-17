import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Dashboard() {
	// Simulate fetching data (without TypeScript types)
	function getData() {
		// Fetch data from your API here.
		return [
			{
				id: "728ed52f",
				amount: 100,
				status: "pending",
				email: "m@example.com",
			},
			{
				id: "e33c4d5a",
				amount: 250,
				status: "completed",
				email: "a@example.com",
			},
			{
				id: "b68f2d1e",
				amount: 75,
				status: "failed",
				email: "j@example.com",
			},
			{
				id: "fd8e7c1b",
				amount: 200,
				status: "pending",
				email: "k@example.com",
			},
			{
				id: "9c7f2e0d",
				amount: 150,
				status: "completed",
				email: "l@example.com",
			},
			{
				id: "d9e42a6b",
				amount: 90,
				status: "pending",
				email: "o@example.com",
			},
			{
				id: "3b6e8d0f",
				amount: 120,
				status: "completed",
				email: "p@example.com",
			},
			{
				id: "f2a49e8c",
				amount: 60,
				status: "failed",
				email: "q@example.com",
			},
			{
				id: "5e2b7c3a",
				amount: 300,
				status: "pending",
				email: "r@example.com",
			},
			{
				id: "a73d3f1c",
				amount: 80,
				status: "completed",
				email: "s@example.com",
			},
			{
				id: "7d4c2b1a",
				amount: 110,
				status: "failed",
				email: "t@example.com",
			},
			{
				id: "b53e7f4e",
				amount: 130,
				status: "pending",
				email: "u@example.com",
			},
			{
				id: "a3c7f8d1",
				amount: 250,
				status: "completed",
				email: "v@example.com",
			},
			{
				id: "0d4a6e2f",
				amount: 140,
				status: "pending",
				email: "w@example.com",
			},
			{
				id: "6c2d4f1a",
				amount: 220,
				status: "completed",
				email: "x@example.com",
			},
			{
				id: "f4b7e8c9",
				amount: 95,
				status: "failed",
				email: "y@example.com",
			},
			{
				id: "1e2f4d6a",
				amount: 130,
				status: "pending",
				email: "z@example.com",
			},
			{
				id: "3f8d6e1b",
				amount: 160,
				status: "completed",
				email: "aa@example.com",
			},
			{
				id: "5a4e3d7c",
				amount: 50,
				status: "failed",
				email: "ab@example.com",
			},
			{
				id: "6b1f2c5a",
				amount: 300,
				status: "pending",
				email: "ac@example.com",
			},
			{
				id: "7d2a8f1c",
				amount: 175,
				status: "completed",
				email: "ad@example.com",
			},
		];
	}
	const data = getData();
	return (
		<>
			<div className="w-full bg-card text-card-foreground border border-border rounded-md container p-10">
				<DataTable columns={columns} data={data} />
			</div>
		</>
	);
}
