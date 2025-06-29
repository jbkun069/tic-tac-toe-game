// Get references to our HTML elements using their IDs or classes.
const cells = document.querySelectorAll('.cell');
const gameStatusDisplay = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const hintButton = document.getElementById('hintButton');
const themeToggleButton = document.getElementById('themeToggleButton'); // Reference to the new theme toggle button

// Game State Variables:
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isComputerTurn = false;
let hintCellIndex = -1;

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

    if (hintCellIndex !== -1) {
        cells[hintCellIndex].classList.remove('hint-highlight');
        hintCellIndex = -1;
    }
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
        hintButton.disabled = true;
        return;
    }

    if (!board.includes('')) {
        gameStatusDisplay.textContent = `It's a Draw!`;
        gameActive = false;
        hintButton.disabled = true;
        return;
    }

    handlePlayerChange();
}

// Function to find a winning move for a given player or a blocking move
function findWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return -1;
}

// Function for the computer (AI) to make a move
async function handleComputerMove() {
    if (!gameActive || currentPlayer !== 'O') {
        isComputerTurn = false;
        return;
    }

    let bestMove = -1;

    // Strategy:
    // 1. Try to win (for AI)
    bestMove = findWinningMove('O');
    // 2. Block player's winning move (for 'X')
    if (bestMove === -1) {
        bestMove = findWinningMove('X');
    }
    // 3. Take center if available
    if (bestMove === -1 && board[4] === '') {
        bestMove = 4;
    }
    // 4. Take a corner if available
    if (bestMove === -1) {
        const corners = [0, 2, 6, 8];
        for (const index of corners) {
            if (board[index] === '') {
                bestMove = index;
                break;
            }
        }
    }
    // 5. Take any available spot
    if (bestMove === -1) {
        const availableCells = board.map((val, idx) => val === '' ? idx : -1).filter(idx => idx !== -1);
        if (availableCells.length > 0) {
            bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
        }
    }

    if (bestMove !== -1) {
        const cellToClick = cells[bestMove];
        handleCellPlayed(cellToClick, bestMove);
        checkResult();
    }
    isComputerTurn = false;
}

// Function called when a cell is clicked.
function handleCellClick(event) {
    if (isComputerTurn) {
        return;
    }

    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    checkResult();

    if (gameActive) {
        isComputerTurn = true;
        setTimeout(handleComputerMove, 700);
    }
}

// Function to call LLM for a hint
async function getLLMHint() {
    if (!gameActive || currentPlayer === 'O') {
        gameStatusDisplay.textContent = "Hints are only for Player X's turn!";
        setTimeout(() => {
            if (gameActive) {
                gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
            }
        }, 2000);
        return;
    }

    if (hintCellIndex !== -1) {
        cells[hintCellIndex].classList.remove('hint-highlight');
        hintCellIndex = -1;
    }

    gameStatusDisplay.textContent = "✨ Generating hint...";
    hintButton.disabled = true;

    const prompt = `You are a helpful Tic-Tac-Toe assistant.
    The current Tic-Tac-Toe board state is represented by an array: [${board.map(cell => cell === '' ? 'empty' : cell).join(', ')}].
    Player ${currentPlayer}'s turn.
    Suggest the best move (0-8) as a single number. Only respond with the number, nothing else.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // API key is handled by the Canvas environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            const suggestedMove = parseInt(text.trim());

            if (!isNaN(suggestedMove) && suggestedMove >= 0 && suggestedMove <= 8 && board[suggestedMove] === '') {
                hintCellIndex = suggestedMove;
                cells[hintCellIndex].classList.add('hint-highlight');
                gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn. ✨ Hint: Try cell ${suggestedMove}!`;
            } else {
                gameStatusDisplay.textContent = "✨ Couldn't get a valid hint. Try again!";
                console.error("LLM returned an invalid move or already occupied cell:", text);
            }
        } else {
            gameStatusDisplay.textContent = "✨ Failed to get hint from LLM.";
            console.error("LLM response structure unexpected:", result);
        }
    } catch (error) {
        gameStatusDisplay.textContent = "✨ Error fetching hint.";
        console.error("Error calling Gemini API:", error);
    } finally {
        hintButton.disabled = false;
        if (gameActive) {
            setTimeout(() => {
                if (gameStatusDisplay.textContent.includes("Hint") && gameActive) {
                   gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
                }
            }, 3000);
        }
    }
}

// Function to reset the game to its initial state.
function handleResetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    isComputerTurn = false;
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    hintButton.disabled = false;

    if (hintCellIndex !== -1) {
        cells[hintCellIndex].classList.remove('hint-highlight');
        hintCellIndex = -1;
    }

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
}

// Function to toggle between light and dark modes
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode'); // Add or remove 'dark-mode' class
    const isDarkMode = document.body.classList.contains('dark-mode');
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    // Update button text/icon
    themeToggleButton.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Function to apply theme on page load
function applyThemeOnLoad() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.textContent = '☀️ Light Mode';
    } else {
        // Ensure light mode is default and button text is correct if no preference or 'light'
        document.body.classList.remove('dark-mode');
        themeToggleButton.textContent = '🌙 Dark Mode';
    }
}

// Event Listeners:
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleResetGame);
hintButton.addEventListener('click', getLLMHint);
themeToggleButton.addEventListener('click', toggleDarkMode); // Event listener for the new theme toggle button

// Apply the saved theme when the page loads
document.addEventListener('DOMContentLoaded', applyThemeOnLoad);