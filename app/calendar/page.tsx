export default function CalendarPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <p className="text-muted-foreground">
          Visualize availability and upcoming appointments.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Integrate your preferred calendar component here to sync provider
        schedules and patient reminders.
      </div>
    </div>
  )
}

