
import Request from '../../models/Request.model.js';
import Availability from '../../models/Availability.model.js';
import { sendEmail } from '../../services/email.service.js';
import { getCurrentStatus } from '../../utils/status.util.js';

export const raiseNotificationRequest = async (studentId, facultyId) => {
    return await Request.create({
        studentId,
        facultyId
    });
};

export const checkAndNotify = async () => {
    const today = new Date().toISOString().slice(0, 10);

    const requests = await Request.find({ notified: false })
        .populate("studentId")
        .populate("facultyId");

    for (const req of requests) {
        const availability = await Availability.findOne({
            facultyId: req.facultyId._id,
            date: today
        });

        // We can also check global User status if we want to be smarter
        const status = getCurrentStatus(availability?.slots);

        if (status === "Available") {
            await sendEmail(
                req.studentId.email,
                "Faculty Available Now",
                `${req.facultyId.name} is now available. You may visit.`
            );

            req.notified = true;
            await req.save();
        }
    }
};
