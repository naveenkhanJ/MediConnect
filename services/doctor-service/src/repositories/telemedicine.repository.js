import * as provider from "../providers/telemedicine.provider.js";


export const TelemedicineRepository = {
    createSession: (data) => AppointmentProvider.createSession(data),
    getSessionById: (id) => provider.getSessionById(id),
    getSessionByAppointmentId: (appointmentId) =>
    provider.getSessionByAppointmentId(appointmentId),
    startSession: (id) => provider.startSession(id),
    endSession: (id) => provider.endSession(id),
    cancelSession: (id) => provider.cancelSession(id),
    joinSession: (id) => provider.joinSession(id),
    listSessions: () => provider.listSessions(),
};
