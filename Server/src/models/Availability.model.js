import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
  start: String, // "10:00"
  end: String    // "11:00"
});

const availabilitySchema = new mongoose.Schema({
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  slots: [slotSchema]
});

export default mongoose.model("Availability", availabilitySchema);
