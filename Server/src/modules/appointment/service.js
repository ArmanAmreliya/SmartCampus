
import Appointment from '../../models/Appointment.model.js';
import User from '../../models/User.model.js';

export const bookAppointment = async (studentId, facultyId, date, time, reason) => {
    const faculty = await User.findById(facultyId);
    if (!faculty) throw new Error('Faculty not found');

    if (faculty.status !== 'AVAILABLE') {
        throw new Error('Faculty is currently not available for appointments');
    }

    const appointment = await Appointment.create({
        studentId,
        facultyId,
        date,
        time,
        reason,
        status: 'Pending'
    });

    return await appointment.populate(['studentId', 'facultyId']);
};

export const getMyAppointments = async (userId, role) => {
    if (role === 'STUDENT') {
        return await Appointment.find({ studentId: userId }).populate(['studentId', 'facultyId']);
    } else {
        return await Appointment.find({ facultyId: userId }).populate(['studentId', 'facultyId']);
    }
};

export const updateAppointmentStatus = async (id, status, userId) => {
    const appointment = await Appointment.findById(id);
    if (!appointment) throw new Error('Appointment not found');

    // Verify ownership/permission? 
    // For now assuming resolver handles basic role check, strictly only facultyId should approve?
    // But strict requirement: "Appointment approval is controlled by faculty"
    if (appointment.facultyId.toString() !== userId) {
        throw new Error('Unauthorized');
    }

    appointment.status = status;
    await appointment.save();
    return await appointment.populate(['studentId', 'facultyId']);
};
