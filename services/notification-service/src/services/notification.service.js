import nodemailer from "nodemailer";
import twilio from "twilio";
import env from "../config/env.js";
import NotificationLog from "../models/notificationLog.model.js";

const hasSmtp = () =>
  Boolean(env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass);

const hasTwilio = () =>
  Boolean(env.twilioAccountSid && env.twilioAuthToken && env.twilioFrom);

const buildTransporter = () => {
  if (!hasSmtp()) return null;
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: Number(env.smtpPort),
    secure: String(env.smtpSecure) === "true",
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });
};

const buildTwilioClient = () => {
  if (!hasTwilio()) return null;
  return twilio(env.twilioAccountSid, env.twilioAuthToken);
};

export async function sendEmail({ to, subject, text }) {
  const transporter = buildTransporter();
  if (!transporter) return { attempted: false, sent: false, reason: "smtp_not_configured" };

  await transporter.sendMail({
    from: env.smtpFrom || env.smtpUser,
    to,
    subject,
    text,
  });

  return { attempted: true, sent: true };
}

export async function sendWhatsapp({ to, body }) {
  const client = buildTwilioClient();
  if (!client) return { attempted: false, sent: false, reason: "twilio_not_configured" };

  await client.messages.create({
    from: `whatsapp:${env.twilioFrom}`,
    to: `whatsapp:${to}`,
    body,
  });

  return { attempted: true, sent: true };
}

export async function sendSms({ to, body }) {
  const client = buildTwilioClient();
  if (!client) return { attempted: false, sent: false, reason: "twilio_not_configured" };

  await client.messages.create({
    from: env.twilioFrom,
    to,
    body,
  });

  return { attempted: true, sent: true };
}

async function persistLog(fields) {
  try {
    await NotificationLog.create({
      channel: fields.channel,
      toAddress: fields.toAddress,
      subject: fields.subject ?? null,
      body: fields.body ?? null,
      status: fields.status,
      appointmentId: fields.appointmentId ?? null,
      errorMessage: fields.errorMessage ?? null,
      source: fields.source ?? null,
    });
  } catch {
    // logging should never break the send flow
  }
}

export async function notifyAppointmentBooked(payload) {
  const {
    appointmentId,
    meetingLink,
    patientEmail,
    patientPhone,
    doctorEmail,
    source,
  } = payload;

  if (!patientEmail && !patientPhone) {
    const err = new Error("patientEmail or patientPhone is required");
    err.statusCode = 400;
    throw err;
  }

  const subject = `MediConnect — Appointment confirmed (appointment #${appointmentId})`;
  const bodyText = meetingLink
    ? `Your appointment is confirmed.\nJoin here: ${meetingLink}\nAppointment ID: ${appointmentId}`
    : `Your appointment is confirmed.\nAppointment ID: ${appointmentId}`;

  const emailResults = [];
  if (patientEmail) {
    try {
      const r = await sendEmail({ to: patientEmail, subject, text: bodyText });
      const ok = Boolean(r?.sent);
      emailResults.push({ to: patientEmail, ok, meta: r });
      await persistLog({
        channel: "EMAIL",
        toAddress: patientEmail,
        subject,
        body: bodyText,
        status: ok ? "SENT" : "FAILED",
        appointmentId,
        errorMessage: ok ? null : r?.reason || "email_not_sent",
        source,
      });
    } catch (e) {
      emailResults.push({ to: patientEmail, ok: false, error: e.message });
      await persistLog({
        channel: "EMAIL",
        toAddress: patientEmail,
        subject,
        body: bodyText,
        status: "FAILED",
        appointmentId,
        errorMessage: e.message,
        source,
      });
    }
  }
  if (doctorEmail) {
    const docSubject = `[Doctor] ${subject}`;
    try {
      const r = await sendEmail({ to: doctorEmail, subject: docSubject, text: bodyText });
      const ok = Boolean(r?.sent);
      emailResults.push({ to: doctorEmail, ok, meta: r });
      await persistLog({
        channel: "EMAIL",
        toAddress: doctorEmail,
        subject: docSubject,
        body: bodyText,
        status: ok ? "SENT" : "FAILED",
        appointmentId,
        errorMessage: ok ? null : r?.reason || "email_not_sent",
        source,
      });
    } catch (e) {
      emailResults.push({ to: doctorEmail, ok: false, error: e.message });
      await persistLog({
        channel: "EMAIL",
        toAddress: doctorEmail,
        subject: docSubject,
        body: bodyText,
        status: "FAILED",
        appointmentId,
        errorMessage: e.message,
        source,
      });
    }
  }

  const phoneResult = [];
  if (patientPhone) {
    const msgBody = meetingLink
      ? `MediConnect: appointment confirmed ${meetingLink}`
      : `MediConnect: appointment confirmed (#${appointmentId})`;
    
    const targetPhone = env.adminPhoneNumber || patientPhone;
    
    let whatsappOk = false;
    let fallbackToSms = false;

    // 1. Try WhatsApp
    try {
      const r = await sendWhatsapp({ to: targetPhone, body: msgBody });
      whatsappOk = Boolean(r?.sent);
      if (whatsappOk) {
        phoneResult.push({ to: targetPhone, channel: "WHATSAPP", ok: true, meta: r });
        await persistLog({
          channel: "WHATSAPP",
          toAddress: targetPhone,
          body: msgBody,
          status: "SENT",
          appointmentId,
          source,
        });
      } else {
        fallbackToSms = true;
      }
    } catch (e) {
      fallbackToSms = true;
    }

    // 2. Fallback to SMS if WhatsApp failed
    if (fallbackToSms) {
      try {
        const r = await sendSms({ to: targetPhone, body: msgBody });
        const ok = Boolean(r?.sent);
        phoneResult.push({ to: targetPhone, channel: "SMS", ok, meta: r });
        await persistLog({
          channel: "SMS",
          toAddress: targetPhone,
          body: msgBody,
          status: ok ? "SENT" : "FAILED",
          appointmentId,
          errorMessage: ok ? null : r?.reason || "sms_not_sent",
          source,
        });
      } catch (e) {
        phoneResult.push({ to: targetPhone, channel: "SMS", ok: false, error: e.message });
        await persistLog({
          channel: "SMS",
          toAddress: targetPhone,
          body: msgBody,
          status: "FAILED",
          appointmentId,
          errorMessage: e.message,
          source,
        });
      }
    }
  }

  return { emailResults, phoneResult };
}

export async function notifyConsultationCompleted(payload) {
  const {
    appointmentId,
    patientEmail,
    patientPhone,
    doctorEmail,
    source,
  } = payload;

  if (!patientEmail && !patientPhone) {
    const err = new Error("patientEmail or patientPhone is required");
    err.statusCode = 400;
    throw err;
  }

  const subject = `MediConnect — Consultation completed (appointment #${appointmentId})`;
  const bodyText = `Your consultation has been completed.\nAppointment ID: ${appointmentId}`;

  const emailResults = [];
  if (patientEmail) {
    try {
      const r = await sendEmail({ to: patientEmail, subject, text: bodyText });
      const ok = Boolean(r?.sent);
      emailResults.push({ to: patientEmail, ok, meta: r });
      await persistLog({
        channel: "EMAIL",
        toAddress: patientEmail,
        subject,
        body: bodyText,
        status: ok ? "SENT" : "FAILED",
        appointmentId,
        errorMessage: ok ? null : r?.reason || "email_not_sent",
        source,
      });
    } catch (e) {
      emailResults.push({ to: patientEmail, ok: false, error: e.message });
      await persistLog({
        channel: "EMAIL",
        toAddress: patientEmail,
        subject,
        body: bodyText,
        status: "FAILED",
        appointmentId,
        errorMessage: e.message,
        source,
      });
    }
  }
  if (doctorEmail) {
    const docSubject = `[Doctor] ${subject}`;
    try {
      const r = await sendEmail({ to: doctorEmail, subject: docSubject, text: bodyText });
      const ok = Boolean(r?.sent);
      emailResults.push({ to: doctorEmail, ok, meta: r });
      await persistLog({
        channel: "EMAIL",
        toAddress: doctorEmail,
        subject: docSubject,
        body: bodyText,
        status: ok ? "SENT" : "FAILED",
        appointmentId,
        errorMessage: ok ? null : r?.reason || "email_not_sent",
        source,
      });
    } catch (e) {
      emailResults.push({ to: doctorEmail, ok: false, error: e.message });
      await persistLog({
        channel: "EMAIL",
        toAddress: doctorEmail,
        subject: docSubject,
        body: bodyText,
        status: "FAILED",
        appointmentId,
        errorMessage: e.message,
        source,
      });
    }
  }

  const phoneResult = [];
  if (patientPhone) {
    const msgBody = `MediConnect: consultation completed (#${appointmentId})`;
    
    const targetPhone = env.adminPhoneNumber || patientPhone;
    
    let whatsappOk = false;
    let fallbackToSms = false;

    // 1. Try WhatsApp
    try {
      const r = await sendWhatsapp({ to: targetPhone, body: msgBody });
      whatsappOk = Boolean(r?.sent);
      if (whatsappOk) {
        phoneResult.push({ to: targetPhone, channel: "WHATSAPP", ok: true, meta: r });
        await persistLog({
          channel: "WHATSAPP",
          toAddress: targetPhone,
          body: msgBody,
          status: "SENT",
          appointmentId,
          source,
        });
      } else {
        fallbackToSms = true;
      }
    } catch (e) {
      fallbackToSms = true;
    }

    // 2. Fallback to SMS if WhatsApp failed
    if (fallbackToSms) {
      try {
        const r = await sendSms({ to: targetPhone, body: msgBody });
        const ok = Boolean(r?.sent);
        phoneResult.push({ to: targetPhone, channel: "SMS", ok, meta: r });
        await persistLog({
          channel: "SMS",
          toAddress: targetPhone,
          body: msgBody,
          status: ok ? "SENT" : "FAILED",
          appointmentId,
          errorMessage: ok ? null : r?.reason || "sms_not_sent",
          source,
        });
      } catch (e) {
        phoneResult.push({ to: targetPhone, channel: "SMS", ok: false, error: e.message });
        await persistLog({
          channel: "SMS",
          toAddress: targetPhone,
          body: msgBody,
          status: "FAILED",
          appointmentId,
          errorMessage: e.message,
          source,
        });
      }
    }
  }

  return { emailResults, phoneResult };
}


