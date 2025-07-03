// Get references to our HTML elements using their IDs or classes.
const cells = document.querySelectorAll('.cell');
const gameStatusDisplay = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const themeToggleButton = document.getElementById('themeToggleButton');

// Game State Variables:
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
// Removed: let isComputerTurn = false; // No longer needed for two-player game
// Removed: let hintCellIndex = -1; // No longer needed as hint function is removed

// Winning Conditions:
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
];

// Function to handle a player's move.
function handleCellPlayed(clickedCell, clickedCellIndex) {
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    // Removed hint highlight logic as hint function is removed
}

// Function to switch turns between players.
function handlePlayerChange() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

// Function to check if the game has been won or if it's a draw.
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const cellA = board[winCondition[0]];
        const cellB = board[winCondition[1]];
        const cellC = board[winCondition[2]];

        if (cellA === '' || cellB === '' || cellC === '') {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatusDisplay.textContent = `Player ${currentPlayer} Has Won!`;
        gameActive = false;
        // Removed: hintButton.disabled = true; // No hint button
        return;
    }

    if (!board.includes('')) {
        gameStatusDisplay.textContent = `It's a Draw!`;
        gameActive = false;
        // Removed: hintButton.disabled = true; // No hint button
        return;
    }

    handlePlayerChange();
}

// Removed: Function to find a winning move (AI specific)
// Removed: Function for the computer (AI) to make a move

// Function called when a cell is clicked.
function handleCellClick(event) {
    // Removed: if (isComputerTurn) { return; } // No computer turn in 2-player mode

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    checkResult();

    // Removed AI turn initiation
    // if (gameActive) {
    //     isComputerTurn = true;
    //     setTimeout(handleComputerMove, 700);
    // }
}

// Removed: Function to call LLM for a hint

// Function to reset the game to its initial state.
function handleResetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    // Removed: isComputerTurn = false; // No computer turn in 2-player mode
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    // Removed: hintButton.disabled = false; // No hint button

    // Removed hint highlight reset logic
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

// Event Listeners:
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleResetGame);
// Removed: hintButton.addEventListener('click', getLLMHint); // No hint button
themeToggleButton.addEventListener('click', toggleDarkMode);

// Apply the saved theme when the page loads
document.addEventListener('DOMContentLoaded', applyThemeOnLoad);