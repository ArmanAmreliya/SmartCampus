import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["STUDENT", "FACULTY", "ADMIN"],
    required: true,
    uppercase: true
  },
  enrollmentNo: {
    type: String,
    unique: true,
    sparse: true
  },
  facultyId: {
    type: String,
    unique: true,
    sparse: true
  },
  department: String,
  semester: Number,
  designation: String,
  status: {
    type: String,
    enum: ["AVAILABLE", "BUSY", "ON_LEAVE"],
    default: "AVAILABLE"
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
