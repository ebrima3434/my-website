
// Game Data
const categories = {
    brainburst: {
        name: "🦁 Brain Bust",
        words: [
            { word: "ELEPHANT", hint: "Largest land animal with a trunk" },
            { word: "GIRAFFE", hint: "Tallest animal with a long neck" },
            { word: "DOLPHIN", hint: "Intelligent marine mammal" },
            { word: "BUTTERFLY", hint: "Colorful flying insect" },
            { word: "PENGUIN", hint: "Flightless bird that swims" },
            { word: "KANGAROO", hint: "Australian animal that hops" },
            { word: "CHEETAH", hint: "Fastest land animal" },
            { word: "OCTOPUS", hint: "Sea creature with eight arms" },
            { word: "Sloth", hint: "Slowest animal in the world" },
            { word: "PIZZA", hint: "Italian dish with cheese and toppings" },
            { word: "HAMBURGER", hint: "Sandwich with a meat patty" },
            { word: "SPAGHETTI", hint: "Long thin Italian pasta" },
            { word: "CHOCOLATE", hint: "Sweet brown treat" },
            { word: "STRAWBERRY", hint: "Red sweet fruit" },
            { word: "CROISSANT", hint: "Buttery French pastry" },
            { word: "SUSHI", hint: "Japanese rice and fish dish" },
            { word: "PANCAKE", hint: "Flat breakfast cake" },
            { word: "BRAZIL", hint: "Largest South American country" },
            { word: "JAPAN", hint: "Island nation in East Asia" },
            { word: "AUSTRALIA", hint: "Country and continent" },
            { word: "EGYPT", hint: "Home of the pyramids" },
            { word: "CANADA", hint: "North American country" },
            { word: "INDIA", hint: "Second most populous country" },
            { word: "GERMANY", hint: "European country known for cars" },
            { word: "THAILAND", hint: "Southeast Asian country" },
            { word: "CHINA", hint: "Most populated country in the world" },
            { word: "VATICAN CITY", hint: "Smallest country in the world" },
            { word: "ELON MUSK", hint: "Richest man in the world" },
            { word: "FOOTBALL", hint: "Most popular sport worldwide" },
            { word: "BASKETBALL", hint: "Sport with hoops" },
            { word: "TENNIS", hint: "Racket sport with a net" },
            { word: "SWIMMING", hint: "Water sport" },
            { word: "BOXING", hint: "Combat sport with gloves" },
            { word: "GYMNASTICS", hint: "Sport with flips and balance" },
            { word: "VOLLEYBALL", hint: "Team sport with a high net" },
            { word: "CRICKET", hint: "Bat and ball sport" },
            { word: "TITANIC", hint: "Romance on a sinking ship" },
            { word: "AVATAR", hint: "Blue aliens on Pandora" },
            { word: "FROZEN", hint: "Disney movie about ice queen" },
            { word: "JURASSIC", hint: "Dinosaurs in a park" },
            { word: "INCEPTION", hint: "Dreams within dreams" },
            { word: "GLADIATOR", hint: "Roman warrior film" },
            { word: "MATRIX", hint: "Red pill or blue pill" },
            { word: "COOCO", hint: "Pixar movie about music" },
            { word: "ABUJA", hint: "Capital of Nigeria" },
            { word: "ADISABABA", hint: "Capital of Ethiopia" },
            { word: "BANJUL", hint: " Capital of Gambia" },
            { word: "ATHENS", hint: "Capital of Greece" },
            { word: "DAKAR", hint: "Capital of Senegal" },
            { word: "ZURICH", hint: "Capital of Switzerland" },
            { word: "CAIRO", hint: "Capital of Egypt" },
            { word: "OUGADUGOU", hint: "Capital of Burkinafaso" },
            { word: "ABIDJAN", hint: "Capital of Ivory Coast" },
            { word: "OSLO", hint: "Capital of Norway" },
            { word: "LONDON", hint: "Capital of England" },
            { word: "ROME", hint: "Capital of Italy" },
            { word: "MADRID", hint: "Capital of Spain" },
            { word: "BERLIN", hint: "Capital of Germany" },
            { word: "LISBON", hint: "Capital of Portugal" },
            { word: "PARIS", hint: "Capital of France" }

        ]
    },
};

// Game State
let currentCategory = 'brainburst';
let currentWord = '';
let currentHint = '';
let guessedLetters = [];
let wrongGuesses = 0;
let maxWrong = 6;
let levelScore = 0;
let totalScore = 0;
let currentLevel = 1;
let gameActive = true;
let wordsUsed = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupCategoryButtons();
    createKeyboard();
    newGame();
});

function setupCategoryButtons() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            document.getElementById('category-name').textContent = categories[currentCategory].name;
            wordsUsed = [];
            newGame();
        });
    });
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let letter of letters) {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.textContent = letter;
        btn.dataset.letter = letter;
        btn.onclick = () => guessLetter(letter);
        keyboard.appendChild(btn);
    }
}

function newGame() {
    const categoryData = categories[currentCategory];
    const availableWords = categoryData.words.filter(w => !wordsUsed.includes(w.word));

    if (availableWords.length === 0) {
        wordsUsed = [];
        currentLevel = 1;
    }

    const randomWord = categoryData.words[Math.floor(Math.random() * categoryData.words.length)];
    currentWord = randomWord.word;
    currentHint = randomWord.hint;
    wordsUsed.push(currentWord);

    guessedLetters = [];
    wrongGuesses = 0;
    gameActive = true;
    levelScore = 100;

    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('wrong-guesses').textContent = wrongGuesses;
    document.getElementById('level-score').textContent = levelScore;
    document.getElementById('hint-text').textContent = currentHint;

    renderWord();
    resetKeyboard();
}

function renderWord() {
    const display = document.getElementById('word-display');
    display.innerHTML = '';

    for (let letter of currentWord) {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';

        if (guessedLetters.includes(letter)) {
            slot.textContent = letter;
            slot.classList.add('filled');
        } else {
            slot.textContent = '';
        }

        display.appendChild(slot);
    }
}

function guessLetter(letter) {
    if (!gameActive || guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    const key = document.querySelector(`.key[data-letter="${letter}"]`);

    if (currentWord.includes(letter)) {
        key.classList.add('correct');
        renderWord();
        checkWin();
    } else {
        key.classList.add('wrong');
        wrongGuesses++;
        document.getElementById('wrong-guesses').textContent = wrongGuesses;
        levelScore = Math.max(0, levelScore - 10);
        document.getElementById('level-score').textContent = levelScore;
        checkLose();
    }

    key.classList.add('used');
}

function checkWin() {
    const allGuessed = currentWord.split('').every(l => guessedLetters.includes(l));

    if (allGuessed) {
        gameActive = false;
        totalScore += levelScore;
        document.getElementById('total-score').textContent = totalScore;
        document.getElementById('win-word').textContent = currentWord;
        document.getElementById('win-score').textContent = levelScore;
        document.getElementById('win-modal').style.display = 'flex';
    }
}

function checkLose() {
    if (wrongGuesses >= maxWrong) {
        gameActive = false;
        document.getElementById('lose-word').textContent = currentWord;
        document.getElementById('lose-modal').style.display = 'flex';
    }
}

function useHint() {
    if (!gameActive || levelScore < 50) return;

    const unrevealedLetters = currentWord.split('').filter(l => !guessedLetters.includes(l));
    if (unrevealedLetters.length === 0) return;

    const hintLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    guessedLetters.push(hintLetter);
    levelScore -= 50;
    document.getElementById('level-score').textContent = levelScore;

    const key = document.querySelector(`.key[data-letter="${hintLetter}"]`);
    key.classList.add('correct', 'used');

    renderWord();
    checkWin();
}

function nextLevel() {
    currentLevel++;
    closeModal('win-modal');
    newGame();
}

function showLevelSelect() {
    const container = document.getElementById('level-buttons');
    container.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = i;
        btn.onclick = () => {
            currentLevel = i;
            closeModal('level-modal');
            newGame();
        };
        container.appendChild(btn);
    }

    document.getElementById('level-modal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function resetKeyboard() {
    document.querySelectorAll('.key').forEach(key => {
        key.className = 'key';
    });
}

// Close modals on outside click
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}