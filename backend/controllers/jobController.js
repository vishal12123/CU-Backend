const Job = require("../models/jobModel");
const Company = require("../models/companyModel");
const emailService = require("../utils/emailService");

const {z} = require("zod");

const {createJobSchema} = require("../validationSchema/validationSchema");

// Create a new job post
exports.createJob = async (req, res) => {
  const validatedData = createJobSchema.parse(req.body);

  const { title, description, experienceLevel, endDate, candidates } =
    validatedData;

  try {
    // Ensure the company is verified
    if (!req.company.isVerified) {
      return res
        .status(403)
        .json({ msg: "Company must be verified to post jobs." });
    }

     const userEmail = req.company.email;
     const userName = req.company.name;
     
    const newJob = new Job({
      title,
      description,
      experienceLevel,
      endDate,
      company: req.company.id,
      candidates,
    });

   



    await newJob.save();

    // Send job alert to candidates
    if (candidates && candidates.length > 0) {
      emailService.sendJobAlert(candidates, newJob,userName, userEmail);
    }

    res.status(201).json({ msg: "Job posted successfully", job: newJob });
  } catch (err) {
    if (err instanceof z.ZodError) {
      // Handle Zod validation errors
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
};
