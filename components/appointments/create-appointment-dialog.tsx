"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { createAppointmentAction } from "@/app/appointments/actions"
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

type CreateAppointmentDialogProps = {
  patientId?: string
  patientName?: string
}

export function CreateAppointmentDialog({
  patientId,
  patientName,
}: CreateAppointmentDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const formRef = React.useRef<HTMLFormElement>(null)

  const handleSubmit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      try {
        await createAppointmentAction(formData, patientId)
        formRef.current?.reset()
        setOpen(false)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create appointment."
        )
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="rounded-full cursor-pointer"
          size="lg"
          variant="outline"
        >
          <Plus className="mr-2 size-4" />
          New appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new appointment</DialogTitle>
          <DialogDescription>
            Provide the appointment details to schedule a visit.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient</Label>
            {patientId && patientName ? (
              <>
                <Input
                  id="patientDisplay"
                  value={patientName}
                  disabled
                  readOnly
                />
                <input type="hidden" name="patientId" value={patientId} />
              </>
            ) : (
              <Input
                id="patientId"
                name="patientId"
                placeholder="Enter patient id"
                required
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="doctorName">Doctor</Label>
            <Input id="doctorName" name="doctorName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input id="specialty" name="specialty" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointmentDate">Appointment date</Label>
            <Input
              id="appointmentDate"
              name="appointmentDate"
              type="datetime-local"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue="scheduled"
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
            <Input id="notes" name="notes" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


