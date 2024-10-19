const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendVerificationEmail = async (email, token) => {
  if (!email) {
    throw new Error("No recipients defined");
  }
  const verificationUrl = token;
  console.log(`Verifying ${verificationUrl}`);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email, // Ensure the recipient is correctly defined
    subject: "Email Verification",
    text: `Please verify your email by clicking this link: ${verificationUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};



exports.sendJobAlert = async (candidates, job, senderName, senderEmail) => {
  const subject = `New Job Posting: ${job.title}`;
  const message = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
            padding: 20px;
            margin: 0;
        }
        .email-container {
            max-width: 650px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #2c3e50;
            font-size: 26px;
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            color: #4d4d4d;
            line-height: 1.8;
        }
        .job-info {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .job-info p {
            margin: 8px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #2980b9;
            color: #ffffff;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
        }
        .cta-button:hover {
            background-color: #21618c;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #7f8c8d;
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Exciting Job Opportunity Awaits You from ${senderName}!</h1>
        <p>Hello,</p>
        <p>We are thrilled to inform you about a brand-new opportunity at one of our top companies, <strong>${job.company}</strong>. If you are looking to further your career with a role that offers challenging work, growth, and the chance to make an impact, this might just be the perfect match for you!</p>

        <div class="job-info">
            <p><strong>Job Title:</strong> ${job.title}</p>
            <p><strong>Job Description:</strong> ${job.description}</p>
            <p><strong>Experience Level:</strong> ${job.experienceLevel}</p>
            <p><strong>Application Deadline:</strong> ${job.endDate}</p>
            <p><strong>Company:</strong> ${job.company}</p>
        </div>

        <p>This role requires a candidate with a passion for innovation and the ability to thrive in a dynamic, fast-paced environment. We are looking for individuals who are motivated to bring fresh ideas to the table, excel at collaborative work, and possess the technical expertise to drive projects forward.</p>

        <p><strong>Why Join ${job.company}?</strong></p>
        <ul>
            <li>Collaborative and inclusive work culture</li>
            <li>Opportunities for personal and professional growth</li>
            <li>Competitive salary and benefits package</li>
            <li>Access to cutting-edge technologies and industry-leading professionals</li>
        </ul>

        <p>If this opportunity resonates with your career goals, we encourage you to take the next step. Click the link below to explore the role further and submit your application. Don’t miss your chance to join a company that values your skills and is committed to your success!</p>

        <a href="#" class="cta-button">Apply Now</a>

        <p>If you have any questions or need additional information, feel free to contact us directly at <strong>${senderEmail}</strong>. We're here to help you make the best decision for your career.</p>

        <div class="footer">
            <p>Best regards,</p>
            <p><strong>${senderName}</strong></p>
            <p>Email: <a href="mailto:${senderEmail}">${senderEmail}</a></p>
        </div>
    </div>
</body>
</html>

  `;

  const emails = candidates.join(", "); // Join candidate emails into a single string

  const mailOptions = {
    from: senderEmail, // Sender's email address
    to: emails, // List of recipients
    subject: subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Job alert email sent successfully!");
  } catch (error) {
    console.error("Error sending job alert email:", error);
  }
};

