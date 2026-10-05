const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET LOGGED-IN USER PROFILE
router.get("/", authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: "Failed to load profile.",
            error: error.message
        });

    }

});


// UPDATE LOGGED-IN USER PROFILE
router.put("/", authMiddleware, async (req, res) => {

    try {

        const {
            name,
            course,
            year,
            careerGoal
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                name,
                course,
                year,
                careerGoal
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json({
            message: "Profile updated successfully!",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to update profile.",
            error: error.message
        });

    }

});


module.exports = router;