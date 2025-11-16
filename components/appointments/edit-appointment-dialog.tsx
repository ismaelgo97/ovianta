"use client"

import * as React from "react"
import { Pencil } from "lucide-react"

import { updateAppointmentAction } from "@/app/appointments/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { APPOINTMENT_STATUSES } from "@/lib/models/appointment-status"

type EditAppointmentDialogProps = {
  appointment: {
    id: string
    patientId: string
    doctorName: string
    specialty: string
    status: string
    notes?: string
    appointmentDate: string
  }
}

export function EditAppointmentDialog({
  appointment,
}: EditAppointmentDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const formRef = React.useRef<HTMLFormElement>(null)

  const handleSubmit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      try {
        await updateAppointmentAction(appointment.id, formData)
        formRef.current?.reset()
        setOpen(false)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update appointment."
        )
      }
    })
  }

  const dateValue = new Date(appointment.appointmentDate)
    .toISOString()
    .slice(0, 16)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Edit appointment with ${appointment.doctorName}`}
        >
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit appointment</DialogTitle>
          <DialogDescription>
            Update appointment details and save your changes.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctorName">Doctor</Label>
            <Input
              id="doctorName"
              name="doctorName"
              defaultValue={appointment.doctorName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              name="specialty"
              defaultValue={appointment.specialty}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointmentDate">Appointment date</Label>
            <Input
              id="appointmentDate"
              name="appointmentDate"
              type="datetime-local"
              defaultValue={dateValue}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={appointment.status}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {APPOINTMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              defaultValue={appointment.notes}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


