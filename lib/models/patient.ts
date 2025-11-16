// lib/models/patient.ts
import { ObjectId } from "mongodb";
import clientPromise, {DB_NAME, PATIENTS_COLLECTION_NAME } from "@/lib/mongodb";

// Types
export interface Patient {
  _id?: ObjectId;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  language: string;  // "es", "en", etc.
  createdAt: Date;
  updatedAt: Date;
}

export type PatientUpdate = Partial<Omit<Patient, 'createdAt' | 'updatedAt'>>;

async function getPatientsCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<Patient>(PATIENTS_COLLECTION_NAME);
}

function ensureObjectId(id: ObjectId | string) {
  return typeof id === 'string' ? new ObjectId(id) : id;
}

// Functions
export async function getAllPatients() {
  const collection = await getPatientsCollection();
  return collection.find({}).toArray();
}

export async function getPatientById(id: ObjectId | string) {
  const collection = await getPatientsCollection();
  return collection.findOne({ _id: ensureObjectId(id) });
}

export async function getPatientByPhone(phoneNumber: string) {
  const collection = await getPatientsCollection();
  return collection.findOne({ phoneNumber });
}

export async function createPatient(data: Omit<Patient, '_id' | 'createdAt' | 'updatedAt'>) {
  const collection = await getPatientsCollection();
  return collection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export async function updatePatient(id: ObjectId | string, data: PatientUpdate) {
  const collection = await getPatientsCollection();
  return collection.updateOne(
    { _id: ensureObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  );
}

export async function deletePatient(id: ObjectId | string) {
  const collection = await getPatientsCollection();
  return collection.deleteOne({ _id: ensureObjectId(id) });
}