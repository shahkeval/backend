import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import UserModelEmp from './model/users.js';
import UserModelAdmin from './model/admin.js';
import UserModelSalary from './model/salary.js';
import UserModelLeave from './model/leave.js';

// Load environment variables
dotenv.config();

// Create an Express application
const app = express();
const port = 8001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Routes

// Employees
app.get('/allEmps', async (req, res) => {
  try {
    const response = await UserModelEmp.find({});
    res.status(200).send(response);
  } catch (error) {
    console.error('Error while getting employees', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/Emp', async (req, res) => {
  try {
    const existingUser = await UserModelEmp.findOne({ id: req.body.id });
    if (existingUser) {
      return res.status(400).json({ error: 'User ID is not available' });
    }
    const newUser = await UserModelEmp.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error while creating employee', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteEmp/:id', async (req, res) => {
  try {
    const deletedEmployee = await UserModelEmp.findOneAndRemove({ id: req.params.id });
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/updateEmp/:id', async (req, res) => {
  try {
    const updatedUser = await UserModelEmp.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin
app.post('/Admin', async (req, res) => {
  try {
    const existingUser = await UserModelAdmin.findOne({ id: req.body.id });
    if (existingUser) {
      return res.status(400).json({ error: 'User ID is not available' });
    }
    const newUser = await UserModelAdmin.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/allAdmin', async (req, res) => {
  try {
    const response = await UserModelAdmin.find({});
    res.status(200).send(response);
  } catch (error) {
    console.error('Error while getting admins', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/deleteAdmin/:id', async (req, res) => {
  try {
    const deletedAdmin = await UserModelAdmin.findOneAndRemove({ id: req.params.id });
    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/updateAdmin/:id', async (req, res) => {
  try {
    const updatedUser = await UserModelAdmin.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Forgot and Reset Password for Admin
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModelAdmin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the following link to reset your password: https://yourdomain.com/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send email' });
      }
      res.status(200).json({ message: 'Password reset link sent' });
    });
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModelAdmin.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password; // Add proper password hashing if necessary
    user.resetPasswordToken = null;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in reset-password route:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
