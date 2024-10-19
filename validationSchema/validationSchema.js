// validationSchemas.js
const { z } = require("zod");

// Define the schema for the register route
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Define the schema for the login route
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});



// Define the schema for creating a job post
const createJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(10, "Job description must be at least 10 characters"),
  experienceLevel: z.enum(["Junior", "Mid", "Senior"], {
    errorMap: () => ({ message: "Invalid experience level" }),
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date format",
  }), // Validate if the end date is a valid date
  candidates: z.array(z.string().email()).optional(), // Optional array of email addresses
});

module.exports = { registerSchema, loginSchema, createJobSchema };
