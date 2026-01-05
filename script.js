console.log("JS connected");


const questionSets = {
  frontend: [
    { question: "What does CSS stand for?", options: ["Creative Style System","Cascading Style Sheets","Computer Style Sheets","Color Style Sheets"], correct: 1 },
    { question: "Which HTML tag creates a link?", options: ["<a>","<link>","<href>","<url>"], correct: 0 },
    { question: "Which JS keyword declares constant?", options: ["var","let","const","static"], correct: 2 },
    { question: "Which layout is one-dimensional?", options: ["Grid","Flexbox","Table","Float"], correct: 1 },
    { question: "Which unit is relative?", options: ["px","cm","em","mm"], correct: 2 },
    { question: "Which property adds inner space?", options: ["margin","padding","gap","space"], correct: 1 },
    { question: "Which event runs on click?", options: ["onhover","onclick","onpress","onchange"], correct: 1 },
    { question: "Which operator checks type?", options: ["==","=","===","!="], correct: 2 }
  ]
};


let quizData = questionSets.frontend;
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;


const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const timerCircle = document.querySelector(".timer-progress");

const resultContainer = document.getElementById("resultContainer");
const resultPercent = document.getElementById("resultPercent");
const resultLabel = document.getElementById("resultLabel");
const resultCircle = document.querySelector(".result-progress");

const FULL_DASH = 226;
const RESULT_DASH = 339;


function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  timerEl.textContent = timeLeft;
  timerCircle.style.strokeDashoffset = 0;
  timerEl.classList.remove("timer-warning");
  timerCircle.classList.remove("warning");

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;

    timerCircle.style.strokeDashoffset =
      FULL_DASH - (timeLeft / 60) * FULL_DASH;

    if (timeLeft <= 10) {
      timerEl.classList.add("timer-warning");
      timerCircle.classList.add("warning");
    }

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      feedbackEl.textContent = "⏱ Time’s up!";
      setTimeout(nextQuestion, 800);
    }
  }, 1000);
}


function loadQuestion() {
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  const q = quizData[currentQuestion];
  questionEl.textContent = `Q${currentQuestion + 1}/8. ${q.question}`;

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.onclick = () => handleAnswer(i);
    optionsEl.appendChild(btn);
  });

  startTimer();
}


function handleAnswer(index) {
  clearInterval(timerInterval);
  const correct = quizData[currentQuestion].correct;

  Array.from(optionsEl.children).forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    if (i === index && index !== correct) btn.classList.add("wrong");
  });

  if (index === correct) score++;
  scoreEl.textContent = `Score: ${score}`;
}

/* NEXT */
function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) loadQuestion();
  else showResult();
}


function showResult() {
  resultContainer.style.display = "block";
  const percent = Math.round((score / quizData.length) * 100);
  let current = 0;

  let cls = percent >= 75 ? "result-good" : percent >= 40 ? "result-average" : "result-poor";
  let txt = percent >= 75 ? "Excellent 🎯" : percent >= 40 ? "Good 👍" : "Needs Improvement 🔴";

  resultCircle.className = `result-progress ${cls}`;
  resultPercent.className = cls.replace("result", "text");
  resultLabel.className = cls.replace("result", "text");
  resultLabel.textContent = txt;

  const anim = setInterval(() => {
    if (current >= percent) return clearInterval(anim);
    current++;
    resultPercent.textContent = `${current}%`;
    resultCircle.style.strokeDashoffset =
      RESULT_DASH - (current / 100) * RESULT_DASH;
  }, 15);
}

nextBtn.onclick = nextQuestion;
loadQuestion();
