
import Broadcast from '../../models/Broadcast.model.js';

export const getAllBroadcasts = async () => {
    return await Broadcast.find().populate('facultyId').sort({ createdAt: -1 });
};

export const createBroadcast = async (facultyId, message, department) => {
    const broadcast = await Broadcast.create({
        facultyId,
        message,
        department: department || 'ALL'
    });
    return await broadcast.populate('facultyId');
};
