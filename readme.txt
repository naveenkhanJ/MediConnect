========================================================================
             MediConnect — Deployment & Setup Guide
========================================================================

MediConnect is a microservices-based healthcare platform. This guide 
outlines the steps required to set up the environment, databases, 
and services.

------------------------------------------------------------------------
1. PREREQUISITES
------------------------------------------------------------------------
Before starting, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- PostgreSQL (v15 or higher)
- npm (v9 or higher)
- Docker & Docker Compose (optional, for containerized deployment)

------------------------------------------------------------------------
2. DATABASE SETUP
------------------------------------------------------------------------
The project uses 7 distinct PostgreSQL databases. You must create them 
manually in your PostgreSQL instance before running the services:

Databases to create:
1. auth_db
2. patient_db
3. doctor_db
4. appointment_db
5. payment_db
6. notification_db
7. telemedicine_db

SQL Command (Run in pgAdmin or psql):
CREATE DATABASE auth_db;
CREATE DATABASE patient_db;
CREATE DATABASE doctor_db;
CREATE DATABASE appointment_db;
CREATE DATABASE payment_db;
CREATE DATABASE notification_db;
CREATE DATABASE telemedicine_db;

Default Connection Details (Verify in .env files):
- Host: localhost
- Port: 5432
- User: postgres
- Password: postgres123

------------------------------------------------------------------------
3. BACKEND SERVICE CONFIGURATION
------------------------------------------------------------------------
Each service in the /services directory has its own .env file.
Ensure the DB_USER and DB_PASSWORD in these files match your local 
PostgreSQL credentials.

PORT REFERENCE MAP:
- API Gateway:          4000
- Authentication:       5000
- Patient Service:      5002
- Appointment Service:  5003
- Payment Service:      5004
- Telemedicine Service: 5005
- Notification Service: 5006
- Doctor Service:       5009

------------------------------------------------------------------------
4. INSTALLATION & DEPLOYMENT (MANUAL)
------------------------------------------------------------------------
Follow these steps to start the backend ecosystem:

Step 1: Install Dependencies
Navigate into each service folder and run:
cd services/[service-name]
npm install

Step 2: Start Services
Start the API Gateway first, followed by the others:
npm start (inside services/api-gateway)
npm start (inside each other service folder)

Step 3: Troubleshooting
If a service fails to start due to a port clash, check if the port 
is already in use:
Windows: netstat -ano | findstr :[PORT]
Linux/Mac: lsof -i :[PORT]

------------------------------------------------------------------------
5. FRONTEND SETUP (CLIENT APP)
------------------------------------------------------------------------
The main user interface is located in /frontend/mediconnect.

Step 1: Install dependencies
cd frontend/mediconnect
npm install

Step 2: Start Development Server
npm run dev

Step 3: Access
Open http://localhost:3000 in your browser.

------------------------------------------------------------------------
6. DOCKER DEPLOYMENT (CONTAINERIZED)
------------------------------------------------------------------------
Alternatively, you can deploy the core stack using Docker Compose:

1. Ensure Docker is running.
2. From the project root, run:
   docker-compose up --build

Note: The current docker-compose covers the Gateway, Appointment, and 
Payment services. Other services should be started manually or 
added to the compose file.

------------------------------------------------------------------------
7. EXTERNAL INTEGRATIONS
------------------------------------------------------------------------
- Telemedicine: Uses Jitsi Meet (https://meet.jit.si).
- Payments: Uses PayHere Sandbox configuration.
- Notifications: 
    - Email: Configured via Nodemailer (SMTP).
    - SMS/WhatsApp: Configured via Twilio.
    - Admin Notifications: Restricted to +94776049950.

------------------------------------------------------------------------
MediConnect — Advanced Agentic Coding
========================================================================
