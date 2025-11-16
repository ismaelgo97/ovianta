import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAgeInYears(dateOfBirth: Date): number {
  const now = new Date()
  let age = now.getFullYear() - dateOfBirth.getFullYear()
  const m = now.getMonth() - dateOfBirth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < dateOfBirth.getDate())) {
    age--
  }
  return age
}
