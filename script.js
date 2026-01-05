const quizData = [
  { question: "Which operator checks value and type?", options: ["==", "=", "===", "!="], correct: 2 },
  { question: "Which HTML tag creates a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], correct: 0 },
  { question: "What does CSS stand for?", options: ["Creative Style System", "Cascading Style Sheets", "Computer Style Sheets", "Color Style Sheets"], correct: 1 },
  { question: "Which layout is one-dimensional?", options: ["Grid", "Flexbox", "Table", "Float"], correct: 1 },
  { question: "Which unit is relative?", options: ["px", "cm", "em", "mm"], correct: 2 },
  { question: "Which keyword declares a constant?", options: ["var", "let", "const", "static"], correct: 2 },
  { question: "Which event triggers on click?", options: ["onhover", "onclick", "onpress", "onchange"], correct: 1 },
  { question: "Which method selects an element by ID?", options: ["querySelector", "getElementById", "getElementsByClass", "selectById"], correct: 1 }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;


const homeSection = document.getElementById("homeSection");
const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");

const startQuizBtn = document.getElementById("startQuizBtn");
const restartBtn = document.getElementById("restartBtn");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

const timerEl = document.getElementById("timer");
const timerCircle = document.querySelector(".timer-progress");

const resultPercent = document.getElementById("resultPercent");
const resultLabel = document.getElementById("resultLabel");
const resultCircle = document.querySelector(".result-progress");
const finalScore = document.getElementById("finalScore");

const FULL_DASH = 226;
const RESULT_DASH = 339;


function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  timerEl.textContent = timeLeft;
  timerCircle.style.strokeDashoffset = 0;
  timerCircle.classList.remove("warning");
  timerEl.classList.remove("timer-warning");

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    timerCircle.style.strokeDashoffset =
      FULL_DASH - (timeLeft / 60) * FULL_DASH;

    if (timeLeft <= 10) {
      timerCircle.classList.add("warning");
      timerEl.classList.add("timer-warning");
    }

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}


function loadQuestion() {
  optionsEl.innerHTML = "";
  const q = quizData[currentQuestion];
  questionEl.textContent = `Q${currentQuestion + 1}/8. ${q.question}`;

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.onclick = () => handleAnswer(index);
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
    if (i === index && i !== correct) btn.classList.add("wrong");
  });

  if (index === correct) score++;
  scoreEl.textContent = `Score: ${score}`;
}


function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < quizData.length) loadQuestion();
  else showResult();
}


function showResult() {
  quizSection.style.display = "none";
  resultSection.style.display = "block";

  const percent = Math.round((score / quizData.length) * 100);
  let current = 0;

  let cls = percent >= 75 ? "result-good" : percent >= 40 ? "result-average" : "result-poor";
  let label = percent >= 75 ? "Excellent" : percent >= 40 ? "Good" : "Needs Improvement";

  resultCircle.className = `result-progress ${cls}`;
  resultCircle.style.strokeDashoffset = RESULT_DASH;
  resultCircle.getBoundingClientRect();

  resultLabel.textContent = label;
  finalScore.textContent = `Final Score: ${score} / ${quizData.length}`;

  const anim = setInterval(() => {
    if (current >= percent) return clearInterval(anim);
    current++;
    resultPercent.textContent = `${current}%`;
    resultCircle.style.strokeDashoffset =
      RESULT_DASH - (current / 100) * RESULT_DASH;
  }, 16);
}


startQuizBtn.onclick = () => {
  homeSection.style.display = "none";
  quizSection.style.display = "block";
  currentQuestion = 0;
  score = 0;
  scoreEl.textContent = "Score: 0";
  loadQuestion();
};

nextBtn.onclick = nextQuestion;

restartBtn.onclick = () => {
  resultSection.style.display = "none";
  homeSection.style.display = "block";
};


homeSection.style.display = "block";
