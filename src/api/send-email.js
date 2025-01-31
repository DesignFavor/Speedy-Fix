import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, droppedObjects } = req.body;

  // Validate the request body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  if (!droppedObjects || !Array.isArray(droppedObjects) || droppedObjects.length === 0) {
    return res.status(400).json({ error: 'No objects selected to send.' });
  }

  const formattedObjects = droppedObjects.join(', ');

  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: 'New Contact Us Message',
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
      Dropped Objects: ${formattedObjects}
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}
