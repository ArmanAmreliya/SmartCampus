import mongoose from "mongoose";

const dateOverrideSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    slots: [{
        startTime: String,
        endTime: String,
        label: String
    }],
    isDayOff: { type: Boolean, default: false },
    note: String
}, { timestamps: true });

// Ensure unique override per faculty per date
dateOverrideSchema.index({ facultyId: 1, date: 1 }, { unique: true });

export default mongoose.model("DateOverride", dateOverrideSchema);
