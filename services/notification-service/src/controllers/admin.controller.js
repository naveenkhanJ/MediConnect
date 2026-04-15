import NotificationLog from "../models/notificationLog.model.js";
import { Op } from "sequelize";
import { sendEmail, sendSms } from "../services/notification.service.js";

export async function listNotificationLogs(req, res, next) {
  try {
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const where = {};
    if (req.query.channel && ["EMAIL", "SMS"].includes(req.query.channel)) {
      where.channel = req.query.channel;
    }
    if (req.query.status && ["SENT", "FAILED"].includes(req.query.status)) {
      where.status = req.query.status;
    }
    if (req.query.appointmentId) {
      where.appointmentId = String(req.query.appointmentId);
    }
    if (req.query.q) {
      const q = `%${String(req.query.q).trim()}%`;
      where[Op.or] = [
        { toAddress: { [Op.like]: q } },
        { subject: { [Op.like]: q } },
        { appointmentId: { [Op.like]: q } },
        { source: { [Op.like]: q } },
      ];
    }
    if (req.query.from || req.query.to) {
      where.createdAt = {};
      if (req.query.from) where.createdAt[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.createdAt[Op.lte] = new Date(req.query.to);
    }

    const { rows, count } = await NotificationLog.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    return res.status(200).json({
      success: true,
      data: rows,
      meta: { limit, offset, count },
    });
  } catch (e) {
    next(e);
  }
}

export async function resendNotification(req, res, next) {
  try {
    const row = await NotificationLog.findByPk(req.params.id);
    if (!row) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (row.channel === "EMAIL") {
      if (!row.subject || !row.body) {
        return res.status(400).json({
          success: false,
          message: "Cannot resend: missing subject/body",
        });
      }
      await sendEmail({ to: row.toAddress, subject: row.subject, text: row.body });
    } else if (row.channel === "SMS") {
      if (!row.body) {
        return res.status(400).json({
          success: false,
          message: "Cannot resend: missing body",
        });
      }
      await sendSms({ to: row.toAddress, body: row.body });
    }

    await NotificationLog.create({
      channel: row.channel,
      toAddress: row.toAddress,
      subject: row.subject,
      body: row.body,
      status: "SENT",
      appointmentId: row.appointmentId,
      source: "admin-resend",
      errorMessage: null,
    });

    return res.status(200).json({ success: true, message: "Resent" });
  } catch (e) {
    await NotificationLog.create({
      channel: "EMAIL",
      toAddress: "admin-resend",
      subject: "Resend failed",
      body: String(e?.message || "unknown error"),
      status: "FAILED",
      appointmentId: null,
      source: "admin-resend",
      errorMessage: String(e?.message || "unknown error"),
    }).catch(() => {});
    next(e);
  }
}

