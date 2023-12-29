const express = require('express');
const router = express.Router()
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'jdwebservices1@gmail.com',
//     pass: 'mqvuugdphmzmoclh',
//   },
// });

// Generate a random temporary password
// function generateTempPassword(length = 8) {
//   const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//   let password = '';
//   for (let i = 0; i < length; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// }

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  console.log('Received email:', email);
  try {
    const user = await User.findOne({ email });
    console.log('Retrieved user:', user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expiry time (e.g., 1 hour)
    await user.save();

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "Gmail",
    secure: false,
    auth: {
        user: "jdwebservices1@gmail.com",
        pass: "cwoxnbrrxvsjfbmr"
    },
    tls:{
      rejectUnauthorized: false
    }
    });

    const mailOptions = {
      from: 'your_email@example.com',
      to: user.email,
      subject: 'Reset your password',
      text: `You are receiving this because you (or someone else) have requested to reset your password.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${req.headers.origin}/reset-password/${resetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Reset password email sent' });
  } catch (error) {
    console.error('Error finding user or sending email:', error);
    return res.status(500).json({ message: 'Error finding user or sending email' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { resetPasswordToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() } // Check if the token is still valid
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error resetting password' });
  }
});


// router.post("/resetpassword",[
//     body('email').isEmail()
// ],async (req,res) =>{
//   const { email } = req.body;
//   User.findOne({ email }, (err, user) => {
//     if (err) {
//       console.log('Error finding user:', err);
//       return res.status(500).send('An error occurred');
//     }

//     if (!user) {
//       // Email not found
//       return res.status(404).send('User not found');
//     }

//     // Generate a temporary password
//     const tempPassword = generateTempPassword();

//     // Hash the temporary password
//     bcrypt.genSalt(10, (err, salt) => {
//       if (err) {
//         console.log('Error generating salt:', err);
//         return res.status(500).send('An error occurred');
//       }

//       bcrypt.hash(tempPassword, salt, (err, hash) => {
//         if (err) {
//           console.log('Error hashing password:', err);
//           return res.status(500).send('An error occurred');
//         }

//         // Save the hashed temporary password in the database
//         user.password = hash;
//         user.save((err) => {
//           if (err) {
//             console.log('Error updating password:', err);
//             return res.status(500).send('An error occurred');
//           }

//           // Send the temporary password to the user's email
//           const mailOptions = {
//             from: 'your_email_address',
//             to: email,
//             subject: 'Password Reset',
//             text: `Your temporary password is: ${tempPassword}`,
//           };

//           transporter.sendMail(mailOptions, (err) => {
//             if (err) {
//               console.log('Error sending email:', err);
//               return res.status(500).send('An error occurred from email');
//             }

//             return res.status(200).send('Temporary password sent');
//           });
//         });
//       });
//     });
//   });


// });

module.exports = router;