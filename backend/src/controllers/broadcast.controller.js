import Broadcast from "../models/Broadcast.model.js";

export const createBroadcast = async (req, res) => {
  const { message, department } = req.body;

  const broadcast = await Broadcast.create({
    facultyId: req.user.id,
    message,
    department: department || "ALL"
  });

  res.json({
    message: "Broadcast sent successfully",
    broadcast
  });
};

export const getBroadcasts = async (req, res) => {
  const { department } = req.query;

  const filter = department
    ? { $or: [{ department }, { department: "ALL" }] }
    : {};

  const broadcasts = await Broadcast.find(filter)
    .sort({ createdAt: -1 })
    .populate("facultyId", "name");

  res.json(broadcasts);
};
