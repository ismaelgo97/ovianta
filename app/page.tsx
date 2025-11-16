export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome to Ovianta</h1>
        <p className="text-muted-foreground mt-1">
          Select a destination from the sidebar to manage patients, appointments
          and calendar events.
        </p>
      </div>
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        This space will show dashboards or other shared content. Use the sidebar
        to navigate between workflows.
      </div>
    </div>
  )
}