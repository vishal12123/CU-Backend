const mongoose = require("mongoose");

const {z} = require("zod");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  endDate: { type: Date, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  candidates: [{ type: String }], // Array of candidate emails
});

module.exports = mongoose.model("Job", jobSchema);
