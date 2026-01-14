import Availability from "../models/Availability.model.js";
import User from "../models/User.model.js";

export const setAvailability = async (req, res) => {
  const { slots } = req.body;
  const date = new Date().toISOString().slice(0, 10);

  const availability = await Availability.findOneAndUpdate(
    { facultyId: req.user.id, date },
    { slots },
    { upsert: true, new: true }
  );

  res.json({ message: "Availability saved", availability });
};

export const getFacultyStatus = async (req, res) => {
  const { department } = req.query;
  const date = new Date().toISOString().slice(0, 10);

  const faculties = await User.find({ role: "faculty", department });

  const result = await Promise.all(
    faculties.map(async (faculty) => {
      const availability = await Availability.findOne({
        facultyId: faculty._id,
        date
      });

      let status = "Not Available";

      if (availability?.slots?.length) {
        const now = new Date().toTimeString().slice(0, 5);
        status = availability.slots.some(
          (s) => now >= s.start && now <= s.end
        )
          ? "Available"
          : "Busy";
      }

      return {
        facultyId: faculty._id,
        name: faculty.name,
        status
      };
    })
  );

  res.json(result);
};
