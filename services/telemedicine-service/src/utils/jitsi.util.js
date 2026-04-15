import env from "../config/env.js";
import { getLogger } from "./logger.util.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const logger = getLogger("jitsi.util");

/**
 * Generate a secure Jitsi meeting room ID
 * Format: alphanumeric only, no special characters
 */
export const generateJitsiRoomId = () => {
  // Use UUID to ensure uniqueness across processes/hosts.
  // Jitsi allows hyphens; keep it lowercase and URL-safe.
  const uuid = crypto.randomUUID
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");
  const roomId = `mc-${uuid}`.toLowerCase();
  logger.info("Generated Jitsi room ID:", roomId);
  return roomId;
};

/**
 * Generate Jitsi meeting link
 * @param {string} roomId - The room ID
 * @returns {string} - The full meeting link
 */
export const generateJitsiMeetingLink = (roomId) => {
  const meetingLink = `${env.jitsiBaseUrl}/${roomId}`;
  logger.info("Generated meeting link:", meetingLink);
  return meetingLink;
};

/**
 * Generate JWT token for secure Jitsi room (optional - for self-hosted Jitsi)
 * @param {Object} params - Token parameters
 * @returns {string|null} - JWT token or null if not configured
 */
export const generateJitsiJWT = (params = {}) => {
  try {
    const { roomId, userId, userEmail, userName } = params;

    // Only generate JWT if secret is configured
    if (!env.jitsiAppSecret) {
      logger.warn("Jitsi app secret not configured, skipping JWT generation");
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        context: {
          user: {
            id: userId || "unknown",
            email: userEmail || "user@example.com",
            name: userName || "Guest",
          },
        },
        aud: "jitsi",
        iss: env.jitsiAppId || "jitsi",
        sub: env.jitsiBaseUrl,
        room: roomId,
        exp: now + 24 * 60 * 60, // 24 hours expiry
      },
      env.jitsiAppSecret
    );

    logger.info("Generated Jitsi JWT token successfully");
    return token;
  } catch (error) {
    logger.error("Error generating Jitsi JWT:", error.message);
    return null;
  }
};

/**
 * Create a complete Jitsi meeting configuration
 * @param {Object} params - Meeting parameters
 * @returns {Object} - Meeting configuration
 */
export const createJitsiMeeting = (params = {}) => {
  try {
    const {
      appointmentId,
      doctorId,
      patientUserId,
      doctorName = "Doctor",
      patientName = "Patient",
    } = params;

    logger.info("Creating Jitsi meeting with params:", {
      appointmentId,
      doctorId,
      patientUserId,
    });

    const roomId = generateJitsiRoomId();
    const meetingLink = generateJitsiMeetingLink(roomId);
    const jwt = generateJitsiJWT({
      roomId,
      userId: `doctor-${doctorId}`,
      userName: doctorName,
      userEmail: `doctor${doctorId}@mediconnect.com`,
    });

    const meetingConfig = {
      roomId,
      meetingLink,
      jwt,
      appointmentId,
      doctorId,
      patientUserId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      jitsiSettings: {
        baseUrl: env.jitsiBaseUrl,
        room: roomId,
        displayName: doctorName,
      },
    };

    logger.info("Jitsi meeting configuration created:", {
      roomId: meetingConfig.roomId,
      link: meetingConfig.meetingLink,
    });

    return meetingConfig;
  } catch (error) {
    logger.error("Error creating Jitsi meeting:", error.message);
    throw error;
  }
};

/**
 * Generate meeting link with optional JWT parameter
 * @param {string} roomId - The room ID
 * @param {string} jwt - Optional JWT token
 * @returns {string} - Meeting link with JWT
 */
export const getSecureMeetingLink = (roomId, jwt) => {
  let link = generateJitsiMeetingLink(roomId);

  if (jwt) {
    link = `${link}?jwt=${jwt}`;
    logger.info("Generated secure meeting link with JWT");
  }

  return link;
};

/**
 * Validate a Jitsi meeting room ID format
 * @param {string} roomId - The room ID to validate
 * @returns {boolean} - True if valid
 */
export const isValidJitsiRoomId = (roomId) => {
  // Jitsi room IDs should be alphanumeric, hyphens allowed
  const pattern = /^[a-zA-Z0-9-]+$/;
  return pattern.test(roomId) && roomId.length > 0;
};

export default {
  generateJitsiRoomId,
  generateJitsiMeetingLink,
  generateJitsiJWT,
  createJitsiMeeting,
  getSecureMeetingLink,
  isValidJitsiRoomId,
};
