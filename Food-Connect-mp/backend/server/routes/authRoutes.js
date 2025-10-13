import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import NGO from "../models/NGO.js";

const router = express.Router();


// ---------------- REGISTER ----------------

// Common Register Handler
const handleRegister = async (req, res, role) => {
  try {
    const { name, email, password } = req.body;

    // check existing
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: `${role} already registered with this email` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Users collection
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Create corresponding record in Restaurant or NGO collection
    if (role === "restaurant") {
      await Restaurant.create({
        userId: user._id,
        name,
        email,
        donations: []
      });
    } else if (role === "ngo") {
      await NGO.create({
        userId: user._id,
        name,
        email,
        requests: []
      });
    }

    res.status(201).json({ message: `${role} registered successfully`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// NGO Register
router.post("/register-ngo", (req, res) => handleRegister(req, res, "ngo"));

// Restaurant Register
router.post("/register-restaurant", (req, res) => handleRegister(req, res, "restaurant"));


// ---------------- LOGIN ----------------

// Common Login Handler
const handleLogin = async (req, res, role) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: `${role} not found or invalid role` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// NGO Login
router.post("/login-ngo", (req, res) => handleLogin(req, res, "ngo"));

// Restaurant Login
router.post("/login-restaurant", (req, res) => handleLogin(req, res, "restaurant"));


export default router;
