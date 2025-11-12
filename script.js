let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const maxAttempts = 5;
let previousGuesses = [];

const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const message = document.getElementById("message");
const attemptsText = document.getElementById("attempts");
const previousGuessesDiv = document.getElementById("previousGuesses");
const numberBoard = document.getElementById("numberBoard");

// Popup elements
const resultPopup = document.getElementById("resultPopup");
const resultTitle = document.getElementById("resultTitle");
const resultDetails = document.getElementById("resultDetails");
const playAgainBtn = document.getElementById("playAgainBtn");

// Sounds
const winSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3");
const loseSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3");
const clickSound = new Audio("https://assets.mixkit.co/active_storage/sfx/1118/1118-preview.mp3");

// Create number board
function createNumberBoard() {
  numberBoard.innerHTML = "";
  for (let i = 1; i <= 100; i++) {
    const cell = document.createElement("div");
    cell.textContent = i;
    cell.classList.add("number-cell");
    numberBoard.appendChild(cell);
  }
}

// Update colors
function updateNumberColors(guess, hint) {
  const cells = document.querySelectorAll(".number-cell");
  cells.forEach((cell, index) => {
    const num = index + 1;
    if (hint === "low" && num <= guess) cell.classList.add("red");
    if (hint === "high" && num >= guess) cell.classList.add("red");
  });
}

// Mark the correct number
function markCorrectNumber(num) {
  const cells = document.querySelectorAll(".number-cell");
  const target = cells[num - 1];
  target.classList.remove("red");
  target.classList.add("green");
}

// Check guess
function checkGuess() {
  clickSound.play();
  const guess = Number(guessInput.value);
  if (!guess || guess < 1 || guess > 100) {
    message.textContent = "Please enter a number between 1 and 100.";
    return;
  }

  attempts++;
  previousGuesses.push(guess);
  previousGuessesDiv.textContent = "Your guesses: " + previousGuesses.join(", ");

  if (guess === secretNumber) {
    markCorrectNumber(secretNumber);
    winSound.play();
    confettiExplosion();
    showResultPopup(true);
    return;
  }

  if (guess > secretNumber) {
    message.textContent = "Too high! Try a smaller number.";
    updateNumberColors(guess, "high");
  } else {
    message.textContent = "Too low! Try a greater number.";
    updateNumberColors(guess, "low");
  }

  attemptsText.textContent = `Attempt: ${attempts} / ${maxAttempts}`;

  if (attempts >= maxAttempts && guess !== secretNumber) {
    markCorrectNumber(secretNumber);
    loseSound.play();
    showResultPopup(false);
  }

  guessInput.value = "";
  guessInput.focus();
}

// Show popup
function showResultPopup(won) {
  guessInput.disabled = true;
  submitGuess.disabled = true;

  resultTitle.textContent = won ? "You Won!" : "You Lost!";
  resultDetails.textContent = `The secret number was ${secretNumber}.`;

  resultPopup.classList.remove("hidden");
}

// Confetti
function confettiExplosion() {
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { y: 0.6 }
  });
}

// Reset
function resetGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  previousGuesses = [];
  guessInput.disabled = false;
  submitGuess.disabled = false;
  message.textContent = "";
  attemptsText.textContent = "";
  previousGuessesDiv.textContent = "";
  guessInput.value = "";
  createNumberBoard();
  resultPopup.classList.add("hidden");
  guessInput.focus();
}

// Initialize
createNumberBoard();
resultPopup.classList.add("hidden"); // Ensure popup is hidden at start

submitGuess.addEventListener("click", checkGuess);
playAgainBtn.addEventListener("click", resetGame);
guessInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") checkGuess();
});
