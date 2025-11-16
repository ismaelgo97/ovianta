# Ovianta - Healthcare Management Prototype

A healthcare appointment management system built with Next.js, featuring patient management and appointment scheduling capabilities.

## 🚀 Features

### Patient Management
- View all registered patients
- Add new patients with comprehensive information:
  - First name and last name
  - Phone number (primary identifier for voice agent integration)
  - Date of birth
  - Preferred language (e.g. ES/EN, string type)

### Appointment Scheduling
- View all appointments with detailed information:
  - Associated patient
  - Doctor name and specialty
  - Appointment date and time
  - Status tracking (scheduled, confirmed, cancelled, completed)
  - Optional notes for special instructions

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Runtime:** Node.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn package manager
- A MongoDB Atlas account (free tier works perfectly)

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ovianta-prototype.git
cd ovianta-prototype
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure MongoDB Atlas

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0 is sufficient)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from the "Connect" button

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB credentials:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

**Important:** Replace `username` and `password` with your MongoDB Atlas credentials.

### 5. Initialize Database Collections (Optional)

MongoDB will automatically create collections when you add your first patient/appointment. No manual setup required!

### 6. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure
```
ovianta-prototype/
├── app/
│   ├── appointments/
│   │   ├── actions.ts        # Server actions for appointments
│   │   └── page.tsx          # Appointment management page
│   ├── calendar/
│   │   └── page.tsx          # Calendar view (coming soon)
│   ├── patients/
│   │   ├── actions.ts        # Server actions for patients
│   │   └── page.tsx          # Patient management page
│   ├── favicon.ico
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with sidebar
│   └── page.tsx              # Home page
├── components/
│   ├── appointments/
│   │   ├── create-appointment-dialog.tsx
│   │   └── edit-appointment-dialog.tsx
│   ├── patients/
│   │   ├── create-patient-dialog.tsx
│   │   └── edit-patient-dialog.tsx
│   ├── ui/                   # Shadcn UI components
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   └── tooltip.tsx
│   ├── app-sidebar.tsx       # Navigation sidebar
│   ├── search-form.tsx       # Search functionality
│   └── version-switcher.tsx  # Version display
├── hooks/
│   └── use-mobile.ts         # Mobile detection hook
├── lib/
│   ├── models/
│   │   ├── appointment-status.ts  # Appointment status types
│   │   ├── appointment.ts         # Appointment model & operations
│   │   ├── index.ts              # Model exports
│   │   └── patient.ts            # Patient model & operations
│   ├── env.ts                # Environment variable validation
│   ├── mongodb.ts            # MongoDB connection singleton
│   └── utils.ts              # Utility functions
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── .env.example              # Environment variables template
├── .env.local                # Your local environment variables (not in repo)
├── .gitignore
├── components.json           # Shadcn UI configuration
├── next.config.ts
├── package.json
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## 🗄️ Database Schema

### Patients Collection
```typescript
{
  _id: ObjectId,
  phoneNumber: string,
  firstName: string,
  lastName: string,
  dateOfBirth: Date,
  language: string,
  createdAt: Date
}
```

### Appointments Collection
```typescript
{
  _id: ObjectId,
  patientId: string,
  doctorName: string,
  specialty: string,
  appointmentDate: Date,
  status: string,
  notes?: string,
  createdAt: Date,
  updatedAt: Date
}
```