const express = require("express");
const User = require("./passResets-model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const router = express.Router();

const sendResetEmail = async (email, resetToken) => {
    var transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD,
        },
    });

    var mailOptions = {
        from: `"FilmFaves Support" <${process.env.EMAIL_HOST_USER}>`,
        to: email,
        subject: "Password Reset Request",
        text: `To reset your password, please click the link below:\n\n${process.env.UI_URL_PROD}/reset-password/${resetToken}\n\nThis link will expire in 30 minutes.`,
    };

    return transporter.sendMail(mailOptions);
}

// Request a password reset
router.post("/", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

        await User.updateResetToken(email, resetToken, resetTokenExpiry);

        console.log(
            `Token ${resetToken} with expiry ${resetTokenExpiry} saved for email ${email}`
        ); // Debugging

        await sendResetEmail(email, resetToken);

        res.status(200).json({ message: "Password reset email sent!" });
    } catch (err) {
        res.status(500).json({
            message: `Failed to request password reset: ${err.message}`,
        });
    }
});


// Reset the password
router.post("/reset-password", async (req, res) => {
    const { resetToken, newPassword } = req.body;

    try {
        const user = await User.findByResetToken(resetToken);
        console.log("User found by reset token:", user); // Debugging

        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid or expired reset token" });
        }

        const userRecord = user.rows[0];

        // Adjusting expiry check
        if (Date.now() > userRecord.reset_password_token_expires) {
            return res.status(400).json({ message: "Reset token has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 5);
        await User.updatePassword(userRecord.id, hashedPassword);

        res.status(200).json({
            message: "Password has been successfully reset",
        });
    } catch (err) {
        res.status(500).json({
            message: `Failed to reset password: ${err.message}`,
        });
    }
});



module.exports = router;