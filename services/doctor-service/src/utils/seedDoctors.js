import dotenv from "dotenv";
dotenv.config();

import sequelize from "../config/sequelize.js";
import Doctor from "../models/doctorProfile.model.js";
import Availability from "../models/availability.model.js";

const DOCTORS = [
  // ── General Physician ─────────────────────────────────
  {
    fullName: "Dr. Richard James",
    email: "richard.james@mediconnect.com",
    password: "hashed_password",
    phone: "0771234001",
    licenseNumber: "LIC-GP-001",
    speciality: "General physician",
    category: "Consultant",
    experience: 8,
    consultationType: "BOTH",
    fees: 2500,
    image: "https://ui-avatars.com/api/?name=Richard+James&background=5F6FFF&color=fff&size=200&rounded=true",
    bio: "Dr. Richard James is a highly experienced general physician dedicated to comprehensive primary care, preventive medicine and managing chronic conditions.",
    isVerified: true
  },
  {
    fullName: "Dr. Priya Sharma",
    email: "priya.sharma@mediconnect.com",
    password: "hashed_password",
    phone: "0771234002",
    licenseNumber: "LIC-GP-002",
    speciality: "General physician",
    category: "Specialist",
    experience: 5,
    consultationType: "ONLINE",
    fees: 2000,
    image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=5F6FFF&color=fff&size=200&rounded=true",
    bio: "Dr. Priya Sharma focuses on holistic patient care with lifestyle-based treatment plans for acute and chronic illnesses.",
    isVerified: true
  },

  // ── Gynecologist ───────────────────────────────────────
  {
    fullName: "Dr. Emily Larson",
    email: "emily.larson@mediconnect.com",
    password: "hashed_password",
    phone: "0771234003",
    licenseNumber: "LIC-GYN-001",
    speciality: "Gynecologist",
    category: "Consultant",
    experience: 10,
    consultationType: "BOTH",
    fees: 3000,
    image: "https://ui-avatars.com/api/?name=Emily+Larson&background=FF6FA8&color=fff&size=200&rounded=true",
    bio: "Dr. Emily Larson specialises in reproductive health, high-risk pregnancies, and minimally invasive gynecological surgeries.",
    isVerified: true
  },
  {
    fullName: "Dr. Sofia Mendes",
    email: "sofia.mendes@mediconnect.com",
    password: "hashed_password",
    phone: "0771234004",
    licenseNumber: "LIC-GYN-002",
    speciality: "Gynecologist",
    category: "Specialist",
    experience: 7,
    consultationType: "PHYSICAL",
    fees: 2800,
    image: "https://ui-avatars.com/api/?name=Sofia+Mendes&background=FF6FA8&color=fff&size=200&rounded=true",
    bio: "Dr. Sofia Mendes offers personalised care in obstetrics, fertility evaluation, and menstrual health management.",
    isVerified: true
  },

  // ── Dermatologist ─────────────────────────────────────
  {
    fullName: "Dr. Sarah Patel",
    email: "sarah.patel@mediconnect.com",
    password: "hashed_password",
    phone: "0771234005",
    licenseNumber: "LIC-DERM-001",
    speciality: "Dermatologist",
    category: "Specialist",
    experience: 6,
    consultationType: "BOTH",
    fees: 2800,
    image: "https://ui-avatars.com/api/?name=Sarah+Patel&background=FF9F43&color=fff&size=200&rounded=true",
    bio: "Dr. Sarah Patel provides advanced skin care including acne management, eczema therapy, and cosmetic dermatology.",
    isVerified: true
  },
  {
    fullName: "Dr. James Thornton",
    email: "james.thornton@mediconnect.com",
    password: "hashed_password",
    phone: "0771234006",
    licenseNumber: "LIC-DERM-002",
    speciality: "Dermatologist",
    category: "Consultant",
    experience: 9,
    consultationType: "ONLINE",
    fees: 3000,
    image: "https://ui-avatars.com/api/?name=James+Thornton&background=FF9F43&color=fff&size=200&rounded=true",
    bio: "Dr. James Thornton diagnoses and treats complex skin disorders, hair loss conditions, and performs skin cancer screenings.",
    isVerified: true
  },

  // ── Pediatrician ──────────────────────────────────────
  {
    fullName: "Dr. Christopher Lee",
    email: "christopher.lee@mediconnect.com",
    password: "hashed_password",
    phone: "0771234007",
    licenseNumber: "LIC-PED-001",
    speciality: "Pediatrician",
    category: "Consultant",
    experience: 12,
    consultationType: "BOTH",
    fees: 2200,
    image: "https://ui-avatars.com/api/?name=Christopher+Lee&background=1DD1A1&color=fff&size=200&rounded=true",
    bio: "Dr. Christopher Lee focuses on child development, immunizations, and managing common childhood illnesses with a gentle approach.",
    isVerified: true
  },
  {
    fullName: "Dr. Meera Nair",
    email: "meera.nair@mediconnect.com",
    password: "hashed_password",
    phone: "0771234008",
    licenseNumber: "LIC-PED-002",
    speciality: "Pediatrician",
    category: "Specialist",
    experience: 4,
    consultationType: "ONLINE",
    fees: 1800,
    image: "https://ui-avatars.com/api/?name=Meera+Nair&background=1DD1A1&color=fff&size=200&rounded=true",
    bio: "Dr. Meera Nair specialises in neonatal care, nutritional assessments, and behavioural pediatrics.",
    isVerified: true
  },

  // ── Neurologist ───────────────────────────────────────
  {
    fullName: "Dr. Jennifer Garcia",
    email: "jennifer.garcia@mediconnect.com",
    password: "hashed_password",
    phone: "0771234009",
    licenseNumber: "LIC-NEURO-001",
    speciality: "Neurologist",
    category: "Consultant",
    experience: 14,
    consultationType: "BOTH",
    fees: 3500,
    image: "https://ui-avatars.com/api/?name=Jennifer+Garcia&background=9B59B6&color=fff&size=200&rounded=true",
    bio: "Dr. Jennifer Garcia specialises in epilepsy, migraine management, stroke prevention, and neurodegenerative diseases.",
    isVerified: true
  },
  {
    fullName: "Dr. Alan Brooks",
    email: "alan.brooks@mediconnect.com",
    password: "hashed_password",
    phone: "0771234010",
    licenseNumber: "LIC-NEURO-002",
    speciality: "Neurologist",
    category: "Consultant",
    experience: 11,
    consultationType: "PHYSICAL",
    fees: 4000,
    image: "https://ui-avatars.com/api/?name=Alan+Brooks&background=9B59B6&color=fff&size=200&rounded=true",
    bio: "Dr. Alan Brooks treats multiple sclerosis, Parkinson's disease, and complex movement disorders.",
    isVerified: true
  },

  // ── Gastroenterologist ────────────────────────────────
  {
    fullName: "Dr. Marcus Webb",
    email: "marcus.webb@mediconnect.com",
    password: "hashed_password",
    phone: "0771234011",
    licenseNumber: "LIC-GASTRO-001",
    speciality: "Gastroenterologist",
    category: "Consultant",
    experience: 9,
    consultationType: "BOTH",
    fees: 3200,
    image: "https://ui-avatars.com/api/?name=Marcus+Webb&background=E74C3C&color=fff&size=200&rounded=true",
    bio: "Dr. Marcus Webb is an expert in endoscopic procedures, IBD, GERD, liver diseases, and colorectal conditions.",
    isVerified: true
  },
  {
    fullName: "Dr. Anjali Verma",
    email: "anjali.verma@mediconnect.com",
    password: "hashed_password",
    phone: "0771234012",
    licenseNumber: "LIC-GASTRO-002",
    speciality: "Gastroenterologist",
    category: "Specialist",
    experience: 6,
    consultationType: "ONLINE",
    fees: 2800,
    image: "https://ui-avatars.com/api/?name=Anjali+Verma&background=E74C3C&color=fff&size=200&rounded=true",
    bio: "Dr. Anjali Verma provides care for IBS, hepatitis management, and nutritional disorders.",
    isVerified: true
  }
];

// Mon–Sat availability for the next 30 days (09:00–17:00)
function buildAvailability(doctorId) {
  const slots = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue; // skip Sunday
    slots.push({
      doctorId,
      date: d.toISOString().split("T")[0],
      startTime: "09:00:00",
      endTime: "17:00:00"
    });
  }
  return slots;
}

async function seed() {
  try {
    await sequelize.sync({ alter: true });
    console.log("DB synced");

    for (const data of DOCTORS) {
      const [doc] = await Doctor.findOrCreate({
        where: { email: data.email },
        defaults: data
      });
      // Clear future availability and re-seed for this doctor
      await Availability.destroy({ where: { doctorId: doc.id } });
      await Availability.bulkCreate(buildAvailability(doc.id));
      console.log(`Seeded: ${doc.fullName}`);
    }

    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
