import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    startTime: {
      type: String, // HH:MM
      required: true
    },
    endTime: {
      type: String, // HH:MM
      required: true
    },
    subject: {
      type: String, // "Reason" or "Subject"
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

// Index for efficient querying of appointments by faculty/date
appointmentSchema.index({ facultyId: 1, date: 1 });
appointmentSchema.index({ studentId: 1 });

export default mongoose.model("Appointment", appointmentSchema);
