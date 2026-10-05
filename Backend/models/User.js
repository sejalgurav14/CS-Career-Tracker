const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        course: {
            type: String,
            default: "Computer Science Engineering"
        },

        year: {
            type: String,
            default: "3rd Year"
        },

        careerGoal: {
            type: String,
            default: "Software Developer"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);