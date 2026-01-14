import Appointment from "../models/Appointment.model.js";

export const requestAppointment = async (req, res) => {
  const { facultyId, reason } = req.body;

  const appointment = await Appointment.create({
    studentId: req.user.id,
    facultyId,
    reason
  });

  res.json({ message: "Appointment requested", appointment });
};

export const updateAppointment = async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json({ message: "Appointment updated", appointment });
};

export const getFacultyAppointments = async (req, res) => {
  const appointments = await Appointment.find({
    facultyId: req.user.id
  }).populate("studentId", "name");

  res.json(appointments);
};
