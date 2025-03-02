const express = require("express");
const User = require("./passResets-model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const router = express.Router();

// Send email to reset password
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
        text: `To reset your password, please click the link below:\n\n${process.env.UI_URL_PROD}reset-password/${resetToken}\n\nThis link will expire in 10 minutesss.`,
    };

    return transporter.sendMail(mailOptions);
};

// Request a password reset
router.post("/", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Step 1: Generate the plain reset token (this is the token we will send via email)
        const resetToken = crypto.randomBytes(32).toString("hex");
        console.log("Generate Reset Token before hashing:", resetToken);

        // Step 2: Hash the token (this will be stored in the database)
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Step 3: Token expiry time (10 minutes)
        const resetTokenExpiry = Date.now() + 10 * 60 * 1000;


        // Step 4: Store the hashed token in the database (not the plain token)
        await User.updateResetToken(email, resetTokenHash, resetTokenExpiry);
        console.log("Generate Reset Token after hashing:", resetToken);

        // Step 5: Send the plain reset token to the user via email
        await sendResetEmail(email, resetToken);

        console.log(
            `Stored hash ${resetTokenHash} with expiry ${resetTokenExpiry} for email ${email}`
        );

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
        console.log("User found by reset token:", user);

        if (!user) {
            return res
                .status(400)
                .json({ message: "Reset link has expired. Request a new one." });
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