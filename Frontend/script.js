// ===============================
// START JOURNEY
// ===============================

function startJourney() {

    alert("Welcome to your CS Career Journey! 🚀");

    updateProgress();
    updateCareerSummary();
}


// ===============================
// ROADMAP PROGRESS
// ===============================

async function completeTopic(button) {
    if (!checkLogin()) {
        return;
    }

    if (button.textContent.includes("Completed")) {
        return;
    }

    alert("You started this topic! 📚");

    button.textContent = "Completed ✓";

    button.style.background = "#171717";
    button.style.color = "white";

    updateProgress();

    updateContinueLearning();


    // ===============================
    // SAVE PROGRESS TO MONGODB
    // ===============================

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }


    // Get all completed topics

    const completedTopics = [];

    document.querySelectorAll(".topic button").forEach(function(topicButton) {

        if (topicButton.textContent.includes("Completed")) {

            completedTopics.push(
                topicButton.parentElement.querySelector("h4").textContent
            );

        }

    });


    // Calculate overall progress

    const topicButtons =
        document.querySelectorAll(".topic button");


    const totalTopics = topicButtons.length;

    let completed = 0;

    topicButtons.forEach(function(topicButton) {

        if (topicButton.textContent.includes("Completed")) {
            completed++;
        }

    });

    const overallProgress =
        Math.round((completed / totalTopics) * 100);


    // Send progress to backend

    try {

        const response = await fetch(
            "http://localhost:5000/api/progress",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    completedTopics: completedTopics,
                    overallProgress: overallProgress
                })
            }
        );


        const data = await response.json();

        console.log("Progress saved:", data);

    } catch (error) {

        console.error(
            "Failed to save progress:",
            error
        );

    }

}


function updateProgress() {

    const buttons = document.querySelectorAll(".topic button");

    let completed = 0;

    buttons.forEach(function(button) {

        if (button.textContent.includes("Completed")) {
            completed++;
        }

    });

    const total = buttons.length;

    const progress = Math.round((completed / total) * 100);

    document.querySelector(".progress-fill").style.width =
        progress + "%";

    document.querySelector(".percentage").textContent =
        progress + "%";

    document.getElementById("careerReadiness").textContent =
    progress + "%";

        // Update dashboard topic count
document.getElementById("topicsCompleted").textContent =
    completed;


    const phases = document.querySelectorAll(".phase");

    phases.forEach(function(phase) {

        const phaseButtons =
            phase.querySelectorAll(".topic button");

        let phaseCompleted = 0;

        phaseButtons.forEach(function(button) {

            if (button.textContent.includes("Completed")) {
                phaseCompleted++;
            }

        });

        const phaseProgress =
            Math.round(
                (phaseCompleted / phaseButtons.length) * 100
            );

        phase.querySelector(".phase-fill").style.width =
            phaseProgress + "%";

        phase.querySelector(".phase-title span").textContent =
            phaseProgress + "%";

    });
}

updateCareerSummary();


// ===============================
// QUIZ QUESTIONS
// ===============================

const quizData = {

    "Aptitude": [

        {
            question: "What is 20% of 200?",
            options: ["20", "30", "40", "50"],
            answer: "40"
        },

        {
            question: "If a train travels 60 km in 1 hour, how far will it travel in 3 hours?",
            options: ["120 km", "150 km", "180 km", "200 km"],
            answer: "180 km"
        },

        {
            question: "What comes next: 2, 4, 6, 8, ?",
            options: ["9", "10", "11", "12"],
            answer: "10"
        }

    ],


    "DSA": [

        {
            question: "Which data structure follows LIFO?",
            options: ["Queue", "Stack", "Array", "Tree"],
            answer: "Stack"
        },

        {
            question: "Which data structure follows FIFO?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            answer: "Queue"
        },

        {
            question: "Which algorithm is commonly used to find the shortest path?",
            options: [
                "Dijkstra",
                "Bubble Sort",
                "Binary Search",
                "Linear Search"
            ],
            answer: "Dijkstra"
        }

    ],


    "DBMS": [

        {
            question: "What does SQL stand for?",
            options: [
                "Structured Query Language",
                "Simple Query Language",
                "System Query Language",
                "Sequential Query Language"
            ],
            answer: "Structured Query Language"
        },

        {
            question: "Which command is used to retrieve data from a database?",
            options: [
                "INSERT",
                "UPDATE",
                "SELECT",
                "DELETE"
            ],
            answer: "SELECT"
        },

        {
            question: "Which key uniquely identifies a record?",
            options: [
                "Foreign Key",
                "Primary Key",
                "Candidate Key",
                "Alternate Key"
            ],
            answer: "Primary Key"
        }

    ],


    "Operating Systems": [

        {
            question: "Which of these is an operating system?",
            options: [
                "HTML",
                "Linux",
                "SQL",
                "Python"
            ],
            answer: "Linux"
        },

        {
            question: "Which scheduling algorithm uses a time quantum?",
            options: [
                "FCFS",
                "Round Robin",
                "SJF",
                "Priority"
            ],
            answer: "Round Robin"
        },

        {
            question: "What is a process?",
            options: [
                "A program in execution",
                "A programming language",
                "A database",
                "A file"
            ],
            answer: "A program in execution"
        }

    ]

};


// ===============================
// QUIZ VARIABLES
// ===============================

let currentSubject = "";

let currentQuestion = 0;

let score = 0;

let selectedAnswer = "";


// ===============================
// START PRACTICE
// ===============================

function startPractice(subject) {
    if (!checkLogin()) {
        return;
    }

    currentSubject = subject;

    currentQuestion = 0;

    score = 0;

    selectedAnswer = "";


    document.getElementById("quizSubject").textContent =
        subject;


    document.getElementById("quiz").scrollIntoView({
        behavior: "smooth"
    });


    loadQuestion();
}


// ===============================
// LOAD QUESTION
// ===============================

function loadQuestion() {

    const questions = quizData[currentSubject];

    const question = questions[currentQuestion];


    document.getElementById("questionNumber").textContent =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        questions.length;


    document.getElementById("questionText").textContent =
        question.question;


    const optionsContainer =
        document.getElementById("options");


    optionsContainer.innerHTML = "";


    selectedAnswer = "";


    question.options.forEach(function(option) {

        const button =
            document.createElement("button");


        button.textContent = option;


        button.className = "option";


        button.onclick = function() {

            selectAnswer(button, option);

        };


        optionsContainer.appendChild(button);

    });


    document.getElementById("nextButton").textContent =

        currentQuestion === questions.length - 1

        ? "Finish Quiz →"

        : "Next Question →";


    document.getElementById("nextButton").onclick =
        nextQuestion;


    document.getElementById("quizResult").textContent = "";

}


// ===============================
// SELECT ANSWER
// ===============================

function selectAnswer(button, answer) {

    const options =
        document.querySelectorAll(".option");


    options.forEach(function(option) {

        option.classList.remove("selected");

    });


    button.classList.add("selected");


    selectedAnswer = answer;

}


// ===============================
// NEXT QUESTION
// ===============================

function nextQuestion() {

    if (selectedAnswer === "") {

        alert("Please select an answer first.");

        return;

    }


    const questions = quizData[currentSubject];


    const correctAnswer =
        questions[currentQuestion].answer;


    if (selectedAnswer === correctAnswer) {

        score++;

    }


    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    }

    else {

        showResult();

    }

}
// ===============================
// AVERAGE QUIZ SCORE
// ===============================

function updateAverageScore() {

    const scores = [];

    const dsa = localStorage.getItem("dsaScore");
    const dbms = localStorage.getItem("dbmsScore");
    const aptitude = localStorage.getItem("aptitudeScore");
    const os = localStorage.getItem("osScore");


    if (dsa) {
        scores.push(convertScore(dsa));
    }

    if (dbms) {
        scores.push(convertScore(dbms));
    }

    if (aptitude) {
        scores.push(convertScore(aptitude));
    }

    if (os) {
        scores.push(convertScore(os));
    }


    if (scores.length === 0) {

        document.getElementById("averageScore").textContent =
            "0%";

        return;
    }


    const total = scores.reduce(function(sum, score) {

        return sum + score;

    }, 0);


    const average =
        Math.round(total / scores.length);


    document.getElementById("averageScore").textContent =
        average + "%";
}


function convertScore(scoreText) {

    const parts = scoreText.split("/");

    const score =
        Number(parts[0].trim());

    const total =
        Number(parts[1].trim());

    return Math.round(
        (score / total) * 100
    );
}

// ===============================
// SHOW RESULT
// ===============================

function showResult() {

    const questions = quizData[currentSubject];

    // Show quiz completed
    document.getElementById("questionText").textContent =
        "Quiz Completed! 🎉";

    document.getElementById("options").innerHTML = "";

    document.getElementById("questionNumber").textContent =
        "Your Result";

    const percentage = Math.round(
    (score / questions.length) * 100
);

let performanceMessage = "";

if (percentage >= 80) {
    performanceMessage = "Excellent performance! 🔥";
} else if (percentage >= 60) {
    performanceMessage = "Good job! Keep improving. 👍";
} else {
    performanceMessage = "Keep practicing! 📚";
}

document.getElementById("quizResult").textContent =
    "You scored " +
    score +
    " out of " +
    questions.length +
    " (" +
    percentage +
    "%)! " +
    performanceMessage;

    // Save DSA result
   if (currentSubject === "DSA") {
    const result = score + " / " + questions.length;

    document.getElementById("dsaScore").textContent =
        result;

    document.getElementById("practiceDSAScore").textContent =
        "Latest Score: " + result;
}


    // Save DBMS result
    if (currentSubject === "DBMS") {

        const result =
            score + " / " + questions.length;

        document.getElementById("dbmsScore").textContent =
            result;
    }


    // Save Aptitude result
    if (currentSubject === "Aptitude") {

        const result =
            score + " / " + questions.length;

        document.getElementById("aptitudeScore").textContent =
            result;
    }


    // Save Operating Systems result
    if (currentSubject === "Operating Systems") {
    const result = score + " / " + questions.length;

    document.getElementById("osScore").textContent =
        result;

    document.getElementById("practiceOSScore").textContent =
        "Latest Score: " + result;
}

    // Update average score
    updateAverageScore();
    updateCareerSummary();

    // ===============================
    // SAVE QUIZ RESULT TO MONGODB
    // ===============================

    const token = localStorage.getItem("token");

    if (token) {

        fetch("http://localhost:5000/api/quiz", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                subject: currentSubject,
                score: score,
                totalQuestions: questions.length
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            console.log("Quiz result saved:", data);

            loadQuizResults();

        })
        .catch(function(error) {

            console.error(
                "Failed to save quiz result:",
                error
            );

        });

    }


    // Restart button
    document.getElementById("nextButton").textContent =
        "Restart Quiz ↻";

    document.getElementById("nextButton").onclick =
        function() {

            startPractice(currentSubject);

        };

}

// ===============================
// CONTINUE LEARNING
// ===============================

function updateContinueLearning() {

    const phases = document.querySelectorAll(".phase");

    let foundTopic = false;

    for (let i = 0; i < phases.length; i++) {

        const phase = phases[i];

        const phaseName =
            phase.querySelector("h3").textContent;

        const topics =
            phase.querySelectorAll(".topic");

        for (let j = 0; j < topics.length; j++) {

            const topic = topics[j];

            const button =
                topic.querySelector("button");

            if (!button.textContent.includes("Completed")) {

                const topicName =
                    topic.querySelector("h4").textContent;

                document.getElementById("continuePhase").textContent =
                    phaseName;

                document.getElementById("continueTopic").textContent =
                    topicName;

                foundTopic = true;

                return;
            }
        }
    }

    // All topics completed
    if (!foundTopic) {

        document.getElementById("continuePhase").textContent =
            "All Phases Completed 🎉";

        document.getElementById("continueTopic").textContent =
            "You have completed your entire roadmap!";
    }
}


// Load Continue Learning when page opens
updateContinueLearning();

// ===============================
// CONTINUE BUTTON
// ===============================

function continueLearning() {

    const phases = document.querySelectorAll(".phase");

    for (let i = 0; i < phases.length; i++) {

        const topics =
            phases[i].querySelectorAll(".topic");

        for (let j = 0; j < topics.length; j++) {

            const button =
                topics[j].querySelector("button");

            if (!button.textContent.includes("Completed")) {

                topics[j].scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                return;
            }
        }
    }

    alert("🎉 You have completed the entire roadmap!");
}

// ===============================
// CAREER SUMMARY
// ===============================

function updateCareerSummary() {

    // Roadmap progress
    const progress =
        document.querySelector(".percentage").textContent;

    document.getElementById("summaryProgress").textContent =
        progress;


    // Topics completed
    const topics =
        document.getElementById("topicsCompleted").textContent;

    document.getElementById("summaryTopics").textContent =
        topics;


    // Average quiz score
    const average =
        document.getElementById("averageScore").textContent;

    document.getElementById("summaryAverage").textContent =
        average;
}


// Load summary when page opens
updateCareerSummary();

// ===============================
// EDIT PROFILE
// ===============================

async function editProfile() {

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
        alert("Please login first.");
        return;
    }

    const user = JSON.parse(savedUser);

    const name = prompt("Enter your name:", user.name);
    if (name === null) return;

    const course = prompt("Enter your course:", user.course);
    if (course === null) return;

    const year = prompt("Enter your year:", user.year);
    if (year === null) return;

    const careerGoal = prompt(
        "Enter your career goal:",
        user.careerGoal
    );

    if (careerGoal === null) return;

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(
            "http://localhost:5000/api/profile",
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    name: name,
                    course: course,
                    year: year,
                    careerGoal: careerGoal
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Profile update failed.");
            return;
        }

        // Update profile on the page
        document.getElementById("profileName").textContent =
            data.user.name;

        document.getElementById("profileCourse").textContent =
            data.user.course;

        document.getElementById("profileYear").textContent =
            data.user.year;

        document.getElementById("profileGoal").textContent =
            data.user.careerGoal;

        // Update logged-in user information
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        alert("Profile updated successfully! ✅");

    } catch (error) {

        console.error("Profile update error:", error);

        alert(
            "Cannot connect to the server. Make sure the backend is running."
        );
    }
}
// ===============================
// LOAD SAVED PROFILE
// ===============================

function loadProfile() {

    const savedName = localStorage.getItem("profileName");
    const savedYear = localStorage.getItem("profileYear");
    const savedGoal = localStorage.getItem("profileGoal");

    if (savedName) {
        document.getElementById("profileName").textContent = savedName;
    }

    if (savedYear) {
        document.getElementById("profileYear").textContent = savedYear;
    }

    if (savedGoal) {
        document.getElementById("profileGoal").textContent = savedGoal;
    }
}


// ===============================
// AUTHENTICATION
// ===============================

// Show Register Form
function showRegister() {
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("authMessage").textContent = "";
}


// Show Login Form
function showLogin() {
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("authMessage").textContent = "";
}


// Register User
async function registerUser() {

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const course = document.getElementById("registerCourse").value;
    const year = document.getElementById("registerYear").value;
    const careerGoal = document.getElementById("registerGoal").value;

    const message = document.getElementById("authMessage");

    if (!name || !email || !password) {
        message.textContent = "Please enter name, email and password.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password,
                    course,
                    year,
                    careerGoal
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            message.textContent =
                "Registration successful! You can now login.";

            document.getElementById("registerName").value = "";
            document.getElementById("registerEmail").value = "";
            document.getElementById("registerPassword").value = "";

            setTimeout(() => {
                showLogin();
            }, 1000);

        } else {

            message.textContent = data.message || "Registration failed.";

        }

    } catch (error) {

        message.textContent =
            "Cannot connect to the server. Make sure the backend is running.";

    }
}


// Login User
async function loginUser() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const message = document.getElementById("authMessage");

    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    message.textContent =
        "Login successful! Welcome " + data.user.name + " 🎉";

    loadLoggedInUser();
    loadProfileFromMongoDB();
    loadRoadmapProgress();
loadQuizResults();


    setTimeout(function() {

        document.querySelector(".hero").scrollIntoView({
            behavior: "smooth"
        });

    }, 500);

} else {

            message.textContent =
                data.message || "Login failed.";

        }

    } catch (error) {

        message.textContent =
            "Cannot connect to the server. Make sure the backend is running.";

    }
}

// ===============================
// LOAD LOGGED-IN USER PROFILE
// ===============================

function loadLoggedInUser() {

    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
        return;
    }

    const user = JSON.parse(savedUser);
    const dashboardGreeting =
    document.getElementById("dashboardGreeting");

const dashboardUserName =
    document.getElementById("dashboardUserName");

if (dashboardGreeting && user.name) {
    dashboardGreeting.textContent =
        "Welcome back, " + user.name + "!";
}

if (dashboardUserName) {
    dashboardUserName.textContent =
        "Keep building your skills and become industry ready.";
}
    const avatar = document.getElementById("profileAvatar");

if (avatar && user.name) {
    avatar.textContent = user.name.charAt(0).toUpperCase();
}

    if (document.getElementById("profileName")) {
        document.getElementById("profileName").textContent =
            user.name;
    if (document.getElementById("profileEmail")) {
    document.getElementById("profileEmail").textContent =
        user.email;
    }
    }

    if (document.getElementById("profileCourse")) {
        document.getElementById("profileCourse").textContent =
            user.course;
    }

    if (document.getElementById("profileYear")) {
        document.getElementById("profileYear").textContent =
            user.year;
    }

    if (document.getElementById("profileGoal")) {
        document.getElementById("profileGoal").textContent =
            user.careerGoal;
    }
}


// Load user when page opens
loadLoggedInUser();

// ===============================
// LOGOUT
// ===============================

function logoutUser() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("You have been logged out successfully.");

    showLogin();

    document.getElementById("auth").scrollIntoView({
        behavior: "smooth"
    });
}

// ===============================
// LOAD ROADMAP PROGRESS
// ===============================

async function loadRoadmapProgress() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/progress",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            console.log("Could not load roadmap progress.");
            return;
        }

        const data = await response.json();

        const completedTopics = data.completedTopics || [];

        document.querySelectorAll(".topic").forEach(function(topic) {

            const topicName =
                topic.querySelector("h4").textContent;

            const button =
                topic.querySelector("button");

            if (completedTopics.includes(topicName)) {

                button.textContent = "Completed ✓";

                button.style.background = "#171717";
                button.style.color = "white";
            }

        });

        updateProgress();
        updateContinueLearning();
        updateCareerSummary();

    } catch (error) {

        console.error(
            "Failed to load roadmap progress:",
            error
        );

    }
}

loadRoadmapProgress();

// ===============================
// LOGIN NAVIGATION
// ===============================

function showLoginAndScroll() {

    showLogin();

    document.getElementById("auth").scrollIntoView({
        behavior: "smooth"
    });

}

// ===============================
// LOAD QUIZ RESULTS FROM MONGODB
// ===============================

async function loadQuizResults() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/quiz",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            console.log("Could not load quiz results.");
            return;
        }

        const results = await response.json();
        // Get total quiz attempts from MongoDB
const attempts = results.length;

document.getElementById("quizAttempts").textContent =
    attempts;

document.getElementById("summaryAttempts").textContent =
    attempts;

// Calculate average score from MongoDB

// Calculate average score from all quiz attempts

let totalPercentage = 0;

results.forEach(function(result) {

    const percentage =
        (result.score / result.totalQuestions) * 100;

    totalPercentage += percentage;

});

const latestSubjects = {};

results.forEach(function(result) {

    const existing = latestSubjects[result.subject];

    if (
        !existing ||
        new Date(result.createdAt) > new Date(existing.createdAt)
    ) {
        latestSubjects[result.subject] = result;
    }

});

Object.values(latestSubjects).forEach(function(result) {

    const scoreText =
        result.score + " / " + result.totalQuestions;

    if (result.subject === "DSA") {

    document.getElementById("dsaScore").textContent =
        scoreText;

    const practiceDSAScore =
        document.getElementById("practiceDSAScore");

    if (practiceDSAScore) {
        practiceDSAScore.textContent =
            "Latest Score: " + scoreText;
    }

    const dsaResults =
        results.filter(function(item) {
            return item.subject === "DSA";
        });

    let bestScore = 0;
    let bestTotal = result.totalQuestions;

    dsaResults.forEach(function(item) {

        const itemPercentage =
            item.score / item.totalQuestions;

        if (itemPercentage > bestScore) {
            bestScore = itemPercentage;
            bestTotal = item.totalQuestions;
        }
    });

    const bestScoreText =
        Math.round(bestScore * bestTotal) +
        " / " +
        bestTotal;

    const practiceDSABest =
        document.getElementById("practiceDSABest");

    if (practiceDSABest) {
        practiceDSABest.textContent =
            "Best Score: " + bestScoreText;
    }
}

   if (result.subject === "DBMS") {

    document.getElementById("dbmsScore").textContent =
        scoreText;

    const practiceDBMSScore =
        document.getElementById("practiceDBMSScore");

    if (practiceDBMSScore) {
        practiceDBMSScore.textContent =
            "Latest Score: " + scoreText;
    }

    const dbmsResults =
        results.filter(function(item) {
            return item.subject === "DBMS";
        });

    let bestScore = 0;
    let bestTotal = result.totalQuestions;

    dbmsResults.forEach(function(item) {

        const itemPercentage =
            item.score / item.totalQuestions;

        if (itemPercentage > bestScore) {
            bestScore = itemPercentage;
            bestTotal = item.totalQuestions;
        }
    });

    const bestScoreText =
        Math.round(bestScore * bestTotal) +
        " / " +
        bestTotal;

    const practiceDBMSBest =
        document.getElementById("practiceDBMSBest");

    if (practiceDBMSBest) {
        practiceDBMSBest.textContent =
            "Best Score: " + bestScoreText;
    }
}

   if (result.subject === "Aptitude") {

    document.getElementById("aptitudeScore").textContent =
        scoreText;

    const practiceAptitudeScore =
        document.getElementById("practiceAptitudeScore");

    if (practiceAptitudeScore) {
        practiceAptitudeScore.textContent =
            "Latest Score: " + scoreText;
    }

    const aptitudeResults =
        results.filter(function(item) {
            return item.subject === "Aptitude";
        });

    let bestScore = 0;
    let bestTotal = result.totalQuestions;

    aptitudeResults.forEach(function(item) {

        const itemPercentage =
            item.score / item.totalQuestions;

        if (itemPercentage > bestScore) {
            bestScore = itemPercentage;
            bestTotal = item.totalQuestions;
        }
    });

    const bestScoreText =
        Math.round(bestScore * bestTotal) +
        " / " +
        bestTotal;

    const practiceAptitudeBest =
        document.getElementById("practiceAptitudeBest");

    if (practiceAptitudeBest) {
        practiceAptitudeBest.textContent =
            "Best Score: " + bestScoreText;
    }
}

   if (result.subject === "Operating Systems") {

    document.getElementById("osScore").textContent =
        scoreText;

    const practiceOSScore =
        document.getElementById("practiceOSScore");

    if (practiceOSScore) {
        practiceOSScore.textContent =
            "Latest Score: " + scoreText;
    }

    const osResults =
        results.filter(function(item) {
            return item.subject === "Operating Systems";
        });

    let bestScore = 0;
    let bestTotal = result.totalQuestions;

    osResults.forEach(function(item) {

        const itemPercentage =
            item.score / item.totalQuestions;

        if (itemPercentage > bestScore) {
            bestScore = itemPercentage;
            bestTotal = item.totalQuestions;
        }
    });

    const bestScoreText =
        Math.round(bestScore * bestTotal) +
        " / " +
        bestTotal;

    const practiceOSBest =
        document.getElementById("practiceOSBest");

    if (practiceOSBest) {
        practiceOSBest.textContent =
            "Best Score: " + bestScoreText;
    }
}

});


let average = 0;

if (results.length > 0) {

    average =
        Math.round(totalPercentage / results.length);

}

document.getElementById("averageScore").textContent =
    average + "%";

document.getElementById("summaryAverage").textContent =
    average + "%";

    } catch (error) {

        console.error(
            "Failed to load quiz results:",
            error
        );

    }

}

loadQuizResults();

async function loadProfileFromMongoDB() {

    const token = localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/profile",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );

        if (!response.ok) {
            console.log("Could not load profile.");
            return;
        }

        const user = await response.json();

        // Update profile on the page
        document.getElementById("profileName").textContent =
            user.name;

        document.getElementById("profileCourse").textContent =
            user.course;

        document.getElementById("profileYear").textContent =
            user.year;

        document.getElementById("profileGoal").textContent =
            user.careerGoal;

        // Keep localStorage updated
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

    } catch (error) {

        console.error(
            "Failed to load profile:",
            error
        );

    }
}

function checkLogin() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login to use this feature.");
        showLoginAndScroll();
        return false;
    }

    return true;
}