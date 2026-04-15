import env from "../config/env.js";
import { createLog } from "../repositories/notificationLog.repository.js";
import { getLogger } from "../utils/logger.util.js";
import nodemailer from "nodemailer";
import twilio from "twilio";

const logger = getLogger("notification.provider");

const persistLog = async (fields) => {
  return createLog({
    channel: fields.channel,
    toAddress: fields.toAddress,
    subject: fields.subject ?? null,
    body: fields.body ?? null,
    status: fields.status,
    appointmentId: fields.appointmentId ?? null,
    consultationSessionId: fields.consultationSessionId ?? null,
    errorMessage: fields.errorMessage ?? null,
  });
};

const hasSmtp = () =>
  Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass);

/**
 * Session booked / video link ready — email + SMS confirmations.
 * - If SMTP/Twilio env vars are present: sends real notifications
 * - Always writes an audit row to `notification_logs`
 */
export const sendSessionNotification = async (data) => {
  const {
    appointmentId,
    meetingLink,
    patientEmail = env.demoPatientEmail || "patient@example.com",
    patientPhone = env.demoPatientPhone || "+94700000000",
    doctorEmail = env.demoDoctorEmail || "doctor@example.com",
    consultationSessionId,
  } = data;

  const subject = `MediConnect — Video consultation (appointment #${appointmentId})`;
  const bodyText = `Your video consultation is scheduled.\nJoin here: ${meetingLink}\nAppointment ID: ${appointmentId}`;

  const smtpConfigured = hasSmtp();
  const twilioConfigured = Boolean(
    env.twilioAccountSid && env.twilioAuthToken && env.twilioFrom
  );

  let transporter = null;
  if (smtpConfigured) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: Number(env.smtpPort),
      secure: String(env.smtpSecure) === "true",
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  const twilioClient = twilioConfigured
    ? twilio(env.twilioAccountSid, env.twilioAuthToken)
    : null;

  const emailJobs = [
    { to: patientEmail, subject, text: bodyText },
    { to: doctorEmail, subject: `[Doctor] ${subject}`, text: bodyText },
  ];

  for (const job of emailJobs) {
    logger.info(
      "[EMAIL] to=%s subject=%s (smtp=%s)",
      job.to,
      job.subject,
      smtpConfigured
    );
    try {
      if (smtpConfigured && transporter) {
        await transporter.sendMail({
          from: env.smtpFrom || env.smtpUser,
          to: job.to,
          subject: job.subject,
          text: job.text,
        });
      }

      await persistLog({
        channel: "EMAIL",
        toAddress: job.to,
        subject: job.subject,
        body: job.text,
        status: "SENT",
        appointmentId,
        consultationSessionId,
      });
    } catch (e) {
      await persistLog({
        channel: "EMAIL",
        toAddress: job.to,
        subject: job.subject,
        body: job.text,
        status: "FAILED",
        appointmentId,
        consultationSessionId,
        errorMessage: e.message,
      });
      logger.error("Email send failed:", e.message);
    }
  }

  logger.info("[SMS] to=%s (twilio=%s)", patientPhone, twilioConfigured);
  const smsBody = `MediConnect: join your visit ${meetingLink}`;
  try {
    if (twilioConfigured && twilioClient) {
      await twilioClient.messages.create({
        from: env.twilioFrom,
        to: patientPhone,
        body: smsBody,
      });
    }

    await persistLog({
      channel: "SMS",
      toAddress: patientPhone,
      body: smsBody,
      status: "SENT",
      appointmentId,
      consultationSessionId,
    });
  } catch (e) {
    await persistLog({
      channel: "SMS",
      toAddress: patientPhone,
      body: smsBody,
      status: "FAILED",
      appointmentId,
      consultationSessionId,
      errorMessage: e.message,
    });
    logger.error("SMS send failed:", e.message);
  }

  return true;
};
