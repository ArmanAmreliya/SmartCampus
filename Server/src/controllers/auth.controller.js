import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password, // hashing later
      role,     // "student" | "faculty"
      department
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    //  MVP: Plain password (hashing later)
    if (user.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken({
      id: user._id,
      role: user.role
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
