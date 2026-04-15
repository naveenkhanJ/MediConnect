import { v4 as uuidv4 } from "uuid";
import env from "../config/env.js";

export const generateRoomId = () => {
  return `ROOM_${uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase()}`;
};

export const generateMeetingLink = (roomId) => {
  return `${env.jitsiBaseUrl}/${roomId}`;
};