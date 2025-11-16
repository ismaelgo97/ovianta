"use server"

import { revalidatePath } from "next/cache"

import {
  createPatient,
  deletePatient,
  updatePatient,
} from "@/lib/models/patient"

export async function createPatientAction(formData: FormData) {
  const firstName = formData.get("firstName")?.toString().trim()
  const lastName = formData.get("lastName")?.toString().trim()
  const phoneNumber = formData.get("phoneNumber")?.toString().trim()
  const language = formData.get("language")?.toString().trim() || "en"
  const dobValue = formData.get("dateOfBirth")?.toString()

  if (!firstName || !lastName || !phoneNumber) {
    throw new Error("First name, last name, and phone number are required.")
  }

  const dateOfBirth = dobValue ? new Date(dobValue) : new Date()

  await createPatient({
    firstName,
    lastName,
    phoneNumber,
    language,
    dateOfBirth,
  })

  revalidatePath("/patients")
}

export async function deletePatientAction(patientId: string) {
  if (!patientId) {
    throw new Error("Patient id is required.")
  }

  await deletePatient(patientId)
  revalidatePath("/patients")
}

export async function updatePatientAction(
  patientId: string,
  formData: FormData
) {
  if (!patientId) {
    throw new Error("Patient id is required.")
  }

  const firstName = formData.get("firstName")?.toString().trim()
  const lastName = formData.get("lastName")?.toString().trim()
  const phoneNumber = formData.get("phoneNumber")?.toString().trim()
  const language = formData.get("language")?.toString().trim()
  const dobValue = formData.get("dateOfBirth")?.toString()

  if (!firstName || !lastName || !phoneNumber) {
    throw new Error("First name, last name, and phone number are required.")
  }

  const dateOfBirth = dobValue ? new Date(dobValue) : undefined

  await updatePatient(patientId, {
    firstName,
    lastName,
    phoneNumber,
    language,
    ...(dateOfBirth ? { dateOfBirth } : {}),
  })

  revalidatePath("/patients")
}

