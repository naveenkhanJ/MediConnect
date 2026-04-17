# MediConnect — Technical Report

---

## Table of Contents

1. [High-Level Architectural Diagram](#1-high-level-architectural-diagram)
2. [Service Interfaces](#2-service-interfaces)
3. [System Workflows](#3-system-workflows)
4. [Authentication and Security Mechanisms](#4-authentication-and-security-mechanisms)
5. [Individual Contributions](#5-individual-contributions)
6. [Appendix — Source Code](#6-appendix--source-code)

---

## 1. High-Level Architectural Diagram

MediConnect is a microservices-based telemedicine platform. All client requests enter through a single API Gateway, which proxies them to the appropriate downstream service. Each service owns its own database and communicates with other services via HTTP (synchronous) or RabbitMQ (asynchronous, optional).

```
                            +----------------------------------+
                            |        CLIENT (Browser)          |
                            |    Next.js Frontend :3000        |
                            +----------------+-----------------+
                                             |  HTTP/REST
                                             v
                            +----------------------------------+
                            |         API GATEWAY              |
                            |         Express :4000            |
                            |   (single entry-point, routes    |
                            |    and forwards all requests)    |
                            +--+------+------+------+------+---+
                               |      |      |      |      |
              +----------------+      |      |      |      +---------------------+
              |                       |      |      |                            |
              v                       v      v      v                            v
  +--------------------+  +-----------+  +-----------+  +------------------------+
  |   AUTH SERVICE     |  |  PATIENT  |  |  DOCTOR   |  |  APPOINTMENT SERVICE   |
  |   Express :5000    |  |  SERVICE  |  |  SERVICE  |  |  Express :5003         |
  |                    |  |  :5002    |  |  :5009    |  |                        |
  |  - Register        |  |           |  |           |  |  - Book                |
  |  - Login           |  | -Profiles |  | -Profiles |  |  - Reschedule          |
  |  - Admin mgmt      |  | -Reports  |  | -Avail.   |  |  - Cancel              |
  +--------+-----------+  +-----+-----+  +-----+-----+  |  - Decision            |
           |                    |               |        +----------+-------------+
           | PostgreSQL         | PostgreSQL    | PostgreSQL        | PostgreSQL
           | auth_db            | patient_db    | doctor_db         | appointment_db
           v                    v               v                   |
      +---------+         +---------+      +---------+             |
      | auth DB |         |patient  |      | doctor  |             |
      +---------+         |   DB    |      |   DB    |             v
                          +---------+      +---------+  +---------------------+
                                                        | PAYMENT SERVICE     |
                                                        | Express :5004       |
              +-------------------------------------------+                  |
              |                                          |  - PayHere         |
              |                         +----------------+  - Webhook notify  |
              |                         |                +--------+-----------+
              v                         v                         | PostgreSQL
  +----------------------+  +---------------------+              | payment_db
  | TELEMEDICINE SERVICE |  | NOTIFICATION SERVICE|              v
  | Express :5005        |  | Express :5006       |         +---------+
  |                      |  |                     |         | payment |
  | - Jitsi sessions     |  | - Email(Nodemailer) |         |   DB    |
  | - Start/End/Join     |  | - SMS/WA (Twilio)   |         +---------+
  | - Admin verification |  | - Notification logs |
  +-----------+----------+  +----------+----------+
              | MySQL                   | PostgreSQL
              | telemedicine_db         | notification_db
              v                         v
         +----------+           +---------------+
         |  tele DB |           | notification  |
         +----------+           |     DB        |
                                +---------------+

  +----------------------------------+
  |   AI SYMPTOM CHECKER SERVICE     |
  |   Express :5007                  |
  |  - Google Gemini AI API          |
  |  - Symptom analysis              |
  +----------------------------------+

  ──── Service-to-Service HTTP calls ────
  Auth         --> Patient Service   POST /api/patients/register
  Auth         --> Doctor Service    POST /api/profile/register
  Appointment  --> Doctor Service    GET  /api/doctors/:id
  Appointment  --> Payment Service   POST /api/payments/create
  Appointment  --> Patient Service   GET  /api/patients/internal/:id
  Appointment  --> Notification Svc  POST /api/v1/notifications/...
  Appointment  --> Telemedicine Svc  POST /api/v1/sessions/internal
  Payment      --> Appointment Svc   PUT  /api/appointments/:id/confirm-payment
  Telemedicine --> Notification Svc  POST /notifications/appointment-booked
  Telemedicine --> Appointment Svc   GET  /api/appointments/:id
```

---

## 2. Service Interfaces

The following lists every HTTP endpoint exposed by each service. These are the **service-level interfaces** — not user interfaces.

---

### 2.1 API Gateway — Port 4000

The gateway is the sole public interface; all client requests pass through it.

| Method | Path | Downstream Service |
|--------|------|--------------------|
| POST | `/auth/login` | auth-service |
| POST | `/auth/register` | auth-service |
| GET | `/patients/me` | patient-service |
| GET | `/patients/:id` | patient-service |
| PUT | `/patients/:id` | patient-service |
| DELETE | `/patients/:id` | patient-service |
| POST | `/patients/reports` | patient-service |
| GET | `/api/appointments/doctors/search?specialty=` | appointment-service |
| GET | `/api/appointments/my/list` | appointment-service |
| POST | `/api/appointments` | appointment-service |
| GET | `/api/appointments/:id` | appointment-service |
| GET | `/api/appointments/:id/status` | appointment-service |
| PUT | `/api/appointments/:id/reschedule` | appointment-service |
| PUT | `/api/appointments/:id/cancel` | appointment-service |
| GET | `/api/appointments/doctor/:doctorId/today` | appointment-service |
| GET | `/api/appointments/doctor/:doctorId/pending` | appointment-service |
| PATCH | `/api/appointments/:id/decision` | appointment-service |
| POST | `/api/payments/create` | payment-service |
| GET | `/api/payments/appointment/:appointmentId` | payment-service |
| GET | `/api/payments/payhere-params/:paymentId` | payment-service |
| POST | `/api/payments/payhere-notify` | payment-service (webhook) |
| PUT | `/api/payments/:id/success` | payment-service |
| PUT | `/api/payments/:id/fail` | payment-service |
| GET | `/api/doctors` | doctor-service |
| GET | `/api/doctors/:id` | doctor-service |
| GET | `/api/doctors/:id/availability` | doctor-service |
| POST | `/api/profile` | doctor-service |
| GET | `/api/profile/me` | doctor-service |
| PUT | `/api/profile/me` | doctor-service |
| GET | `/api/availability` | doctor-service |
| POST | `/api/availability` | doctor-service |
| PUT | `/api/availability/:id` | doctor-service |
| DELETE | `/api/availability/:id` | doctor-service |
| GET | `/api/doctor/appointments/today` | doctor-service |
| GET | `/api/doctor/appointments/pending` | doctor-service |
| PATCH | `/api/doctor/appointments/:appointmentId/decision` | doctor-service |
| GET | `/api/dashboard/summary` | doctor-service |
| POST | `/api/prescriptions` | doctor-service |
| GET | `/api/prescriptions` | doctor-service |
| GET | `/api/prescriptions/patient/:patientId` | doctor-service |
| GET | `/api/prescriptions/:id/pdf` | doctor-service |
| GET | `/api/doctors/patients/:patientId/reports` | patient-service |
| POST | `/api/telemedicine` | telemedicine-service |
| POST | `/api/telemedicine/:id/join` | telemedicine-service |
| PATCH | `/api/telemedicine/:id/start` | telemedicine-service |
| PATCH | `/api/telemedicine/:id/end` | telemedicine-service |
| GET | `/api/telemedicine/appointment/:appointmentId` | telemedicine-service |
| POST | `/api/symptoms/check` | symptom-checker-service |
| GET | `/api/admin/doctors` | auth-service |
| PATCH | `/api/admin/doctors/:id/verify` | auth-service |
| PATCH | `/api/admin/doctors/:id/reject` | auth-service |
| GET | `/api/admin/patients` | auth-service |

---

### 2.2 Auth Service — Port 5000

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/auth/register` | None | Register patient, doctor, or admin |
| POST | `/api/auth/login` | None | Login; returns JWT token |
| GET | `/api/admin/doctors` | Admin JWT | List all doctors |
| PATCH | `/api/admin/doctors/:id/verify` | Admin JWT | Approve a doctor account |
| PATCH | `/api/admin/doctors/:id/reject` | Admin JWT | Reject a doctor account |
| GET | `/api/admin/patients` | Admin JWT | List all patients |

---

### 2.3 Patient Service — Port 5002

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/patients/register` | None (internal) | Create patient profile |
| GET | `/api/patients/me` | Patient JWT | Get own profile |
| GET | `/api/patients/:id` | JWT | Get patient by ID |
| PUT | `/api/patients/:id` | Patient JWT | Update patient profile |
| DELETE | `/api/patients/:id` | Patient JWT | Delete account |
| POST | `/api/patients/reports` | None | Upload medical report |
| GET | `/api/patients/reports` | JWT | Get patient reports |
| GET | `/api/patients/internal/all` | Internal Secret | List all patients (internal) |
| GET | `/api/patients/internal/:id` | Internal Secret | Get patient contact info (internal) |
| GET | `/api/reports/patients/:patientId` | JWT | Get reports for a patient |

---

### 2.4 Appointment Service — Port 5003

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/appointments/doctors/search?specialty=` | None | Search doctors by specialty |
| POST | `/api/appointments` | Patient JWT | Book appointment |
| POST | `/api/appointments/internal` | None (internal) | Book appointment (no-auth path) |
| GET | `/api/appointments/my/list` | Patient ID header | Patient's appointments |
| GET | `/api/appointments/:id` | JWT | Get single appointment |
| GET | `/api/appointments/:id/status` | None | Get appointment status |
| PUT | `/api/appointments/:id/reschedule` | None | Reschedule |
| PUT | `/api/appointments/:id/cancel` | None | Cancel |
| PUT | `/api/appointments/:id/confirm-payment` | None (internal) | Confirm payment |
| GET | `/api/appointments/doctor/:id/today` | JWT | Doctor's today's appointments |
| GET | `/api/appointments/doctor/:id/pending` | JWT | Doctor's pending appointments |
| PATCH | `/api/appointments/:id/decision` | JWT | Doctor accept/reject |

---

### 2.5 Payment Service — Port 5004

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/payments/create` | None (internal) | Create payment record |
| GET | `/api/payments/:id` | None | Get payment by ID |
| GET | `/api/payments/appointment/:appointmentId` | None | Get payment by appointment |
| GET | `/api/payments/payhere-params/:paymentId` | None | PayHere form params + MD5 hash |
| POST | `/api/payments/payhere-notify` | None (PayHere webhook) | Receive payment callback |
| PUT | `/api/payments/:id/success` | None | Mark payment successful |
| PUT | `/api/payments/:id/fail` | None | Mark payment failed |

---

### 2.6 Doctor Service — Port 5009

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/profile/register` | None (internal) | Create doctor profile |
| GET | `/api/doctors` | None | List all doctors (public) |
| GET | `/api/doctors/:id` | None | Get doctor details (public) |
| GET | `/api/doctors/:id/availability` | None | Get availability (public) |
| GET | `/api/profile/me` | Doctor JWT | Get own profile |
| PUT | `/api/profile/me` | Doctor JWT | Update own profile |
| GET | `/api/availability` | Doctor JWT | Get own availability slots |
| POST | `/api/availability` | Doctor JWT | Add availability slot |
| PUT | `/api/availability/:id` | Doctor JWT | Update availability slot |
| DELETE | `/api/availability/:id` | Doctor JWT | Delete availability slot |
| GET | `/api/doctor/appointments/today` | Doctor JWT | Today's appointments |
| GET | `/api/doctor/appointments/pending` | Doctor JWT | Pending appointments |
| PATCH | `/api/doctor/appointments/:id/decision` | Doctor JWT | Accept/reject appointment |
| GET | `/api/dashboard/summary` | Doctor JWT | Dashboard statistics |
| POST | `/api/prescriptions` | Doctor JWT | Issue a prescription |
| GET | `/api/prescriptions` | Doctor JWT | Get own prescriptions |
| GET | `/api/prescriptions/patient/:id` | JWT | Get patient's prescriptions |
| GET | `/api/prescriptions/:id/pdf` | JWT | Download prescription PDF |
| GET | `/internal/doctors/:id` | Internal Secret | Get doctor (internal) |
| GET | `/internal/doctors` | Internal Secret | List all doctors (internal) |
| PATCH | `/internal/doctors/:id/verify` | Internal Secret | Verify doctor (internal) |

---

### 2.7 Notification Service — Port 5006

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/v1/notifications/appointment-booked` | None (internal) | Notify on appointment booking |
| POST | `/api/v1/notifications/consultation-completed` | None (internal) | Notify on consultation end |
| GET | `/api/v1/admin` | None | Admin notification log viewer |

---

### 2.8 Telemedicine Service — Port 5005

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/telemedicine` | X-User-Id / X-User-Role headers | Create session |
| GET | `/api/telemedicine/:id` | X-User headers | Get session by ID |
| POST | `/api/telemedicine/:id/join` | X-User headers | Join session (returns meeting link) |
| PATCH | `/api/telemedicine/:id/start` | X-User headers | Start session |
| PATCH | `/api/telemedicine/:id/end` | X-User headers | End session |
| DELETE | `/api/telemedicine/:id` | X-User headers | Cancel session |
| GET | `/api/telemedicine/appointment/:appointmentId` | X-User headers | Get session by appointment |
| POST | `/api/v1/sessions/internal` | None (internal) | Create session from appointment-service |
| GET | `/api/v1/admin` | None | Admin panel |

---

### 2.9 Symptom Checker Service — Port 5007

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/symptoms/check` | Optional JWT | Analyse symptoms with Google Gemini AI |

---

## 3. System Workflows

### 3.1 User Registration Workflow

```
Patient/Doctor               Auth Service             Patient/Doctor Service
     |                            |                            |
     |-- POST /auth/register ---->|                            |
     |   { email, password,       |                            |
     |     role, ...profile }     |                            |
     |                            | 1. Validate input          |
     |                            | 2. Hash password (bcrypt)  |
     |                            | 3. Insert into users table |
     |                            | 4. Generate JWT token      |
     |                            |                            |
     |                            |-- POST /patients/register ->|  (role=patient)
     |                            |  OR                        |
     |                            |-- POST /profile/register -->|  (role=doctor)
     |                            |                            |
     |                            |<-- 201 Created ------------|
     |                            |                            |
     |<-- 201 { user, token } ---|   (on profile failure:     |
     |                            |    DELETE user = rollback) |
```

Key behaviours:
- Passwords hashed with **bcrypt** (cost factor 10) before storage.
- Doctors are created with `is_approved = false`; they cannot log in until an admin approves their account.
- Patients are approved immediately.
- If downstream profile creation fails, the auth record is **rolled back** to prevent orphaned users.

---

### 3.2 Login Workflow

```
Client                   Auth Service                    JWT
  |                           |                            |
  |-- POST /auth/login ------>|                            |
  |   { email, password }     |                            |
  |                           | 1. findUserByEmail()       |
  |                           | 2. bcrypt.compare()        |
  |                           | 3. Check is_approved flag  |
  |                           | 4. generateToken() ------->|
  |                           |                            | sign({ id, role, email },
  |                           |<------ JWT token ----------| JWT_SECRET, {expiresIn:"1d"})
  |<-- 200 { token, user } --|                            |
  |                           |                            |
  | [Store in localStorage]   |                            |
```

---

### 3.3 Appointment Booking Workflow

This is the most complex workflow, coordinating four services.

```
Patient (Frontend)     API Gateway    Appointment Svc  Doctor Svc  Payment Svc
      |                    |                |               |            |
      |-- POST /appts ---->|-- Forward ---->|               |            |
      |   { doctorId,      |               | 1.getDoctorById()--------->|
      |     date, slot }   |               |<-- doctor data ------------|
      |                    |               |                             |
      |                    |               | 2. Check slot conflict      |
      |                    |               | 3. createAppointment()      |
      |                    |               |    status=PENDING_PAYMENT   |
      |                    |               |                             |
      |                    |               |-- POST /payments/create --->|
      |                    |               |<-- payment record ----------|
      |                    |               | 4. Link paymentId to appt   |
      |<-- 201 { appt, payment } ---------|                             |
      |                    |               |                             |
      |-- GET /payhere-params/:paymentId -------------------------------->
      |<-- { merchant_id, amount, hash, ... } --------------------------->
      |                    |               |                             |
      |  [Redirect to PayHere checkout page]                            |
      |                    |               |                             |
                        PayHere
                           |-- POST /api/payments/payhere-notify -----> Payment Svc
                               { order_id, status_code, md5sig }
                                                            Verify MD5 signature
                                                            markPaymentSuccess()
                                                                   |
                                                            PUT /appointments/:id/confirm-payment
                                                                   |
                                                            Appointment Svc
                                                            status = CONFIRMED
```

---

### 3.4 Doctor Accept/Reject Appointment Workflow

After payment confirms an appointment, the doctor reviews and accepts or rejects it.

```
Doctor (Frontend)  API Gateway   Doctor Service  Appointment Svc  Telemedicine  Notification
      |                |               |               |               |              |
      |-- PATCH        |               |               |               |              |
      |  /decision --->|-- Forward --->|               |               |              |
      |  { status:     |               | authMiddleware|               |              |
      |  "ACCEPTED" }  |               | (JWT, doctor) |               |              |
      |                |               |               |               |              |
      |                |               |-- PATCH /decision ----------->|               |
      |                |               |               | Validate owner|               |
      |                |               |               | docStatus check               |
      |                |               |               | Update docStatus              |
      |                |               |               |               |              |
      |                |               |               | if ACCEPTED   |              |
      |                |               |               | + type=ONLINE:|              |
      |                |               |               |-- POST /sessions/internal --->|
      |                |               |               |               | createJitsi  |
      |                |               |               |               |-- POST /notif---->
      |                |               |               |               |              | Email+SMS
      |<-- 200 { appointment } --------|               |               |              |
```

---

### 3.5 Video Consultation Workflow

```
Doctor                Frontend              Telemedicine Svc         Jitsi Meet
  |                      |                        |                       |
  |-- Open video page -->|                        |                       |
  |                      |-- GET /telemedicine/   |                       |
  |                      |   appointment/:id ---->|                       |
  |                      |<-- { meetingLink,      |                       |
  |                      |     jitsiJwt, status } |                       |
  |                      |                        |                       |
  |                      |-- PATCH /start ------->|                       |
  |                      |                        | status = ACTIVE       |
  |                      |                        | startedAt = now()     |
  |                      |<-- 200 OK -------------|                       |
  |                      |                        |                       |
  |<-- Redirect to Jitsi meetingLink (meet.jit.si/mc-{uuid}) ----------->|
  Patient also joins via same meetingLink                                 |
  |                                                                       |
  |-- Call ends -->|                        |                             |
  |                |-- PATCH /end --------->|                             |
  |                |                        | status = COMPLETED         |
  |                |                        | endedAt = now()            |
  |                |                        |-- POST /consultation-completed --> Notification Svc
  |                |                        |                                    (Email + SMS)
```

---

### 3.6 Notification Dispatch Workflow

```
Triggering Service              Notification Service         Twilio / Gmail
(Appointment or Telemedicine)          |                          |
        |                              |                          |
        |-- POST /appointment-booked ->|                          |
        |   { appointmentId,           | 1. Validate payload     |
        |     patientEmail,            |                          |
        |     patientPhone,            | 2. If patientEmail:     |
        |     meetingLink }            |    sendEmail() -------->| Gmail SMTP
        |                              |                          |
        |                              | 3. If patientPhone:     |
        |                              |    sendWhatsapp() ----->| Twilio WhatsApp
        |                              |    (fallback: sendSms())|
        |                              |                          |
        |                              | 4. persistLog()         |
        |                              |    (notification_db)    |
        |<-- 200 { success, result } --|                          |
```

---

### 3.7 Admin Doctor Approval Workflow

```
Admin (Frontend)     API Gateway        Auth Service         Outcome
      |                   |                  |                  |
      |-- GET             |                  |                  |
      |  /admin/doctors ->|---------------->|                  |
      |                   | adminMiddleware  |                  |
      |                   | (JWT, role=admin)|                  |
      |<-- [doctor list] -|<----------------|                  |
      |                   |                  |                  |
      |-- PATCH /admin/   |                  |                  |
      |  doctors/:id/     |                  |                  |
      |  verify --------->|---------------->|                  |
      |                   |                  | UPDATE users     |
      |                   |                  | SET is_approved  |
      |                   |                  | = true           |
      |<-- 200 OK --------|<----------------|                  |
      |                   |                  | (doctor can now  |
      |                   |                  |  log in)         |
```

---

## 4. Authentication and Security Mechanisms

### 4.1 JSON Web Tokens (JWT)

All user authentication is token-based using signed JWTs.

**Token Generation** (`services/auth-service/src/utils/jwt.js`):

```javascript
export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
```

- Tokens are signed with `JWT_SECRET` (environment variable) and expire after **24 hours**.
- The payload carries `id`, `role`, and `email` — sufficient for downstream services to authorise requests without a database round-trip.

**Token Storage and Usage (Frontend):**

```javascript
// After login
localStorage.setItem('token', response.token);

// Sent with every authenticated request
headers: { Authorization: `Bearer ${token}` }
```

---

### 4.2 Role-Based Access Control (RBAC)

Three roles exist: `patient`, `doctor`, and `admin`. Each service enforces its own role guard.

**Admin Middleware** (`services/auth-service/src/middlewares/adminMiddleware.js`):

```javascript
export const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admin access only." });
  }
  req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
  next();
};
```

**Doctor Middleware** (`services/doctor-service/src/middlewares/authMiddleware.js`):

```javascript
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== "doctor") {
    return res.status(403).json({ message: "Forbidden. Doctor access only." });
  }
  req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
  next();
};
```

The patient service follows the same pattern enforcing `role === "patient"`.

---

### 4.3 Internal Service-to-Service Authentication

Service calls that bypass the gateway use a shared internal secret transmitted as a request header:

```javascript
// Caller (appointment-service):
headers: { "x-internal-secret": process.env.INTERNAL_SECRET }

// Receiver (patient-service, doctor-service):
if (req.headers["x-internal-secret"] !== process.env.INTERNAL_SECRET) {
  return res.status(403).json({ message: "Forbidden" });
}
```

This prevents external actors from directly calling internal-only endpoints such as `/api/patients/internal/:id`.

---

### 4.4 Password Security

Passwords are never stored in plaintext. On registration:

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

On login:

```javascript
const isMatch = await bcrypt.compare(password, user.password);
```

`bcrypt` with a cost factor of 10 makes offline brute-force attacks computationally expensive.

---

### 4.5 PayHere Payment Signature Verification

To prevent spoofed webhook callbacks, the payment service independently recomputes the MD5 signature and rejects any non-matching request:

```javascript
const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
const expectedSig = crypto
  .createHash("md5")
  .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
  .digest("hex")
  .toUpperCase();

if (md5sig !== expectedSig) {
  return res.status(400).send("Invalid signature");
}
```

The merchant secret is never exposed to the browser; the gateway serves only the pre-computed hash.

---

### 4.6 Doctor Account Approval Gate

Doctors cannot log in until an admin explicitly approves their account:

```javascript
// During registration:
const isApproved = role !== "doctor";  // false for doctors

// During login:
if (!user.is_approved) {
  throw new Error("Your account is pending admin approval.");
}
```

This prevents unverified practitioners from accessing patient data or accepting appointments.

---

### 4.7 Telemedicine Session Security

Jitsi sessions use a UUID-based room ID generated with `crypto.randomUUID()`. An optional Jitsi JWT is signed with `JITSI_APP_SECRET` and carries a 24-hour expiry:

```javascript
const token = jwt.sign(
  {
    context: { user: { id, email, name } },
    aud: "jitsi",
    iss: env.jitsiAppId,
    sub: env.jitsiBaseUrl,
    room: roomId,
    exp: now + 86400
  },
  env.jitsiAppSecret
);
```

Room IDs are prefixed `mc-` followed by a UUID (e.g. `mc-550e8400-e29b-41d4-a716-446655440000`), making them unguessable.

---

## 5. Individual Contributions

> Fill in each member's name and their specific contributions below.

| Member | Role / Contributions |
|--------|----------------------|
| Member 1 — [Name] | |
| Member 2 — [Name] | |
| Member 3 — [Name] | |
| Member 4 — [Name] | |
| Member 5 — [Name] | |

---

## 6. Appendix — Source Code

All custom-written source files are included below. Auto-generated files (package.json, Sequelize model boilerplate, etc.) are excluded.

---

### A1. `services/api-gateway/index.js`

```javascript
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const AUTH_SERVICE        = process.env.AUTH_SERVICE_URL        || 'http://localhost:5000';
const PATIENT_SERVICE     = process.env.PATIENT_SERVICE_URL     || 'http://localhost:5002';
const APPOINTMENT_SERVICE = process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:5003';
const PAYMENT_SERVICE     = process.env.PAYMENT_SERVICE_URL     || 'http://localhost:5004';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE}/api/auth/login`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE}/api/auth/register`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

app.get('/patients/me', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE}/api/patients/me`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: 'Server Error' });
  }
});

app.get('/patients/:id', async (req, res) => {
  try {
    const response = await axios.get(`${PATIENT_SERVICE}/api/patients/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put('/patients/:id', async (req, res) => {
  try {
    const response = await axios.put(
      `${PATIENT_SERVICE}/api/patients/${req.params.id}`, req.body,
      { headers: { Authorization: req.headers.authorization } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.delete('/patients/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${PATIENT_SERVICE}/api/patients/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post('/patients/reports', async (req, res) => {
  try {
    const response = await axios.post(`${PATIENT_SERVICE}/api/patients/reports`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/appointments/doctors/search', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE}/api/appointments/doctors/search`,
      { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/appointments/my/list', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE}/api/appointments/my/list`, {
      headers: { Authorization: req.headers.authorization, 'x-patient-id': req.headers['x-patient-id'] }
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/appointments/:id/status', async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}/status`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE}/api/appointments/internal`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put('/api/appointments/:id/reschedule', async (req, res) => {
  try {
    const response = await axios.put(
      `${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}/reschedule`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put('/api/appointments/:id/cancel', async (req, res) => {
  try {
    const response = await axios.put(
      `${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}/cancel`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/appointments/doctor/:doctorId/today', async (req, res) => {
  try {
    const response = await axios.get(
      `${APPOINTMENT_SERVICE}/api/appointments/doctor/${req.params.doctorId}/today`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/appointments/doctor/:doctorId/pending', async (req, res) => {
  try {
    const response = await axios.get(
      `${APPOINTMENT_SERVICE}/api/appointments/doctor/${req.params.doctorId}/pending`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.patch('/api/appointments/:id/decision', async (req, res) => {
  try {
    const response = await axios.patch(
      `${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}/decision`, req.body,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/appointments/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${APPOINTMENT_SERVICE}/api/appointments/${req.params.id}`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/payments/payhere-params/:paymentId', async (req, res) => {
  try {
    const response = await axios.get(
      `${PAYMENT_SERVICE}/api/payments/payhere-params/${req.params.paymentId}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get('/api/payments/appointment/:appointmentId', async (req, res) => {
  try {
    const response = await axios.get(
      `${PAYMENT_SERVICE}/api/payments/appointment/${req.params.appointmentId}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post('/api/payments/payhere-notify', async (req, res) => {
  try {
    const params = new URLSearchParams(req.body).toString();
    const response = await axios.post(`${PAYMENT_SERVICE}/api/payments/payhere-notify`, params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.response?.data || "Error");
  }
});

app.post('/api/payments/create', async (req, res) => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE}/api/payments/create`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put('/api/payments/:id/success', async (req, res) => {
  try {
    const response = await axios.put(`${PAYMENT_SERVICE}/api/payments/${req.params.id}/success`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put('/api/payments/:id/fail', async (req, res) => {
  try {
    const response = await axios.put(`${PAYMENT_SERVICE}/api/payments/${req.params.id}/fail`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

const DOCTOR_SERVICE_URL = "http://localhost:5009";
const TELEMEDICINE_SERVICE_URL = process.env.TELEMEDICINE_SERVICE_URL || "http://localhost:5005";

app.post("/api/profile", async (req, res) => {
  try {
    const response = await axios.post(`${DOCTOR_SERVICE_URL}/api/profile`, req.body,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/profile/me", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/profile/me`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put("/api/profile/me", async (req, res) => {
  try {
    const response = await axios.put(`${DOCTOR_SERVICE_URL}/api/profile/me`, req.body,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/doctor/appointments/today", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/doctor/appointments/today`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/doctor/appointments/pending", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/doctor/appointments/pending`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.patch("/api/doctor/appointments/:appointmentId/decision", async (req, res) => {
  try {
    const response = await axios.patch(
      `${DOCTOR_SERVICE_URL}/api/doctor/appointments/${req.params.appointmentId}/decision`,
      req.body, { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/availability", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/availability`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post("/api/availability", async (req, res) => {
  try {
    const response = await axios.post(`${DOCTOR_SERVICE_URL}/api/availability`, req.body,
      { headers: { Authorization: req.headers.authorization } });
    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.put("/api/availability/:id", async (req, res) => {
  try {
    const response = await axios.put(`${DOCTOR_SERVICE_URL}/api/availability/${req.params.id}`, req.body,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.delete("/api/availability/:id", async (req, res) => {
  try {
    const response = await axios.delete(`${DOCTOR_SERVICE_URL}/api/availability/${req.params.id}`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/dashboard/summary`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post("/api/prescriptions", async (req, res) => {
  try {
    const response = await axios.post(`${DOCTOR_SERVICE_URL}/api/prescriptions`, req.body,
      { headers: { Authorization: req.headers.authorization } });
    res.status(201).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/prescriptions", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/prescriptions`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/prescriptions/patient/:patientId", async (req, res) => {
  try {
    const response = await axios.get(
      `${DOCTOR_SERVICE_URL}/api/prescriptions/patient/${req.params.patientId}`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/prescriptions/:id/pdf", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/prescriptions/${req.params.id}/pdf`,
      { responseType: "arraybuffer", headers: { Authorization: req.headers.authorization } });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=prescription-${req.params.id}.pdf`);
    res.send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/doctors/patients/:patientId/reports", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5002/api/reports/patients/${req.params.patientId}`,
      { headers: { Authorization: req.headers.authorization || "" } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post("/api/telemedicine", async (req, res) => {
  try {
    const response = await axios.post(`${TELEMEDICINE_SERVICE_URL}/api/telemedicine`, req.body,
      { headers: { "x-user-id": req.headers["x-user-id"] || "1", "x-user-role": req.headers["x-user-role"] || "DOCTOR" } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.post("/api/telemedicine/:id/join", async (req, res) => {
  try {
    const response = await axios.post(`${TELEMEDICINE_SERVICE_URL}/api/telemedicine/${req.params.id}/join`, {},
      { headers: { "x-user-id": req.headers["x-user-id"] || "1", "x-user-role": req.headers["x-user-role"] || "PATIENT" } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.patch("/api/telemedicine/:id/start", async (req, res) => {
  try {
    const response = await axios.patch(`${TELEMEDICINE_SERVICE_URL}/api/telemedicine/${req.params.id}/start`, {},
      { headers: { "x-user-id": req.headers["x-user-id"] || "1", "x-user-role": req.headers["x-user-role"] || "DOCTOR" } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.patch("/api/telemedicine/:id/end", async (req, res) => {
  try {
    const response = await axios.patch(`${TELEMEDICINE_SERVICE_URL}/api/telemedicine/${req.params.id}/end`, {},
      { headers: { "x-user-id": req.headers["x-user-id"] || "1", "x-user-role": req.headers["x-user-role"] || "DOCTOR" } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/telemedicine/appointment/:appointmentId", async (req, res) => {
  try {
    const response = await axios.get(
      `${TELEMEDICINE_SERVICE_URL}/api/telemedicine/appointment/${req.params.appointmentId}`,
      { headers: { "x-user-id": req.headers["x-user-id"] || "1", "x-user-role": req.headers["x-user-role"] || "PATIENT" } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/doctors", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/doctors`, { params: req.query });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/doctors/:id", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/doctors/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/doctors/:id/availability", async (req, res) => {
  try {
    const response = await axios.get(`${DOCTOR_SERVICE_URL}/api/doctors/${req.params.id}/availability`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

const AI_SERVICE_URL = "http://localhost:5005";
app.post("/api/symptoms/check", async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/symptoms/check`, req.body,
      { headers: { Authorization: req.headers.authorization || "" } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { error: "Server Error" });
  }
});

app.get("/api/admin/doctors", async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE}/api/admin/doctors`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.patch("/api/admin/doctors/:id/verify", async (req, res) => {
  try {
    const response = await axios.patch(`${AUTH_SERVICE}/api/admin/doctors/${req.params.id}/verify`,
      req.body, { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.patch("/api/admin/doctors/:id/reject", async (req, res) => {
  try {
    const response = await axios.patch(`${AUTH_SERVICE}/api/admin/doctors/${req.params.id}/reject`,
      req.body, { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

app.get("/api/admin/patients", async (req, res) => {
  try {
    const response = await axios.get(`${AUTH_SERVICE}/api/admin/patients`,
      { headers: { Authorization: req.headers.authorization } });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Server Error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
```

---

### A2. `services/auth-service/src/utils/jwt.js`

```javascript
import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};
```

---

### A3. `services/auth-service/src/models/user.model.js`

```javascript
import pool from "../config/db.config.js";

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

export const createUser = async (email, password, role, isApproved = true) => {
  const result = await pool.query(
    "INSERT INTO users (email, password, role, is_approved) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, password, role, isApproved]
  );
  return result.rows[0];
};

export const deleteUser = async (id) => {
  await pool.query("DELETE FROM users WHERE id = $1", [id]);
};

export const updateUserApproval = async (id, isApproved) => {
  await pool.query("UPDATE users SET is_approved = $1 WHERE id = $2", [isApproved, id]);
};

export const findAllDoctors = async () => {
  const result = await pool.query(
    "SELECT id, email, role, is_approved, created_at FROM users WHERE role = 'doctor' ORDER BY created_at DESC"
  );
  return result.rows;
};
```

---

### A4. `services/auth-service/src/services/auth.service.js`

```javascript
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

export const registerService = async (email, password, role) => {
  if (!email || typeof email !== "string") throw new Error("Email is required");
  if (!password || typeof password !== "string") throw new Error("Password is required");
  if (!role || typeof role !== "string") throw new Error("Role is required");

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isApproved = role !== "doctor";
  const user = await createUser(email, hashedPassword, role, isApproved);
  const token = generateToken(user);
  return { user, token };
};

export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid password");

  if (!user.is_approved) throw new Error("Your account is pending admin approval.");

  const token = generateToken(user);
  return { token, user };
};
```

---

### A5. `services/auth-service/src/controllers/auth.controller.js`

```javascript
import axios from "axios";
import { registerService, loginService } from "../services/auth.service.js";
import { deleteUser } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { email, password, role, name, fullName, age, gender, contact,
            specialization, speciality, consultationType, experience,
            license_no, licenseNumber, phone, fees, bio, image } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Validation Error",
        error: "email, password, and role are required" });
    }

    const { user, token } = await registerService(email, password, role);
    let userCreatedId = user.id;

    try {
      if (role === "patient") {
        if (!name || age == null || !gender || !contact)
          throw new Error("name, age, gender, contact required for patient");
        await axios.post("http://localhost:5002/api/patients/register", {
          user_id: user.id, email, password, name, age, gender, contact
        });
      } else if (role === "doctor") {
        const resolvedFullName    = fullName || name;
        const resolvedPhone       = phone || contact;
        const resolvedSpeciality  = speciality || specialization;
        const resolvedLicenseNumber = licenseNumber || license_no;
        if (!resolvedFullName || !resolvedSpeciality || !resolvedLicenseNumber ||
            resolvedPhone == null || fees == null)
          throw new Error("fullName, speciality, licenseNumber, phone, fees required for doctor");
        await axios.post("http://localhost:5009/api/profile/register", {
          id: user.id, email, password, fullName: resolvedFullName, phone: resolvedPhone,
          speciality: resolvedSpeciality, consultationType, experience,
          licenseNumber: resolvedLicenseNumber, fees: Number(fees), bio, image
        });
      }
      res.status(201).json({ message: "User registered successfully", user, token });
    } catch (profileErr) {
      if (userCreatedId) await deleteUser(userCreatedId);
      throw profileErr;
    }
  } catch (err) {
    const statusCode = err.statusCode || err.response?.status || 500;
    res.status(statusCode).json({
      message: statusCode >= 500 ? "Server Error" : "Request Failed",
      error: err.response?.data || err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.json({ message: "Login successful", ...data });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
```

---

### A6. `services/auth-service/src/middlewares/adminMiddleware.js`

```javascript
import jwt from "jsonwebtoken";

export const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or invalid." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden. Admin access only." });
    }
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
```

---

### A7. `services/appointment-service/src/controllers/appointment.controller.js`

```javascript
import {
  searchDoctorsService, createAppointmentService, rescheduleAppointmentService,
  cancelAppointmentService, getAppointmentStatusService, getMyAppointmentsService,
  confirmPaymentService, getAppointmentByIdService, getDoctorPendingAppointmentsService,
  handleDoctorDecisionService, getDoctorTodayAppointmentsService
} from "../services/appointment.service.js";
import { findAppointmentById, updateAppointment } from "../repositories/appointment.repository.js";

export const searchDoctorsController = async (req, res) => {
  try {
    const doctors = await searchDoctorsService(req.query.specialty);
    res.status(200).json(doctors);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const createAppointmentController = async (req, res) => {
  try {
    const patientId = String(req.user ? req.user.id : req.body.patientId);
    const doctorId  = String(req.body.doctorId);
    const result = await createAppointmentService({
      patientId, doctorId, appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot, consultationType: req.body.consultationType || "ONLINE"
    });
    res.status(201).json({ message: "Appointment created successfully", ...result });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const rescheduleAppointmentController = async (req, res) => {
  try {
    const appointment = await rescheduleAppointmentService({
      appointmentId: req.params.id, appointmentDate: req.body.appointmentDate,
      timeSlot: req.body.timeSlot
    });
    res.status(200).json({ message: "Appointment rescheduled successfully", appointment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const cancelAppointmentController = async (req, res) => {
  try {
    const appointment = await cancelAppointmentService(req.params.id);
    res.status(200).json({ message: "Appointment cancelled successfully", appointment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getAppointmentStatusController = async (req, res) => {
  try {
    const result = await getAppointmentStatusService(req.params.id);
    res.status(200).json(result);
  } catch (error) { res.status(404).json({ message: error.message }); }
};

export const getMyAppointmentsController = async (req, res) => {
  try {
    const appointments = await getMyAppointmentsService(String(req.user.id));
    res.status(200).json(appointments);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const confirmPaymentController = async (req, res) => {
  try {
    const appointment = await confirmPaymentService({
      appointmentId: req.params.id, paymentId: req.body.paymentId
    });
    res.status(200).json({ message: "Appointment confirmed after payment", appointment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const failPayment = async (req, res) => {
  try {
    const appointment = await findAppointmentById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    appointment.status = "CANCELLED";
    await updateAppointment(appointment);
    res.status(200).json({ message: "Appointment cancelled due to payment failure", appointment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getAppointmentByIdController = async (req, res) => {
  try {
    const appointment = await getAppointmentByIdService(req.params.id);
    res.status(200).json(appointment);
  } catch (error) { res.status(404).json({ message: error.message }); }
};

export const getDoctorPendingAppointmentsController = async (req, res) => {
  try {
    const appointments = await getDoctorPendingAppointmentsService(String(req.params.doctorId));
    res.status(200).json(appointments);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const handleDoctorDecisionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctorId = String(req.body.doctorId);
    if (!doctorId || !status)
      return res.status(400).json({ message: "doctorId and status are required" });
    const appointment = await handleDoctorDecisionService({ appointmentId: id, doctorId, status });
    res.status(200).json({ message: `Appointment ${status.toLowerCase()} successfully`, appointment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getDoctorTodayAppointmentsController = async (req, res) => {
  try {
    const appointments = await getDoctorTodayAppointmentsService(String(req.params.doctorId));
    res.status(200).json(appointments);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
```

---

### A8. `services/appointment-service/src/services/appointment.service.js`

```javascript
import axios from "axios";
import {
  createAppointment, findAppointmentByDoctorDateSlot, findAppointmentById, updateAppointment,
  findAppointmentsByPatientId, findConfirmedAppointmentsByDoctorId, findTodaysAppointmentsByDoctorId
} from "../repositories/appointment.repository.js";
import { getDoctorById, getDoctorInternalById, searchDoctorsBySpecialty } from "../providers/doctor.provider.js";

export const searchDoctorsService = async (specialty) => {
  if (!specialty) throw new Error("Specialty is required");
  return searchDoctorsBySpecialty(specialty);
};

export const createAppointmentService = async ({ patientId, doctorId, appointmentDate, timeSlot, consultationType }) => {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  const existing = await findAppointmentByDoctorDateSlot(doctorId, appointmentDate, timeSlot);
  if (existing && ["PENDING_PAYMENT", "CONFIRMED", "RESCHEDULED"].includes(existing.status))
    throw new Error("This slot is already booked");

  const appointment = await createAppointment({
    patientId, doctorId, doctorName: doctor.name, specialty: doctor.specialty,
    appointmentDate, timeSlot, consultationType, status: "PENDING_PAYMENT"
  });

  const paymentResponse = await axios.post(
    `${process.env.PAYMENT_SERVICE_URL || "http://localhost:5003"}/api/payments/create`,
    { appointmentId: appointment.id, patientId, amount: doctor.consultationFee, currency: "LKR", gateway: "PAYHERE" }
  );

  appointment.paymentId = paymentResponse.data.payment.id;
  await updateAppointment(appointment);
  return { appointment, payment: paymentResponse.data.payment };
};

export const rescheduleAppointmentService = async ({ appointmentId, appointmentDate, timeSlot }) => {
  const appointment = await findAppointmentById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status === "CANCELLED") throw new Error("Cancelled appointment cannot be rescheduled");

  const existing = await findAppointmentByDoctorDateSlot(
    appointment.doctorId, appointmentDate, timeSlot, appointment.id);
  if (existing && ["PENDING_PAYMENT", "CONFIRMED", "RESCHEDULED"].includes(existing.status))
    throw new Error("New slot is already booked");

  appointment.appointmentDate = appointmentDate;
  appointment.timeSlot = timeSlot;
  appointment.status = "RESCHEDULED";
  await updateAppointment(appointment);
  return appointment;
};

export const cancelAppointmentService = async (appointmentId) => {
  const appointment = await findAppointmentById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.status === "COMPLETED") throw new Error("Completed appointment cannot be cancelled");
  appointment.status = "CANCELLED";
  await updateAppointment(appointment);
  return appointment;
};

export const getAppointmentStatusService = async (appointmentId) => {
  const appointment = await findAppointmentById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  return { appointmentId: appointment.id, status: appointment.status, meetingLink: appointment.meetingLink };
};

export const getMyAppointmentsService = async (patientId) => findAppointmentsByPatientId(patientId);

export const confirmPaymentService = async ({ appointmentId, paymentId }) => {
  const appointment = await findAppointmentById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  appointment.status = "CONFIRMED";
  appointment.paymentId = paymentId;
  await updateAppointment(appointment);

  try {
    const patientServiceUrl = process.env.PATIENT_SERVICE_URL || "http://localhost:5002";
    const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5006";
    const patientRes = await axios.get(`${patientServiceUrl}/api/patients/internal/${appointment.patientId}`);
    const patient = patientRes.data;
    await axios.post(`${notificationServiceUrl}/api/v1/notifications/appointment-booked`, {
      appointmentId: appointment.id, patientEmail: patient.email || undefined,
      patientPhone: patient.contact || undefined, doctorEmail: undefined, source: "appointment-service"
    });
  } catch (notifyErr) {
    console.warn("Notification dispatch failed:", notifyErr.message);
  }
  return appointment;
};

export const getAppointmentByIdService = async (appointmentId) => {
  const appointment = await findAppointmentById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  return appointment;
};

export const getDoctorPendingAppointmentsService = async (doctorId) =>
  findConfirmedAppointmentsByDoctorId(doctorId);

export const handleDoctorDecisionService = async ({ appointmentId, doctorId, status }) => {
  const appointment = await findAppointmentById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.doctorId !== doctorId) throw new Error("You are not authorized to modify this appointment");
  if (appointment.status !== "CONFIRMED") throw new Error("Only confirmed appointments can be accepted or rejected");
  if (appointment.docStatus !== "PENDING") throw new Error("Doctor has already made a decision on this appointment");
  if (!["ACCEPTED", "REJECTED"].includes(status)) throw new Error("Invalid decision. Use ACCEPTED or REJECTED");

  appointment.docStatus = status;
  await updateAppointment(appointment);

  if (status === "ACCEPTED") {
    triggerPostAcceptanceWorkflow(appointment).catch((err) =>
      console.warn("Post-acceptance workflow failed:", err.message));
  }
  return appointment;
};

async function triggerPostAcceptanceWorkflow(appointment) {
  const patientServiceUrl    = process.env.PATIENT_SERVICE_URL    || "http://localhost:5002";
  const telemedicineServiceUrl = process.env.TELEMEDICINE_SERVICE_URL || "http://localhost:5005";
  const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5006";
  const internalSecret       = process.env.INTERNAL_SECRET        || "mediconnect-internal";

  let patientEmail, patientPhone, doctorEmail;
  try {
    const patientRes = await axios.get(`${patientServiceUrl}/api/patients/internal/${appointment.patientId}`,
      { headers: { "x-internal-secret": internalSecret } });
    patientEmail = patientRes.data?.email;
    patientPhone = patientRes.data?.contact;
  } catch (err) { console.warn("Could not fetch patient contact info:", err.message); }

  try {
    const doctor = await getDoctorInternalById(appointment.doctorId);
    doctorEmail = doctor?.email;
  } catch (err) { console.warn("Could not fetch doctor email:", err.message); }

  if (appointment.consultationType === "ONLINE") {
    await axios.post(`${telemedicineServiceUrl}/api/v1/sessions/internal`, {
      appointmentId: appointment.id, doctorName: appointment.doctorName,
      patientEmail, patientPhone, doctorEmail
    });
  } else {
    await axios.post(`${notificationServiceUrl}/api/v1/notifications/appointment-booked`, {
      appointmentId: appointment.id, patientEmail, patientPhone, doctorEmail, source: "appointment-service"
    });
  }
}

export const getDoctorTodayAppointmentsService = async (doctorId) =>
  findTodaysAppointmentsByDoctorId(doctorId);
```

---

### A9. `services/appointment-service/src/repositories/appointment.repository.js`

```javascript
import { Op } from "sequelize";
import Appointment from "../models/appointment.model.js";

export const createAppointment = async (data) => Appointment.create(data);
export const findAppointmentById = async (id) => Appointment.findByPk(id);

export const findAppointmentByDoctorDateSlot = async (doctorId, appointmentDate, timeSlot, excludeId = null) => {
  const where = { doctorId, appointmentDate, timeSlot };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  return Appointment.findOne({ where });
};

export const updateAppointment = async (appointment) => appointment.save();

export const findAppointmentsByPatientId = async (patientId) =>
  Appointment.findAll({ where: { patientId }, order: [["createdAt", "DESC"]] });

export const findConfirmedAppointmentsByDoctorId = async (doctorId) =>
  Appointment.findAll({
    where: { doctorId, status: "CONFIRMED", docStatus: "PENDING" },
    order: [["appointmentDate", "ASC"], ["timeSlot", "ASC"]]
  });

export const findTodaysAppointmentsByDoctorId = async (doctorId) => {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return Appointment.findAll({
    where: { doctorId, appointmentDate: today, status: "CONFIRMED" },
    order: [["timeSlot", "ASC"]]
  });
};
```

---

### A10. `services/appointment-service/src/providers/doctor.provider.js`

```javascript
import axios from "axios";

const DOCTOR_SERVICE = process.env.DOCTOR_SERVICE_URL || "http://localhost:5009";

export const searchDoctorsBySpecialty = async (specialty) => {
  const response = await axios.get(`${DOCTOR_SERVICE}/api/doctors`, { params: { speciality: specialty } });
  return response.data;
};

export const getDoctorInternalById = async (doctorId) => {
  const secret = process.env.INTERNAL_SECRET || "mediconnect-internal";
  const response = await axios.get(`${DOCTOR_SERVICE}/internal/doctors/${doctorId}`,
    { headers: { "x-internal-secret": secret } });
  const doc = response.data;
  if (!doc) return null;
  return { ...doc, name: doc.fullName, specialty: doc.speciality, consultationFee: doc.fees, email: doc.email };
};

export const getDoctorById = async (doctorId) => {
  const response = await axios.get(`${DOCTOR_SERVICE}/api/doctors/${doctorId}`);
  const doc = response.data;
  if (!doc) return null;
  return { ...doc, name: doc.fullName, specialty: doc.speciality, consultationFee: doc.fees };
};
```

---

### A11. `services/payment-service/src/controllers/payment.controller.js`

```javascript
import crypto from "crypto";
import { createPaymentService, getPaymentByIdService, getPaymentByAppointmentIdService,
         markPaymentSuccessService, markPaymentFailedService } from "../services/payment.service.js";

export const createPaymentController = async (req, res) => {
  try {
    const payment = await createPaymentService(req.body);
    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getPaymentByIdController = async (req, res) => {
  try {
    const payment = await getPaymentByIdService(req.params.id);
    res.status(200).json(payment);
  } catch (error) { res.status(404).json({ message: error.message }); }
};

export const getPaymentByAppointmentIdController = async (req, res) => {
  try {
    const payment = await getPaymentByAppointmentIdService(req.params.appointmentId);
    res.status(200).json(payment);
  } catch (error) { res.status(404).json({ message: error.message }); }
};

export const markPaymentSuccessController = async (req, res) => {
  try {
    const payment = await markPaymentSuccessService(req.params.id);
    res.status(200).json({ message: "Payment marked as successful", payment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const markPaymentFailedController = async (req, res) => {
  try {
    const payment = await markPaymentFailedService(req.params.id);
    res.status(200).json({ message: "Payment marked as failed", payment });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const getPayhereParamsController = async (req, res) => {
  try {
    const payment = await getPaymentByIdService(req.params.paymentId);
    const merchantId     = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const notifyUrl      = process.env.PAYHERE_NOTIFY_URL;
    const returnUrl      = process.env.PAYHERE_RETURN_URL || "http://localhost:3000/payment/success";
    const cancelUrl      = process.env.PAYHERE_CANCEL_URL || "http://localhost:3000/payment/cancel";

    if (!merchantId || !merchantSecret || !notifyUrl)
      return res.status(500).json({ message: "PayHere credentials not configured" });

    const amountFormatted = parseFloat(payment.amount).toFixed(2);
    const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
    const hash = crypto.createHash("md5")
      .update(merchantId + payment.id + amountFormatted + payment.currency + hashedSecret)
      .digest("hex").toUpperCase();

    res.status(200).json({
      merchant_id: merchantId, return_url: returnUrl, cancel_url: cancelUrl, notify_url: notifyUrl,
      order_id: payment.id, items: "Doctor Consultation", amount: amountFormatted,
      currency: payment.currency, hash,
      first_name: "Test", last_name: "User", email: "test@example.com",
      phone: "0771234567", address: "No 1, Main Street", city: "Colombo", country: "Sri Lanka"
    });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

export const payhereNotifyController = async (req, res) => {
  try {
    const { merchant_id, order_id, payment_id, payhere_amount,
            payhere_currency, status_code, md5sig } = req.body;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (merchantSecret) {
      const hashedSecret = crypto.createHash("md5").update(merchantSecret).digest("hex").toUpperCase();
      const expectedSig  = crypto.createHash("md5")
        .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret)
        .digest("hex").toUpperCase();
      if (md5sig !== expectedSig) return res.status(400).send("Invalid signature");
    }
    if (status_code === "2") {
      await markPaymentSuccessService(order_id, payment_id);
    } else {
      await markPaymentFailedService(order_id);
    }
    res.status(200).send("OK");
  } catch (error) { res.status(400).send("Error"); }
};
```

---

### A12. `services/payment-service/src/services/payment.service.js`

```javascript
import axios from "axios";
import { createPayment, findPaymentById, findPaymentByAppointmentId, updatePayment }
  from "../repositories/payment.repository.js";

export const createPaymentService = async ({ appointmentId, patientId, amount, currency = "LKR", gateway = "PAYHERE" }) =>
  createPayment({ appointmentId, patientId, amount, currency, gateway, status: "PENDING" });

export const getPaymentByIdService = async (paymentId) => {
  const payment = await findPaymentById(paymentId);
  if (!payment) throw new Error("Payment not found");
  return payment;
};

export const getPaymentByAppointmentIdService = async (appointmentId) => {
  const payment = await findPaymentByAppointmentId(appointmentId);
  if (!payment) throw new Error("Payment not found for appointment");
  return payment;
};

export const markPaymentSuccessService = async (paymentId, transactionId = null) => {
  const payment = await findPaymentById(paymentId);
  if (!payment) throw new Error("Payment not found");
  if (payment.status === "SUCCESS") return payment;
  payment.status = "SUCCESS";
  payment.transactionId = transactionId || `TXN-${Date.now()}`;
  await updatePayment(payment);
  try {
    await axios.put(
      `${process.env.APPOINTMENT_SERVICE_URL}/api/appointments/${payment.appointmentId}/confirm-payment`,
      { paymentId: payment.id }
    );
  } catch (error) { console.log("Appointment service update failed."); }
  return payment;
};

export const markPaymentFailedService = async (paymentId) => {
  const payment = await findPaymentById(paymentId);
  if (!payment) throw new Error("Payment not found");
  payment.status = "FAILED";
  await updatePayment(payment);
  return payment;
};
```

---

### A13. `services/doctor-service/src/middlewares/authMiddleware.js`

```javascript
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or invalid." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Forbidden. Doctor access only." });
    }
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
```

---

### A14. `services/doctor-service/src/controllers/doctorProfile.controller.js`

```javascript
import { createProfileService, getProfileService, updateProfileService,
         getDoctorsBySpecialityService } from "../services/doctorProfile.service.js";

export const createProfileController = async (req, res) => {
  try {
    const data = { ...req.body, image: req.file ? req.file.originalname : null };
    const profile = await createProfileService(data);
    res.status(201).json(profile);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const getProfileController = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const profile  = await getProfileService(doctorId);
    if (req.user.role !== "doctor")
      return res.status(403).json({ message: "Only doctors can access the profile" });
    res.status(200).json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const updateProfileController = async (req, res) => {
  try {
    const updated = await updateProfileService(req.user.id, req.body);
    res.status(200).json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const getDoctorsBySpecialityController = async (req, res) => {
  try {
    const doctors = await getDoctorsBySpecialityService(req.query.speciality);
    res.status(200).json(doctors);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
```

---

### A15. `services/doctor-service/src/controllers/availability.controller.js`

```javascript
import { addAvailabilityService, deleteAvailabilityService,
         getDoctorAvailabilityService, updateAvailabilityService } from "../services/availability.service.js";

export const getAvailabilityController = async (req, res) => {
  try {
    const slots = await getDoctorAvailabilityService(String(req.user.id));
    res.json(slots);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const addAvailabilityController = async (req, res) => {
  try {
    const slot = await addAvailabilityService({ doctorId: String(req.user.id), ...req.body });
    res.status(201).json(slot);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const updateAvailabilityController = async (req, res) => {
  try {
    const slot = await updateAvailabilityService(req.params.id, { doctorId: String(req.user.id), ...req.body });
    res.json(slot);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const deleteAvailabilityController = async (req, res) => {
  try {
    await deleteAvailabilityService(req.params.id);
    res.json({ message: "Slot deleted" });
  } catch (err) { res.status(400).json({ message: err.message }); }
};
```

---

### A16. `services/doctor-service/src/controllers/appointmentStatus.controller.js`

```javascript
import { AppointmentProvider } from "../providers/appointment.provider.js";

export const getTodayAppointmentsController = async (req, res) => {
  try {
    const appointments = await AppointmentProvider.getDoctorAppointments(req.user.id);
    res.json(appointments);
  } catch (err) { res.status(err.response?.status || 500).json({ message: err.message }); }
};

export const getPendingAppointmentsController = async (req, res) => {
  try {
    const appointments = await AppointmentProvider.getPendingAppointments(req.user.id);
    res.json(appointments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const decideAppointmentController = async (req, res) => {
  try {
    const result = await AppointmentProvider.updateAppointmentDecision(
      req.params.appointmentId, req.user.id, req.body.status);
    res.json({ message: `Appointment ${req.body.status} successfully`, appointment: result });
  } catch (err) { res.status(400).json({ message: err.message }); }
};
```

---

### A17. `services/telemedicine-service/src/controllers/telemedicine.controller.js`

```javascript
import * as telemedicineService from "../services/telemedicine.service.js";

export const createSession = async (req, res, next) => {
  try {
    return res.status(201).json(await telemedicineService.createTelemedicineSession(req.body));
  } catch (error) { next(error); }
};

export const getSessionById = async (req, res, next) => {
  try {
    return res.status(200).json(await telemedicineService.getTelemedicineSessionById(req.params.id));
  } catch (error) { next(error); }
};

export const getSessionByAppointmentId = async (req, res, next) => {
  try {
    return res.status(200).json(
      await telemedicineService.getTelemedicineSessionByAppointmentId(req.params.appointmentId));
  } catch (error) { next(error); }
};

export const startSession = async (req, res, next) => {
  try {
    return res.status(200).json(await telemedicineService.startTelemedicineSession(req.params.id));
  } catch (error) { next(error); }
};

export const endSession = async (req, res, next) => {
  try {
    return res.status(200).json(await telemedicineService.endTelemedicineSession(req.params.id));
  } catch (error) { next(error); }
};

export const cancelSession = async (req, res, next) => {
  try {
    return res.status(200).json(await telemedicineService.cancelTelemedicineSession(req.params.id));
  } catch (error) { next(error); }
};

export const joinSession = async (req, res, next) => {
  try {
    return res.status(200).json(await telemedicineService.joinTelemedicineSession(req.params.id));
  } catch (error) { next(error); }
};

export const listSessions = async (req, res, next) => {
  try {
    return res.status(200).json(await telemedicineService.listTelemedicineSessions());
  } catch (error) { next(error); }
};
```

---

### A18. `services/telemedicine-service/src/services/telemedicine.service.js`

```javascript
import * as telemedicineRepository from "../repositories/telemedicine.repository.js";
import { getAppointmentById } from "../providers/appointment.provider.js";
import axios from "axios";
import env from "../config/env.js";
import { publishEvent } from "../utils/rabbitmq.util.js";
import { createJitsiMeeting } from "../utils/jitsi.util.js";
import { successResponse } from "../utils/response.util.js";
import { getLogger } from "../utils/logger.util.js";

const logger = getLogger("telemedicine.service");

export const createTelemedicineSession = async (payload) => {
  const { appointmentId, doctorName: payloadDoctorName, patientName: payloadPatientName,
          patientEmail: payloadPatientEmail, patientPhone: payloadPatientPhone,
          doctorEmail: payloadDoctorEmail } = payload;

  if (!appointmentId) { const e = new Error("appointmentId is required"); e.statusCode = 400; throw e; }

  const existingSession = await telemedicineRepository.findByAppointmentId(appointmentId);
  if (existingSession) { const e = new Error("Session already exists for this appointment"); e.statusCode = 409; throw e; }

  const appointment = await getAppointmentById(appointmentId);
  if (!appointment) { const e = new Error("Appointment not found"); e.statusCode = 404; throw e; }
  if (appointment.status !== "CONFIRMED") { const e = new Error("Appointment is not confirmed"); e.statusCode = 400; throw e; }

  const doctorName  = payloadDoctorName  || appointment.doctorName  || "Dr. Unknown";
  const patientName = payloadPatientName || appointment.patientName || "Patient";

  const jitsiMeeting = createJitsiMeeting({
    appointmentId: appointment.id, doctorId: appointment.doctorId,
    patientUserId: appointment.patientId, doctorName, patientName
  });

  const createdSession = await telemedicineRepository.createSession({
    appointmentId: appointment.id, doctorId: appointment.doctorId,
    patientUserId: appointment.patientId, roomId: jitsiMeeting.roomId,
    meetingLink: jitsiMeeting.meetingLink, jitsiJwt: jitsiMeeting.jwt,
    status: "SCHEDULED", scheduledAt: appointment.scheduledAt
  });

  try {
    const patientEmail = payloadPatientEmail || undefined;
    const patientPhone = payloadPatientPhone || undefined;
    const doctorEmail  = payloadDoctorEmail  || undefined;
    if (env.rabbitmqUrl) {
      await publishEvent("appointment.booked", {
        appointmentId: createdSession.appointmentId, meetingLink: createdSession.meetingLink,
        patientEmail, patientPhone, doctorEmail, source: "telemedicine-service"
      });
    } else {
      await axios.post(`${env.notificationServiceUrl}/notifications/appointment-booked`, {
        appointmentId: createdSession.appointmentId, meetingLink: createdSession.meetingLink,
        patientEmail, patientPhone, doctorEmail
      });
    }
  } catch (notificationError) {
    logger.warn("Failed to send notification:", notificationError.message);
  }

  return successResponse("Telemedicine session created successfully", createdSession);
};

export const getTelemedicineSessionById = async (id) => {
  const session = await telemedicineRepository.findById(id);
  if (!session) { const e = new Error("Session not found"); e.statusCode = 404; throw e; }
  return successResponse("Session fetched successfully", session);
};

export const getTelemedicineSessionByAppointmentId = async (appointmentId) => {
  const session = await telemedicineRepository.findByAppointmentId(appointmentId);
  if (!session) { const e = new Error("Session not found for this appointment"); e.statusCode = 404; throw e; }
  return successResponse("Session fetched successfully", session);
};

export const startTelemedicineSession = async (id) => {
  const session = await telemedicineRepository.findById(id);
  if (!session) { const e = new Error("Session not found"); e.statusCode = 404; throw e; }
  if (session.status !== "SCHEDULED") { const e = new Error("Only scheduled sessions can be started"); e.statusCode = 400; throw e; }
  const updated = await telemedicineRepository.updateSession(id, { status: "ACTIVE", startedAt: new Date() });
  return successResponse("Session started successfully", updated);
};

export const endTelemedicineSession = async (id) => {
  const session = await telemedicineRepository.findById(id);
  if (!session) { const e = new Error("Session not found"); e.statusCode = 404; throw e; }
  if (session.status !== "ACTIVE") { const e = new Error("Only active sessions can be ended"); e.statusCode = 400; throw e; }
  const updated = await telemedicineRepository.updateSession(id, { status: "COMPLETED", endedAt: new Date() });
  try {
    const appointment = await getAppointmentById(updated.appointmentId);
    if (env.rabbitmqUrl) {
      await publishEvent("consultation.completed", {
        appointmentId: updated.appointmentId,
        patientEmail: appointment?.patientEmail, patientPhone: appointment?.patientPhone,
        doctorEmail: appointment?.doctorEmail, source: "telemedicine-service"
      });
    } else {
      await axios.post(`${env.notificationServiceUrl}/notifications/consultation-completed`, {
        appointmentId: updated.appointmentId,
        patientEmail: appointment?.patientEmail, patientPhone: appointment?.patientPhone,
        doctorEmail: appointment?.doctorEmail
      });
    }
  } catch (e) { logger.warn("Failed to send completion notification:", e.message); }
  return successResponse("Session ended successfully", updated);
};

export const cancelTelemedicineSession = async (id) => {
  const session = await telemedicineRepository.findById(id);
  if (!session) { const e = new Error("Session not found"); e.statusCode = 404; throw e; }
  if (session.status === "COMPLETED") { const e = new Error("Completed sessions cannot be cancelled"); e.statusCode = 400; throw e; }
  const updated = await telemedicineRepository.updateSession(id, { status: "CANCELLED" });
  return successResponse("Session cancelled successfully", updated);
};

export const joinTelemedicineSession = async (id) => {
  const session = await telemedicineRepository.findById(id);
  if (!session) { const e = new Error("Session not found"); e.statusCode = 404; throw e; }
  if (session.status === "CANCELLED") { const e = new Error("Cancelled session cannot be joined"); e.statusCode = 400; throw e; }
  return successResponse("Meeting link fetched successfully", {
    id: session.id, roomId: session.roomId, meetingLink: session.meetingLink,
    status: session.status, jwt: session.jitsiJwt || null, appointmentId: session.appointmentId
  });
};

export const listTelemedicineSessions = async () => {
  const sessions = await telemedicineRepository.getAllSessions();
  return successResponse("Sessions fetched successfully", sessions);
};
```

---

### A19. `services/telemedicine-service/src/utils/jitsi.util.js`

```javascript
import env from "../config/env.js";
import { getLogger } from "./logger.util.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const logger = getLogger("jitsi.util");

export const generateJitsiRoomId = () => {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
  return `mc-${uuid}`.toLowerCase();
};

export const generateJitsiMeetingLink = (roomId) => `${env.jitsiBaseUrl}/${roomId}`;

export const generateJitsiJWT = (params = {}) => {
  try {
    const { roomId, userId, userEmail, userName } = params;
    if (!env.jitsiAppSecret) return null;
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign(
      {
        context: { user: { id: userId || "unknown", email: userEmail || "user@example.com", name: userName || "Guest" } },
        aud: "jitsi", iss: env.jitsiAppId || "jitsi", sub: env.jitsiBaseUrl,
        room: roomId, exp: now + 24 * 60 * 60
      },
      env.jitsiAppSecret
    );
  } catch (error) { logger.error("Error generating Jitsi JWT:", error.message); return null; }
};

export const createJitsiMeeting = (params = {}) => {
  const { appointmentId, doctorId, patientUserId, doctorName = "Doctor", patientName = "Patient" } = params;
  const roomId      = generateJitsiRoomId();
  const meetingLink = generateJitsiMeetingLink(roomId);
  const jwtToken    = generateJitsiJWT({
    roomId, userId: `doctor-${doctorId}`, userName: doctorName,
    userEmail: `doctor${doctorId}@mediconnect.com`
  });
  return {
    roomId, meetingLink, jwt: jwtToken, appointmentId, doctorId, patientUserId,
    createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 86400000).toISOString(),
    jitsiSettings: { baseUrl: env.jitsiBaseUrl, room: roomId, displayName: doctorName }
  };
};
```

---

### A20. `services/notification-service/src/controllers/notification.controller.js`

```javascript
import { notifyAppointmentBooked, notifyConsultationCompleted } from "../services/notification.service.js";

export async function appointmentBooked(req, res, next) {
  try {
    const { appointmentId, patientEmail, patientPhone } = req.body || {};
    if (!appointmentId)
      return res.status(400).json({ success: false, message: "appointmentId is required" });
    if (!patientEmail && !patientPhone)
      return res.status(400).json({ success: false, message: "patientEmail or patientPhone is required" });
    const result = await notifyAppointmentBooked(req.body);
    return res.status(200).json({ success: true, message: "Notification processed", result });
  } catch (err) { next(err); }
}

export async function consultationCompleted(req, res, next) {
  try {
    const { appointmentId, patientEmail, patientPhone } = req.body || {};
    if (!appointmentId)
      return res.status(400).json({ success: false, message: "appointmentId is required" });
    if (!patientEmail && !patientPhone)
      return res.status(400).json({ success: false, message: "patientEmail or patientPhone is required" });
    const result = await notifyConsultationCompleted(req.body);
    return res.status(200).json({ success: true, message: "Notification processed", result });
  } catch (err) { next(err); }
}
```

---

### A21. `services/notification-service/src/services/notification.service.js`

```javascript
import nodemailer from "nodemailer";
import twilio from "twilio";
import env from "../config/env.js";
import NotificationLog from "../models/notificationLog.model.js";

const hasSmtp   = () => Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass);
const hasTwilio = () => Boolean(env.twilioAccountSid && env.twilioAuthToken && env.twilioFrom);

const buildTransporter = () => {
  if (!hasSmtp()) return null;
  return nodemailer.createTransport({
    host: env.smtpHost, port: Number(env.smtpPort), secure: String(env.smtpSecure) === "true",
    auth: { user: env.smtpUser, pass: env.smtpPass }
  });
};

const buildTwilioClient = () => {
  if (!hasTwilio()) return null;
  return twilio(env.twilioAccountSid, env.twilioAuthToken);
};

export async function sendEmail({ to, subject, text }) {
  const transporter = buildTransporter();
  if (!transporter) return { attempted: false, sent: false, reason: "smtp_not_configured" };
  await transporter.sendMail({ from: env.smtpFrom || env.smtpUser, to, subject, text });
  return { attempted: true, sent: true };
}

export async function sendWhatsapp({ to, body }) {
  const client = buildTwilioClient();
  if (!client) return { attempted: false, sent: false, reason: "twilio_not_configured" };
  await client.messages.create({ from: `whatsapp:${env.twilioFrom}`, to: `whatsapp:${to}`, body });
  return { attempted: true, sent: true };
}

export async function sendSms({ to, body }) {
  const client = buildTwilioClient();
  if (!client) return { attempted: false, sent: false, reason: "twilio_not_configured" };
  await client.messages.create({ from: env.twilioFrom, to, body });
  return { attempted: true, sent: true };
}

async function persistLog(fields) {
  try {
    await NotificationLog.create({
      channel: fields.channel, toAddress: fields.toAddress, subject: fields.subject ?? null,
      body: fields.body ?? null, status: fields.status, appointmentId: fields.appointmentId ?? null,
      errorMessage: fields.errorMessage ?? null, source: fields.source ?? null
    });
  } catch { /* logging must never break the send flow */ }
}

export async function notifyAppointmentBooked(payload) {
  const { appointmentId, meetingLink, patientEmail, patientPhone, doctorEmail, source } = payload;
  if (!patientEmail && !patientPhone) {
    const e = new Error("patientEmail or patientPhone is required"); e.statusCode = 400; throw e;
  }

  const subject  = `MediConnect — Appointment confirmed (appointment #${appointmentId})`;
  const bodyText = meetingLink
    ? `Your appointment is confirmed.\nJoin here: ${meetingLink}\nAppointment ID: ${appointmentId}`
    : `Your appointment is confirmed.\nAppointment ID: ${appointmentId}`;

  const emailResults = [];
  for (const [to, subj] of [[patientEmail, subject], [doctorEmail, `[Doctor] ${subject}`]]) {
    if (!to) continue;
    try {
      const r  = await sendEmail({ to, subject: subj, text: bodyText });
      const ok = Boolean(r?.sent);
      emailResults.push({ to, ok, meta: r });
      await persistLog({ channel: "EMAIL", toAddress: to, subject: subj, body: bodyText,
        status: ok ? "SENT" : "FAILED", appointmentId, errorMessage: ok ? null : r?.reason, source });
    } catch (e) {
      emailResults.push({ to, ok: false, error: e.message });
      await persistLog({ channel: "EMAIL", toAddress: to, subject: subj, body: bodyText,
        status: "FAILED", appointmentId, errorMessage: e.message, source });
    }
  }

  const phoneResult = [];
  if (patientPhone) {
    const msgBody    = meetingLink
      ? `MediConnect: appointment confirmed ${meetingLink}`
      : `MediConnect: appointment confirmed (#${appointmentId})`;
    const targetPhone = env.adminPhoneNumber || patientPhone;
    let fallbackToSms = false;
    try {
      const r = await sendWhatsapp({ to: targetPhone, body: msgBody });
      if (Boolean(r?.sent)) {
        phoneResult.push({ to: targetPhone, channel: "WHATSAPP", ok: true, meta: r });
        await persistLog({ channel: "WHATSAPP", toAddress: targetPhone, body: msgBody,
          status: "SENT", appointmentId, source });
      } else { fallbackToSms = true; }
    } catch { fallbackToSms = true; }

    if (fallbackToSms) {
      try {
        const r  = await sendSms({ to: targetPhone, body: msgBody });
        const ok = Boolean(r?.sent);
        phoneResult.push({ to: targetPhone, channel: "SMS", ok, meta: r });
        await persistLog({ channel: "SMS", toAddress: targetPhone, body: msgBody,
          status: ok ? "SENT" : "FAILED", appointmentId,
          errorMessage: ok ? null : r?.reason, source });
      } catch (e) {
        phoneResult.push({ to: targetPhone, channel: "SMS", ok: false, error: e.message });
        await persistLog({ channel: "SMS", toAddress: targetPhone, body: msgBody,
          status: "FAILED", appointmentId, errorMessage: e.message, source });
      }
    }
  }
  return { emailResults, phoneResult };
}

export async function notifyConsultationCompleted(payload) {
  const { appointmentId, patientEmail, patientPhone, doctorEmail, source } = payload;
  if (!patientEmail && !patientPhone) {
    const e = new Error("patientEmail or patientPhone is required"); e.statusCode = 400; throw e;
  }

  const subject  = `MediConnect — Consultation completed (appointment #${appointmentId})`;
  const bodyText = `Your consultation has been completed.\nAppointment ID: ${appointmentId}`;

  const emailResults = [];
  for (const [to, subj] of [[patientEmail, subject], [doctorEmail, `[Doctor] ${subject}`]]) {
    if (!to) continue;
    try {
      const r  = await sendEmail({ to, subject: subj, text: bodyText });
      const ok = Boolean(r?.sent);
      emailResults.push({ to, ok, meta: r });
      await persistLog({ channel: "EMAIL", toAddress: to, subject: subj, body: bodyText,
        status: ok ? "SENT" : "FAILED", appointmentId, errorMessage: ok ? null : r?.reason, source });
    } catch (e) {
      emailResults.push({ to, ok: false, error: e.message });
      await persistLog({ channel: "EMAIL", toAddress: to, subject: subj, body: bodyText,
        status: "FAILED", appointmentId, errorMessage: e.message, source });
    }
  }

  const phoneResult = [];
  if (patientPhone) {
    const msgBody    = `MediConnect: consultation completed (#${appointmentId})`;
    const targetPhone = env.adminPhoneNumber || patientPhone;
    let fallbackToSms = false;
    try {
      const r = await sendWhatsapp({ to: targetPhone, body: msgBody });
      if (Boolean(r?.sent)) {
        phoneResult.push({ to: targetPhone, channel: "WHATSAPP", ok: true, meta: r });
        await persistLog({ channel: "WHATSAPP", toAddress: targetPhone, body: msgBody,
          status: "SENT", appointmentId, source });
      } else { fallbackToSms = true; }
    } catch { fallbackToSms = true; }

    if (fallbackToSms) {
      try {
        const r  = await sendSms({ to: targetPhone, body: msgBody });
        const ok = Boolean(r?.sent);
        phoneResult.push({ to: targetPhone, channel: "SMS", ok, meta: r });
        await persistLog({ channel: "SMS", toAddress: targetPhone, body: msgBody,
          status: ok ? "SENT" : "FAILED", appointmentId,
          errorMessage: ok ? null : r?.reason, source });
      } catch (e) {
        phoneResult.push({ to: targetPhone, channel: "SMS", ok: false, error: e.message });
        await persistLog({ channel: "SMS", toAddress: targetPhone, body: msgBody,
          status: "FAILED", appointmentId, errorMessage: e.message, source });
      }
    }
  }
  return { emailResults, phoneResult };
}
```

---

*End of Report*
