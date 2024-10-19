const jwt = require("jsonwebtoken");
const Company = require("../models/companyModel");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Fetch company details from the database using the id from the token

    const company = await Company.findById(decoded.company.id);

    if (!company) {
      return res
        .status(401)
        .json({ msg: "Company not found, authorization denied" });
    } // Attach full company data to req.company

    req.company = company;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
