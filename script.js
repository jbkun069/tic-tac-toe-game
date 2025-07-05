// Get references to our HTML elements using their IDs or classes.
const choiceScreen = document.getElementById('choiceScreen');
const gameContainer = document.getElementById('gameContainer');
const choose3x3Button = document.getElementById('choose3x3');
const choose4x4Button = document.getElementById('choose4x4');
const gameBoard = document.getElementById('gameBoard'); // Reference to the game board div
const gameStatusDisplay = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const themeToggleButton = document.getElementById('themeToggleButton');

// Game State Variables:
let board = []; // Will be initialized dynamically
let currentPlayer = 'X';
let gameActive = true;
let boardSize = 0; // Will be 3 or 4
let cells = []; // Will be updated after board generation
let winningConditions = []; // Will be generated dynamically

// Function to generate winning conditions based on board size
function generateWinningConditions(size) {
    const conditions = [];
    const totalCells = size * size;

    // Rows
    for (let i = 0; i < totalCells; i += size) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(i + j);
        }
        conditions.push(row);
    }

    // Columns
    for (let i = 0; i < size; i++) {
        const col = [];
        for (let j = 0; j < size; j++) {
            col.push(i + j * size);
        }
        conditions.push(col);
    }

    // Diagonal (top-left to bottom-right)
    const diag1 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * (size + 1));
    }
    conditions.push(diag1);

    // Diagonal (top-right to bottom-left)
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag2.push((i + 1) * (size - 1));
    }
    conditions.push(diag2);

    return conditions;
}

// Function to initialize the game board and state for a given size
function initializeGame(size) {
    boardSize = size;
    board = Array(size * size).fill(''); // Create a new empty board array
    winningConditions = generateWinningConditions(size); // Generate conditions for this size

    // Dynamically create cells
    gameBoard.innerHTML = ''; // Clear any existing cells
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Adjust board size and cell font size based on boardSize
    if (size === 3) {
        gameBoard.style.width = '300px';
        gameBoard.style.height = '300px';
    } else if (size === 4) {
        gameBoard.style.width = '360px'; // Slightly larger for 4x4
        gameBoard.style.height = '360px';
    }

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.cellIndex = i;
        // Adjust font size dynamically
        cell.style.fontSize = size === 3 ? '4rem' : '3rem'; // Larger for 3x3, smaller for 4x4
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
    }

    // Re-query cells after they are created
    cells = document.querySelectorAll('.cell');

    // Hide choice screen and show game container
    choiceScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    handleResetGame(); // Reset game state for the new board
}

// Function to handle a player's move.
function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
}

// Function to switch turns between players.
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

// Function to check if the game has been won or if it's a draw.
function checkResult() {
    let roundWon = false;

    // Iterate through all possible winning conditions for the current board size
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        // Get the values from the board array for the cells in this condition
        const firstCellMark = board[winCondition[0]];

        // If the first cell in the condition is empty, this condition cannot be met yet
        if (firstCellMark === '') {
            continue;
        }

        // Check if all cells in the current winning condition have the same mark
        let allMatch = true;
        for (let j = 1; j < winCondition.length; j++) {
            if (board[winCondition[j]] !== firstCellMark) {
                allMatch = false;
                break;
            }
        }

        if (allMatch) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatusDisplay.textContent = `Player ${currentPlayer} Has Won!`;
        gameActive = false;
        gameBoard.classList.add('game-over'); // Add game-over class to board
        return;
    }

    if (!board.includes('')) {
        gameStatusDisplay.textContent = `It's a Draw!`;
        gameActive = false;
        gameBoard.classList.add('game-over'); // Add game-over class to board
        return;
    }

    handlePlayerChange();
}


// Function called when a cell is clicked.
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    checkResult();
}

// Function to reset the game to its initial state.
function handleResetGame() {
    board.fill(''); // Clear the board array
    currentPlayer = 'X';
    gameActive = true;
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    gameBoard.classList.remove('game-over'); // Remove game-over class from board

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Function to toggle between light and dark modes
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggleButton.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Function to apply theme on page load
function applyThemeOnLoad() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.textContent = '☀️ Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleButton.textContent = '🌙 Dark Mode';
    }
}

// Event Listeners for choice buttons
choose3x3Button.addEventListener('click', () => initializeGame(3));
choose4x4Button.addEventListener('click', () => initializeGame(4));

// Event Listeners for game buttons (these will be attached once the game starts)
resetButton.addEventListener('click', handleResetGame);
themeToggleButton.addEventListener('click', toggleDarkMode);

// Initial setup: Apply theme and show choice screen
document.addEventListener('DOMContentLoaded', () => {
    applyThemeOnLoad();
    choiceScreen.classList.remove('hidden'); // Ensure choice screen is visible on load
    gameContainer.classList.add('hidden'); // Ensure game container is hidden on load
});