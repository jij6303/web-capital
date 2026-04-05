const TOTAL_QUESTIONS = 10;
const OPTIONS_COUNT = 4;

let score = 0;
let questionIndex = 0;
let currentCountry = null;
let usedCountries = [];
let answered = false;

const questionCountEl = document.getElementById("question-count");
const scoreEl = document.getElementById("score");
const countryNameEl = document.getElementById("country-name");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("next-btn");
const resultScreen = document.getElementById("result-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const mapEl = document.getElementById("map");

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getRandomCountries(exclude, count) {
  return shuffle(COUNTRIES.filter((c) => c.code !== exclude.code)).slice(0, count);
}

function highlightCountry(code) {
  // Reset all
  mapEl.querySelectorAll("path, circle, polygon, rect").forEach((el) => {
    el.classList.remove("highlighted");
  });

  // Try to find by id or data-id matching ISO code
  const targets = mapEl.querySelectorAll(
    `[id="${code}"], [data-id="${code}"], [id="${code.toLowerCase()}"], [data-id="${code.toLowerCase()}"]`
  );
  targets.forEach((el) => el.classList.add("highlighted"));
}

function loadQuestion() {
  answered = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.style.display = "none";
  optionsEl.innerHTML = "";

  // Pick a country not yet used
  const remaining = COUNTRIES.filter((c) => !usedCountries.includes(c.code));
  currentCountry = remaining[Math.floor(Math.random() * remaining.length)];
  usedCountries.push(currentCountry.code);

  questionCountEl.textContent = `${questionIndex + 1} / ${TOTAL_QUESTIONS}`;
  countryNameEl.textContent = currentCountry.name;
  highlightCountry(currentCountry.code);

  // Build options
  const wrongOptions = getRandomCountries(currentCountry, OPTIONS_COUNT - 1);
  const allOptions = shuffle([currentCountry, ...wrongOptions]);

  allOptions.forEach((country) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = country.capital;
    btn.dataset.code = country.code;
    btn.addEventListener("click", () => handleAnswer(btn, country));
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(btn, selectedCountry) {
  if (answered) return;
  answered = true;

  const isCorrect = selectedCountry.code === currentCountry.code;

  optionsEl.querySelectorAll(".option-btn").forEach((b) => {
    b.disabled = true;
    if (b.dataset.code === currentCountry.code) {
      b.classList.add("correct");
    }
  });

  if (isCorrect) {
    score++;
    scoreEl.textContent = score;
    feedbackEl.textContent = "정답! 🎉";
    feedbackEl.className = "feedback correct";
    btn.classList.remove("correct");
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    feedbackEl.textContent = `오답! 정답은 ${currentCountry.capital} 입니다.`;
    feedbackEl.className = "feedback wrong";
  }

  questionIndex++;

  if (questionIndex >= TOTAL_QUESTIONS) {
    nextBtn.textContent = "결과 보기";
  } else {
    nextBtn.textContent = "다음 문제";
  }
  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  if (questionIndex >= TOTAL_QUESTIONS) {
    showResult();
  } else {
    loadQuestion();
  }
});

function showResult() {
  quizScreen.style.display = "none";
  resultScreen.style.display = "flex";
  const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
  let emoji = "😢";
  if (pct >= 80) emoji = "🏆";
  else if (pct >= 50) emoji = "👍";
  finalScoreEl.innerHTML = `${score} / ${TOTAL_QUESTIONS}<br><span style="font-size:2rem">${emoji}</span><br><span style="font-size:1rem;color:#888">${pct}점</span>`;
}

restartBtn.addEventListener("click", () => {
  score = 0;
  questionIndex = 0;
  usedCountries = [];
  scoreEl.textContent = 0;
  resultScreen.style.display = "none";
  quizScreen.style.display = "flex";
  loadQuestion();
});

// Start
loadQuestion();
