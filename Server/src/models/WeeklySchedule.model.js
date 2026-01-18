import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    label: String
}, { _id: false });

const dayScheduleSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    slots: [timeSlotSchema],
    isDayOff: { type: Boolean, default: false }
}, { _id: false });

const weeklyScheduleSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    schedule: {
        type: [dayScheduleSchema],
        default: []
    }
}, { timestamps: true });

export default mongoose.model("WeeklySchedule", weeklyScheduleSchema);
