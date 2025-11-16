import { Suspense } from "react"
import Link from "next/link"

import { CreatePatientDialog } from "@/components/patients/create-patient-dialog"
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog"
import { Button } from "@/components/ui/button"
import { deletePatientAction } from "@/app/patients/actions"
import { getAllPatients } from "@/lib/models/patient"
import { getAgeInYears } from "@/lib/utils"
import { CalendarDays, Trash2 } from "lucide-react"

export default function PatientsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Patients</h1>
          <p className="text-muted-foreground">
            Review and manage all registered patients.
          </p>
        </div>
        <CreatePatientDialog />
      </div>
      <Suspense fallback={<PatientsFallback />}>
        <PatientsList />
      </Suspense>
    </div>
  )
}

function PatientsFallback() {
  return (
    <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
      Loading patients…
    </div>
  )
}

async function PatientsList() {
  const patients = await getAllPatients()

  if (patients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        No patients yet. Add one through your data layer or upcoming UI.
      </div>
    )
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {patients.map((patient) => (
        <li
          key={patient._id?.toString() ?? patient.phoneNumber}
          className="rounded-lg border p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-medium flex items-center gap-2">
                <span>
                  {patient.firstName} {patient.lastName}
                </span>
                {patient._id && (
                  <Link
                    href={`/appointments?patient=${patient._id.toString()}`}
                    className="text-muted-foreground hover:text-primary"
                    aria-label={`View appointments for ${patient.firstName} ${patient.lastName}`}
                  >
                    <CalendarDays className="size-4" />
                  </Link>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {patient.phoneNumber}
              </div>
            </div>
            {patient._id && (
              <div className="flex gap-1">
                <EditPatientDialog
                  patient={{
                    id: patient._id.toString(),
                    firstName: patient.firstName,
                    lastName: patient.lastName,
                    phoneNumber: patient.phoneNumber,
                    language: patient.language,
                    dateOfBirth: patient.dateOfBirth?.toString(),
                  }}
                />
                <form
                  action={deletePatientAction.bind(null, patient._id.toString())}
                >
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Remove ${patient.firstName} ${patient.lastName}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            Prefers {patient.language.toUpperCase()}
            {typeof patient.dateOfBirth === "object" && (
              <> • {getAgeInYears(patient.dateOfBirth)} years old</>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

