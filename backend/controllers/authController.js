import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc Register new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existing) {
      return res.status(400).json({ message: "Email or mobile already registered" });
    }

    const user = await User.create({ name, email, mobile, password });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login with email or mobile
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobile

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { mobile: identifier }],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get logged in user's profile
// @route GET /api/auth/profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// @desc Update logged in user's profile
// @route PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const fields = ["name", "address", "state", "district", "pincode", "profilePhoto"];
    const user = await User.findById(req.user._id);

    fields.forEach((f) => {
      if (req.body[f] !== undefined) user[f] = req.body[f];
    });

    const updated = await user.save();
    res.json(updated.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
