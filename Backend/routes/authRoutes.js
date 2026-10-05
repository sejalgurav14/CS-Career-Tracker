const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, course, year, careerGoal } = req.body;

        if (!name || !email || !password) {
    return res.status(400).json({
        message: "Name, email and password are required."
    });
}

if (name.trim().length < 2) {
    return res.status(400).json({
        message: "Name must contain at least 2 characters."
    });
}

if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).json({
        message: "Please enter a valid email address."
    });
}

if (password.length < 6) {
    return res.status(400).json({
        message: "Password must be at least 6 characters long."
    });
}

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            course,
            year,
            careerGoal
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful!",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed.",
            error: error.message
        });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).json({
        message: "Email and password are required."
    });
}

const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { userId: user._id },
           process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                course: user.course,
                year: user.year,
                careerGoal: user.careerGoal
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
});

module.exports = router;