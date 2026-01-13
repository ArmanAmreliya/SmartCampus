import User from "../models/User.model.js";
import Broadcast from "../models/Broadcast.model.js";

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const getBroadcastStats = async (req, res) => {
  const count = await Broadcast.countDocuments();
  res.json({ totalBroadcasts: count });
};
