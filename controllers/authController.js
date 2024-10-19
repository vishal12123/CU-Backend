const Company = require("../models/companyModel");
const bcrypt = require("bcryptjs"); // Add bcrypt for password hashing
const jwt = require("jsonwebtoken");
const emailService = require("../utils/emailService");
const {
  registerSchema,
  loginSchema,
} = require("../validationSchema/validationSchema");
const { z } = require("zod");

// Register a new company
exports.register = async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  const { name, email, phone, password } = validatedData;

  try {
    let company = await Company.findOne({ email });
    if (company) {
      return res.status(400).json({ msg: "Company already exists" });
    }

  

    // Create a new company with hashed password
    company = new Company({ name, email, phone, password});

    await company.save();

    // Generate a verification token
    const verificationToken = jwt.sign(
      { email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send verification email
    const verificationUrl = `http://localhost:5000/api/auth/verify/${verificationToken}`;
    await emailService.sendVerificationEmail(company.email, verificationUrl);

    res
      .status(201)
      .json({ msg: "Company registered, please verify your email" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
};

// Verify company email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findOne({ email: decoded.email });

    if (!company) {
      return res
        .status(400)
        .json({ msg: "Invalid token or company not found" });
    }

    // Mark email as verified
    company.isVerified = true;
    await company.save();

    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Verification failed", error: err.message });
  }
};

// Login a company
exports.login = async (req, res) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ msg: "Company does not have credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      company: {
        id: company.id,
        isVerified: company.isVerified,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
};

// Logout (Client clears token)
exports.logout = (req, res) => {
  res.status(200).json({ msg: "Logged out successfully" });
};
