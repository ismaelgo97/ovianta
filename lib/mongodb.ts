import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

// Declare the global type properly
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export const DB_NAME = 'Ovianta';
export const PATIENTS_COLLECTION_NAME = 'Patients';
export const APPOINTMENTS_COLLECTION_NAME = 'Appointments';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Use global directly (now type-safe)
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;