import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API route to send email
app.post('/send-email', (req, res) => {
  const { name, email, message, droppedObjects } = req.body;

  console.log('Request body:', req.body);

  // Validate droppedObjects
  if (!droppedObjects || !Array.isArray(droppedObjects) || droppedObjects.length === 0) {
    return res.status(400).json({ error: 'No objects selected to send' });
  }

  const formattedObjects = droppedObjects.join(', ');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: 'New Contact Us Message',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nDropped Objects: ${formattedObjects}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Email sent successfully!' });
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
