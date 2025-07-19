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
let focusedCellIndex = 0; // Track which cell has keyboard focus

// Theme management
const themes = [
    { name: 'light', displayName: 'Light', icon: '☀️', className: '' },
    { name: 'dark', displayName: 'Dark', icon: '🌙', className: 'dark-mode' },
    { name: 'sunset', displayName: 'Sunset', icon: '🌅', className: 'sunset-mode' },
    { name: 'forest', displayName: 'Forest', icon: '🌲', className: 'forest-mode' },
    { name: 'ocean', displayName: 'Ocean', icon: '🌊', className: 'ocean-mode' }
];
let currentThemeIndex = 0;

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

    // Initialize keyboard navigation
    focusedCellIndex = 0;
    updateFocusedCell();

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
    // Show confirmation dialog if game is active and has moves
    if (gameActive && board.some(cell => cell !== '')) {
        const confirmReset = confirm('Are you sure you want to reset the game? This will clear the current board and start over.');
        if (!confirmReset) {
            return; // User cancelled, don't reset
        }
    }

    board.fill(''); // Clear the board array
    currentPlayer = 'X';
    gameActive = true;
    gameStatusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    gameBoard.classList.remove('game-over'); // Remove game-over class from board

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });

    // Reset keyboard focus
    focusedCellIndex = 0;
    updateFocusedCell();
}

// Function to update the visual focus indicator
function updateFocusedCell() {
    // Remove focus class from all cells
    cells.forEach(cell => cell.classList.remove('focused'));
    
    // Add focus class to current cell
    if (cells[focusedCellIndex]) {
        cells[focusedCellIndex].classList.add('focused');
    }
}

// Function to handle keyboard navigation
function handleKeyboardNavigation(event) {
    if (!gameActive || cells.length === 0) return;

    const key = event.key;
    let newIndex = focusedCellIndex;

    switch (key) {
        case 'ArrowUp':
            event.preventDefault();
            newIndex = focusedCellIndex - boardSize;
            if (newIndex >= 0) {
                focusedCellIndex = newIndex;
                updateFocusedCell();
            }
            break;
        
        case 'ArrowDown':
            event.preventDefault();
            newIndex = focusedCellIndex + boardSize;
            if (newIndex < cells.length) {
                focusedCellIndex = newIndex;
                updateFocusedCell();
            }
            break;
        
        case 'ArrowLeft':
            event.preventDefault();
            // Only move left if not at the start of a row
            if (focusedCellIndex % boardSize !== 0) {
                focusedCellIndex--;
                updateFocusedCell();
            }
            break;
        
        case 'ArrowRight':
            event.preventDefault();
            // Only move right if not at the end of a row
            if ((focusedCellIndex + 1) % boardSize !== 0 && focusedCellIndex < cells.length - 1) {
                focusedCellIndex++;
                updateFocusedCell();
            }
            break;
        
        case 'Enter':
        case ' ':
            event.preventDefault();
            // Make a move on the focused cell
            if (cells[focusedCellIndex] && board[focusedCellIndex] === '') {
                handleCellPlayed(cells[focusedCellIndex], focusedCellIndex);
                checkResult();
            }
            break;
    }
}

// Function to toggle between themes
function cycleTheme() {
    // Remove current theme class
    const currentTheme = themes[currentThemeIndex];
    if (currentTheme.className) {
        document.body.classList.remove(currentTheme.className);
    }
    
    // Move to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    
    // Apply new theme class
    if (newTheme.className) {
        document.body.classList.add(newTheme.className);
    }
    
    // Update button text
    const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
    themeToggleButton.textContent = `${nextTheme.icon} ${nextTheme.displayName} Mode`;
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme.name);
}

// Function to apply theme on page load
function applyThemeOnLoad() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Find the saved theme index
    const themeIndex = themes.findIndex(theme => theme.name === savedTheme);
    currentThemeIndex = themeIndex >= 0 ? themeIndex : 0;
    
    const currentTheme = themes[currentThemeIndex];
    
    // Apply theme class
    if (currentTheme.className) {
        document.body.classList.add(currentTheme.className);
    }
    
    // Update button text to show next theme
    const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
    themeToggleButton.textContent = `${nextTheme.icon} ${nextTheme.displayName} Mode`;
}

// Event Listeners for choice buttons
choose3x3Button.addEventListener('click', () => initializeGame(3));
choose4x4Button.addEventListener('click', () => initializeGame(4));

// Event Listeners for game buttons (these will be attached once the game starts)
resetButton.addEventListener('click', handleResetGame);
themeToggleButton.addEventListener('click', cycleTheme);


// Add keyboard navigation and intercept F5/Ctrl+R for reset warning
document.addEventListener('keydown', function(event) {
    // Keyboard navigation
    handleKeyboardNavigation(event);

    // Intercept F5 and Ctrl+R for reload warning
    if ((event.key === 'F5' || (event.key.toLowerCase() === 'r' && event.ctrlKey)) && gameActive && board.some(cell => cell !== '')) {
        const confirmReload = confirm('Are you sure you want to reload? This will reset the current game.');
        if (!confirmReload) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
});

// Initial setup: Apply theme and show choice screen
document.addEventListener('DOMContentLoaded', () => {
    applyThemeOnLoad();
    choiceScreen.classList.remove('hidden'); // Ensure choice screen is visible on load
    gameContainer.classList.add('hidden'); // Ensure game container is hidden on load
});