
import User from '../../models/User.model.js';

import FacultyStatus from '../../models/FacultyStatus.model.js';

export const getFaculties = async () => {
    const users = await User.find({ role: 'FACULTY' });
    // Manually attach availability for service consumers like chatbot
    const facultiesWithStatus = await Promise.all(users.map(async (user) => {
        const status = await FacultyStatus.findOne({ facultyId: user._id });
        return {
            ...user.toObject(),
            availability: status || { status: 'AVAILABLE' }
        };
    }));
    return facultiesWithStatus;
};

export const getFacultyById = async (id) => {
    return await User.findById(id);
};

export const updateStatus = async (id, status) => {
    // status comes from enum FacultyStatus { AVAILABLE, BUSY, ON_LEAVE }
    return await User.findByIdAndUpdate(id, { status }, { new: true });
};
