"use server"

import { revalidatePath } from "next/cache"

import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  AppointmentStatus,
} from "@/lib/models/appointment"

export async function createAppointmentAction(formData: FormData, patientIdForm?: string) {
  const patientId = patientIdForm || formData.get("patientId")?.toString().trim()
  const doctorName = formData.get("doctorName")?.toString().trim()
  const specialty = formData.get("specialty")?.toString().trim()
  const status = (formData.get("status")?.toString().trim() ||
    "scheduled") as AppointmentStatus
  const notes = formData.get("notes")?.toString().trim()
  const dateValue = formData.get("appointmentDate")?.toString()

  if (!patientId || !doctorName || !specialty || !dateValue) {
    throw new Error("Patient, doctor, specialty and date are required.")
  }

  const appointmentDate = new Date(dateValue)

  await createAppointment({
    patientId,
    doctorName,
    specialty,
    appointmentDate,
    status,
    ...(notes ? { notes } : {}),
  } as any)

  revalidatePath("/appointments")
}

export async function deleteAppointmentAction(appointmentId: string) {
  await deleteAppointment(appointmentId)
  revalidatePath("/appointments")
}

export async function updateAppointmentAction(
  appointmentId: string,
  formData: FormData
) {
  const doctorName = formData.get("doctorName")?.toString().trim()
  const specialty = formData.get("specialty")?.toString().trim()
  const status = formData.get("status")?.toString().trim() as
    | AppointmentStatus
    | undefined
  const notes = formData.get("notes")?.toString().trim()
  const dateValue = formData.get("appointmentDate")?.toString()

  const updates: any = {}
  if (doctorName) updates.doctorName = doctorName
  if (specialty) updates.specialty = specialty
  if (status) updates.status = status
  if (notes !== undefined) updates.notes = notes
  if (dateValue) updates.appointmentDate = new Date(dateValue)

  await updateAppointment(appointmentId, updates)
  revalidatePath("/appointments")
}


