const cards = ["🌙", "🍉", "🎵", "🐶", "🌼", "☀️", "🐶", "🍉", "🌼", "☀️", "🎵", "🌙"];

const gameBoard = document.getElementById("game-board");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart");
const movesLabel = document.getElementById("moves");
const timeLabel = document.getElementById("time");

let firstCard = null;
let secondCard = null;
let locked = false;
let matchedPairs = 0;
let moveCount = 0;
let elapsedSeconds = 0;
let timerId = null;

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateStats() {
    movesLabel.textContent = `Moves: ${moveCount}`;
    timeLabel.textContent = `Time: ${formatTime(elapsedSeconds)}`;
}

function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
        elapsedSeconds++;
        updateStats();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

function shuffleCards() {
    cards.sort(() => Math.random() - 0.5);
}

function createBoard() {
    gameBoard.innerHTML = "";
    message.textContent = "";

    firstCard = null;
    secondCard = null;
    locked = false;
    matchedPairs = 0;
    moveCount = 0;
    elapsedSeconds = 0;
    stopTimer();
    updateStats();

    shuffleCards();

    cards.forEach((symbol) => {
        const card = document.createElement("button");

        card.classList.add("card");
        card.textContent = "?";
        card.dataset.symbol = symbol;

        card.addEventListener("click", () => revealCard(card));

        gameBoard.appendChild(card);
    });
}

function revealCard(card) {
    if (locked) return;
    if (card === firstCard) return;
    if (card.disabled) return;

    card.textContent = card.dataset.symbol;

    if (!firstCard) {
        startTimer();
        firstCard = card;
        return;
    }

    secondCard = card;
    moveCount++;
    updateStats();
    locked = true;

    checkMatch();
}

function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
        firstCard.disabled = true;
        secondCard.disabled = true;

        matchedPairs++;

        firstCard = null;
        secondCard = null;
        locked = false;

        if (matchedPairs === 6) {
            stopTimer();
            message.textContent = `You Win! 🎉 Moves: ${moveCount} | Time: ${formatTime(elapsedSeconds)}`;
        }
    } else {
        setTimeout(() => {
            firstCard.textContent = "?";
            secondCard.textContent = "?";

            firstCard = null;
            secondCard = null;
            locked = false;
        }, 800);
    }
}

restartButton.addEventListener("click", createBoard);

createBoard();