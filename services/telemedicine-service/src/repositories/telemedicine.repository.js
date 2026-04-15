import ConsultationSession from "../models/consultationSession.model.js";
import sequelize from "../config/database.js";
import { getLogger } from "../utils/logger.util.js";

const logger = getLogger("telemedicine.repository");

export const createSession = async (data) => {
  try {
    logger.info("Creating consultation session with data:", data);
    
    // Create the session using Sequelize
    const session = await ConsultationSession.create(data);
    logger.info("Session object created in memory:", session.toJSON());
    
    // Force a flush to the database
    if (session.save) {
      await session.save();
      logger.info("Session explicitly saved");
    }
    
    // Verify with a raw SQL query
    const [results] = await sequelize.query(
      'SELECT * FROM consultation_sessions WHERE id = ?',
      { replacements: [session.id] }
    );
    
    logger.info("Database verification - found records:", results.length);
    if (results.length > 0) {
      logger.info("✓ Data confirmed in database:", results[0]);
      return session;
    } else {
      logger.error("✗ CRITICAL: Data NOT found in database after create!");
      logger.error("Database connection might be failing silently");
      return session; // Return the object even if not saved (for debugging)
    }
  } catch (error) {
    logger.error("Error creating consultation session:", error.message);
    logger.error("Full error:", error);
    throw error;
  }
};

export const findById = async (id) => {
  try {
    logger.info("Finding session by id:", id);
    const session = await ConsultationSession.findByPk(id);
    if (session) {
      logger.info("Session found:", session.toJSON());
    } else {
      logger.warn("Session not found for id:", id);
    }
    return session;
  } catch (error) {
    logger.error("Error finding session by id:", error.message);
    throw error;
  }
};

export const findByAppointmentId = async (appointmentId) => {
  try {
    logger.info("Finding session by appointmentId:", appointmentId);
    const session = await ConsultationSession.findOne({
      where: { appointmentId },
    });
    if (session) {
      logger.info("Session found for appointmentId:", session.toJSON());
    } else {
      logger.warn("Session not found for appointmentId:", appointmentId);
    }
    return session;
  } catch (error) {
    logger.error("Error finding session by appointmentId:", error.message);
    throw error;
  }
};

export const updateSession = async (id, updates) => {
  try {
    logger.info("Updating session with id:", id, "updates:", updates);
    const session = await ConsultationSession.findByPk(id);
    if (!session) {
      logger.warn("Session not found for update, id:", id);
      return null;
    }

    await session.update(updates);
    logger.info("Session updated successfully:", session.toJSON());
    return session;
  } catch (error) {
    logger.error("Error updating session:", error.message);
    throw error;
  }
};

export const getAllSessions = async () => {
  try {
    logger.info("Fetching all sessions");
    const sessions = await ConsultationSession.findAll({
      order: [["createdAt", "DESC"]],
    });
    logger.info("Found", sessions.length, "sessions");
    return sessions;
  } catch (error) {
    logger.error("Error fetching all sessions:", error.message);
    throw error;
  }
};