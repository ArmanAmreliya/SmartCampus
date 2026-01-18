import mongoose from "mongoose";

const facultyNoteSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model("FacultyNote", facultyNoteSchema);
