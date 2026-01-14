import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
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
  notified: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Request", requestSchema);
