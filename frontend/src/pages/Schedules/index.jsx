import ScheduleCalendar from "./calendar";

export default function Schedules() {
	return (
		<div className="flex flex-col xl:flex-row justify-center gap-2 -mb-32 md:mb-0 w-screen md:w-[1000px] h-screen md:h-fit container">
			<div className="xl:order-2 order-1 bg-card overflow-auto scrollbar-custom h-full text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
				<ScheduleCalendar />
			</div>
		</div>
	);
}
