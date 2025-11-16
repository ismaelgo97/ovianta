import { ObjectId } from "mongodb";
import clientPromise, {
  DB_NAME,
  APPOINTMENTS_COLLECTION_NAME,
} from "@/lib/mongodb";
import {
  type AppointmentStatus,
} from "@/lib/models/appointment-status";

export type { AppointmentStatus };

export interface Appointment {
  _id?: ObjectId;
  // Stored as a string in the database (referencing Patient._id as string)
  patientId: string;
  doctorName: string;
  specialty: string;
  appointmentDate: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentUpdate = Partial<Omit<Appointment, 'createdAt' | 'updatedAt'>>;

async function getAppointmentsCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<Appointment>(APPOINTMENTS_COLLECTION_NAME);
}

function ensureObjectId(id: ObjectId | string) {
  return typeof id === 'string' ? new ObjectId(id) : id;
}

// Functions
export async function getAllAppointments() {
  const collection = await getAppointmentsCollection();
  return collection.find({}).toArray();
}

export async function getAppointmentsByPatientId(patientId: ObjectId | string) {
  const collection = await getAppointmentsCollection();
  const id = typeof patientId === "string" ? patientId : patientId.toString();
  return collection.find({ patientId: id }).toArray();
}

export async function createAppointment(data: Omit<Appointment, '_id' | 'createdAt' | 'updatedAt'>) {
  const collection = await getAppointmentsCollection();
  return collection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updateAppointment(
  appointmentId: ObjectId | string,
  updates: AppointmentUpdate
) {
  const collection = await getAppointmentsCollection();
  return collection.updateOne(
    { _id: ensureObjectId(appointmentId) },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

export async function deleteAppointment(appointmentId: ObjectId | string) {
  const collection = await getAppointmentsCollection();
  return collection.deleteOne({ _id: ensureObjectId(appointmentId) });
}