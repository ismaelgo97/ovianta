import { Suspense } from "react"

import { CreateAppointmentDialog } from "@/components/appointments/create-appointment-dialog"
import { EditAppointmentDialog } from "@/components/appointments/edit-appointment-dialog"
import { Button } from "@/components/ui/button"
import { deleteAppointmentAction } from "@/app/appointments/actions"
import {
  getAllAppointments,
  getAppointmentsByPatientId,
  type AppointmentStatus,
} from "@/lib/models/appointment"
import { getPatientById } from "@/lib/models/patient"
import type { Patient } from "@/lib/models/patient"
import { cn, getAgeInYears } from "@/lib/utils"
import { Trash2 } from "lucide-react"

type PageProps = {
  searchParams?: Promise<{ patient?: string }>
}

export default async function AppointmentsPage({ searchParams }: PageProps) {
  const resolvedSearch = searchParams ? await searchParams : undefined
  const patientId = resolvedSearch?.patient

  const patient = patientId ? await getPatientById(patientId) : null

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <p className="text-muted-foreground">
            Review and manage patient appointments.
          </p>
        </div>
        <CreateAppointmentDialog
          patientId={patientId}
          patientName={
            patient ? `${patient.firstName} ${patient.lastName}` : undefined
          }
        />
      </div>

      {patientId && (
        <div className="rounded-lg border p-4">
          {patient ? (
            <>
              <h2 className="text-lg font-semibold">
                {patient.firstName} {patient.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {patient.phoneNumber} • Prefers {patient.language.toUpperCase()}
                {typeof patient.dateOfBirth === "object" && (
                  <> • {getAgeInYears(patient.dateOfBirth)} years old</>
                )}
              </p>
            </>
          ) : (
            <p className="text-sm text-destructive">
              Patient with id "{patientId}" not found.
            </p>
          )}
        </div>
      )}

      <Suspense fallback={<AppointmentsFallback />}>
        <AppointmentsList patientId={patientId} patient={patient} />
      </Suspense>
    </div>
  )
}

function AppointmentsFallback() {
  return (
    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      Loading appointments…
    </div>
  )
}

async function AppointmentsList({
  patientId,
  patient,
}: {
  patientId?: string
  patient: Patient | null
}) {
  const appointments = patientId
    ? await getAppointmentsByPatientId(patientId)
    : await getAllAppointments()

  // Preload all patients referenced by these appointments to avoid duplicate lookups.
  const patientMap = new Map<string, Patient | null>()

  if (patientId) {
    patientMap.set(patientId, patient)
  }

  await Promise.all(
    appointments.map(async (appt) => {
      const id = appt.patientId.toString()
      if (!patientMap.has(id)) {
        const p = await getPatientById(id)
        patientMap.set(id, p)
      }
    })
  )

  if (appointments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        No appointments yet. Create one to get started.
      </div>
    )
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {appointments.map((appt) => (
        <li
          key={appt._id?.toString()}
          className="rounded-lg border p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium">
                {appt.specialty} with Dr. {appt.doctorName}
              </div>
              <div className="text-sm text-muted-foreground">
                {(() => {
                  const patient = patientMap.get(appt.patientId.toString())
                  if (!patient) return "Unknown patient"
                  return `${patient.firstName} ${patient.lastName}`
                })()}
              </div>
              <div className="text-sm text-muted-foreground">
                <span>{appt.appointmentDate.toLocaleString()}</span>
                <StatusPill status={appt.status} />
              </div>
              {appt.notes && (
                <div className="mt-1 text-sm text-muted-foreground">
                  {appt.notes}
                </div>
              )}
            </div>
            {appt._id && (
              <div className="flex gap-1">
                <EditAppointmentDialog
                  appointment={{
                    id: appt._id.toString(),
                    patientId: appt.patientId.toString(),
                    doctorName: appt.doctorName,
                    specialty: appt.specialty,
                    status: appt.status,
                    notes: appt.notes,
                    appointmentDate: appt.appointmentDate.toString(),
                  }}
                />
                <form
                  action={deleteAppointmentAction.bind(
                    null,
                    appt._id.toString()
                  )}
                >
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Remove appointment with ${appt.doctorName}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

function StatusPill({ status }: { status: AppointmentStatus }) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ml-2"

  const variants: Record<AppointmentStatus, string> = {
    scheduled:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-100 dark:border-sky-800",
    confirmed:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-100 dark:border-emerald-800",
    cancelled:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-100 dark:border-rose-800",
    completed:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/40 dark:text-slate-100 dark:border-slate-800",
  }

  const label = status.charAt(0).toUpperCase() + status.slice(1)

  return <span className={cn(base, variants[status])}>{label}</span>
}
