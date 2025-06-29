// Get references to our HTML elements using their IDs or classes.
// `document.querySelectorAll` gets all elements matching the selector.
// `document.getElementById` gets a single element by its ID.
const cells = document.querySelectorAll('.cell');
const gameStatusDisplay = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const hintButton = document.getElementById('hintButton'); // Reference to the new hint button

// Game State Variables:
// `board`: An array representing the 9 cells. Initially empty strings.
//          'X' or 'O' will fill these when a player makes a move.
let board = ['', '', '', '', '', '', '', '', ''];
// `currentPlayer`: Tracks whose turn it is. Starts with 'X' (human).
let currentPlayer = 'X';
// `gameActive`: A boolean to indicate if the game is still ongoing.
let gameActive = true;
// `isComputerTurn`: Flag to manage turns between human and AI
let isComputerTurn = false;
// `hintCellIndex`: To keep track of the currently highlighted hint cell, -1 if no hint
let hintCellIndex = -1;

// Winning Conditions:
// These are all the possible combinations of cell indices that result in a win.
// Example: [0, 1, 2] means cells at index 0, 1, and 2 forming a row.
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
// `clickedCell`: The actual HTML div element that was clicked.
// `clickedCellIndex`: The index (0-8) of the cell, obtained from `data-cell-index`.
function handleCellPlayed(clickedCell, clickedCellIndex) {
    // Update the board array at the clicked index with the current player's mark.
    board[clickedCellIndex] = currentPlayer;
    // Update the text content of the HTML cell to show 'X' or 'O'.
    clickedCell.textContent = currentPlayer;
    // Add a class ('x' or 'o') to the cell for specific styling (e.g., color).
    clickedCell.classList.add(currentPlayer.toLowerCase());

    // Remove hint highlight if a move is made
    if (hintCellIndex !== -1) {
        cells[hintCellIndex].classList.remove('hint-highlight');
        hintCellIndex = -1;
    }
}

// Function to switch turns between players.
function handlePlayerChange() {
    // If current player is 'X', switch to 'O'; otherwise, switch to 'X'.
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    // Update the game status display to show whose turn it is now.
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

// Function to check if the game has been won or if it's a draw.
function checkResult() {
    let roundWon = false; // Flag to track if someone won this round

    // Loop through all defined winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i]; // Get one winning combination (e.g., [0, 1, 2])
        // Get the values from the board array for the three cells in this condition.
        const cellA = board[winCondition[0]];
        const cellB = board[winCondition[1]];
        const cellC = board[winCondition[2]];

        // If any of the cells are empty, this condition isn't met yet, so skip.
        if (cellA === '' || cellB === '' || cellC === '') {
            continue;
        }
        // If all three cells have the same mark (meaning X-X-X or O-O-O), someone won!
        if (cellA === cellB && cellB === cellC) {
            roundWon = true; // Set the flag to true
            break;           // No need to check other conditions, a win is found
        }
    }

    // If a win was detected:
    if (roundWon) {
        // Update the status display to announce the winner.
        gameStatusDisplay.textContent = `Player ${currentPlayer} Has Won!`;
        gameActive = false; // End the game
        // Disable hint button
        hintButton.disabled = true;
        return; // Exit the function
    }

    // If no win and all cells are filled (no empty strings in the board array):
    // `!board.includes('')` checks if there are NO empty cells left.
    if (!board.includes('')) {
        gameStatusDisplay.textContent = `It's a Draw!`; // Announce a draw
        gameActive = false; // End the game
        // Disable hint button
        hintButton.disabled = true;
        return; // Exit the function
    }

    // If no win and not a draw, then the game continues, so switch players.
    handlePlayerChange();
}

// Function to find a winning move for a given player or a blocking move
function findWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        // Check if placing 'player' at a, b, or c results in a win
        // If two cells are occupied by `player` and the third is empty, that's the winning spot.
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return -1; // No winning move found
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
        // Simulate a click or directly update
        handleCellPlayed(cellToClick, bestMove);
        checkResult();
    }
    isComputerTurn = false; // AI turn ends
}


// Function called when a cell is clicked.
function handleCellClick(event) {
    // If it's the computer's turn, prevent human clicks
    if (isComputerTurn) {
        return;
    }

    // `event.target` refers to the specific cell (div) that was clicked.
    const clickedCell = event.target;
    // Get the `data-cell-index` attribute value and convert it to a number.
    const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

    // Important: Check if the clicked cell is already filled OR if the game is not active.
    // If either is true, do nothing (return) to prevent invalid moves.
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // If the move is valid, proceed:
    handleCellPlayed(clickedCell, clickedCellIndex); // Place the mark
    checkResult(); // Check if this move resulted in a win or draw

    // If game is still active after human move, initiate computer's turn
    if (gameActive) {
        isComputerTurn = true;
        // Add a slight delay for better user experience
        setTimeout(handleComputerMove, 700);
    }
}

// Function to call LLM for a hint
async function getLLMHint() {
    // Only provide hint for Player X's turn and if game is active
    if (!gameActive || currentPlayer === 'O') {
        gameStatusDisplay.textContent = "Hints are only for Player X's turn!";
        setTimeout(() => {
            if (gameActive) { // Only revert if game is still active
                gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
            }
        }, 2000);
        return;
    }

    // Remove previous hint highlight if any
    if (hintCellIndex !== -1) {
        cells[hintCellIndex].classList.remove('hint-highlight');
        hintCellIndex = -1;
    }

    gameStatusDisplay.textContent = "✨ Generating hint...";
    hintButton.disabled = true; // Disable hint button during generation

    // Construct the prompt for the LLM
    const prompt = `You are a helpful Tic-Tac-Toe assistant.
    The current Tic-Tac-Toe board state is represented by an array: [${board.map(cell => cell === '' ? 'empty' : cell).join(', ')}].
    Player ${currentPlayer}'s turn.
    Suggest the best move (0-8) as a single number. Only respond with the number, nothing else.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    // API key is handled by the Canvas environment for gemini-2.0-flash
    const apiKey = "";
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

            // Validate the LLM's suggestion
            if (!isNaN(suggestedMove) && suggestedMove >= 0 && suggestedMove <= 8 && board[suggestedMove] === '') {
                // Highlight the suggested move
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
        hintButton.disabled = false; // Re-enable hint button
        // Revert status message after a delay if it's not a win/draw message
        if (gameActive) {
            setTimeout(() => {
                // Only revert if the status message still contains "Hint" and the game is active
                if (gameStatusDisplay.textContent.includes("Hint") && gameActive) {
                   gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
                }
            }, 3000);
        }
    }
}


// Function to reset the game to its initial state.
function handleResetGame() {
    // Reset all game state variables:
    board = ['', '', '', '', '', '', '', '', '']; // Clear the board array
    currentPlayer = 'X';                          // Start with 'X' again (human player)
    gameActive = true;                            // Make the game active again
    isComputerTurn = false;                       // Reset computer turn flag
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`; // Reset status message
    hintButton.disabled = false;                  // Re-enable hint button

    // Remove any existing hint highlight
    if (hintCellIndex !== -1) {
        cells[hintCellIndex].classList.remove('hint-highlight');
        hintCellIndex = -1;
    }

    // Loop through each cell element and clear its content and class.
    cells.forEach(cell => {
        cell.textContent = '';          // Remove 'X' or 'O' text
        cell.classList.remove('x', 'o'); // Remove any 'x' or 'o' styling classes
    });
}

// Event Listeners:
// Attach the `handleCellClick` function to every cell when it's clicked.
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
// Attach the `handleResetGame` function to the reset button when it's clicked.
resetButton.addEventListener('click', handleResetGame);
// Attach the `getLLMHint` function to the hint button when it's clicked.
hintButton.addEventListener('click', getLLMHint);