const express = require("express");
const QuizResult = require("../models/QuizResult");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// SAVE QUIZ RESULT
router.post("/", authMiddleware, async (req, res) => {

    try {

        const {
            subject,
            score,
            totalQuestions
        } = req.body;

        if (!subject || score === undefined || !totalQuestions) {
            return res.status(400).json({
                message: "Subject, score and total questions are required."
            });
        }

        const quizResult = new QuizResult({
            userId: req.userId,
            subject: subject,
            score: score,
            totalQuestions: totalQuestions
        });

        await quizResult.save();

        res.status(201).json({
            message: "Quiz result saved successfully!",
            result: quizResult
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to save quiz result.",
            error: error.message
        });

    }

});


// GET QUIZ RESULTS FOR LOGGED-IN USER
router.get("/", authMiddleware, async (req, res) => {

    try {

        const results = await QuizResult.find({
            userId: req.userId
        }).sort({
            createdAt: -1
        });

        res.json(results);

    } catch (error) {

        res.status(500).json({
            message: "Failed to load quiz results.",
            error: error.message
        });

    }

});


module.exports = router;