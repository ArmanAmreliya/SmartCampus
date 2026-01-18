import mongoose from "mongoose";

const facultyStatusSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "BUSY", "NOT_AVAILABLE"],
        default: "AVAILABLE"
    },
    nextAvailableAt: {
        type: Date
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model("FacultyStatus", facultyStatusSchema);
