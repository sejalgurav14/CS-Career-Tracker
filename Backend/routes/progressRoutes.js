const express = require("express");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET USER PROGRESS
router.get("/", authMiddleware, async (req, res) => {

    try {

        let progress = await Progress.findOne({
            userId: req.userId
        });

        if (!progress) {

            progress = new Progress({
                userId: req.userId,
                completedTopics: [],
                overallProgress: 0
            });

            await progress.save();
        }

        res.json(progress);

    } catch (error) {

        res.status(500).json({
            message: "Failed to load progress.",
            error: error.message
        });

    }

});


// SAVE USER PROGRESS
router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            completedTopics,
            overallProgress
        } = req.body;

        let progress = await Progress.findOne({
            userId: req.userId
        });

        if (!progress) {

            progress = new Progress({
                userId: req.userId
            });

        }

        progress.completedTopics = completedTopics || [];
        progress.overallProgress = overallProgress || 0;

        await progress.save();

        res.json({
            message: "Progress saved successfully!",
            progress
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to save progress.",
            error: error.message
        });

    }

});


module.exports = router;