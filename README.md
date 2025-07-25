# Tic-Tac-Toe Game

A classic Tic-Tac-Toe game built with modern web technologies, featuring a choice of board sizes and a light/dark mode toggle.


## Features

- **Two-Player Mode**: Play against a friend on the same device.
- **Board Size Selection**: Choose between a standard 3x3 board or a larger 4x4 board for extended gameplay.
- **Responsive Design**: Enjoy the game seamlessly on various screen sizes, from mobile to desktop.
- **Multiple Color Themes**: Cycle between Light, Dark, Sunset, Forest, and Ocean themes for a personalized experience.
- **Keyboard Navigation**: Use arrow keys to move between cells and Enter/Space to make a move for improved accessibility.
- **Game Over State**: Cells become unclickable once a win or draw occurs, providing clear game state feedback.


## How to Play

1. **Choose Board Size**: Upon loading, select either "3x3 Board" or "4x4 Board".
2. **Take Turns**: Player X goes first, followed by Player O. Click on an empty cell or use the keyboard to place your mark.
3. **Keyboard Controls**: Use the arrow keys to move the focus between cells. Press Enter or Space to place your mark in the focused cell.
4. **Win Condition**: Get three (or four for 4x4) of your marks in a row, column, or diagonal to win.
5. **Draw**: If all cells are filled and no player has won, the game is a draw.
6. **Reset Game**: Click the "Reset Game" button to start a new round with the current board size.
7. **Cycle Themes**: Click the theme button to cycle through Light, Dark, Sunset, Forest, and Ocean themes. Your preference will be saved.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)

## Local Installation

To run this project locally:

1. Clone the repository:
```
git clone https://github.com/YOUR_USERNAME/your-repo-name.git
cd your-repo-name
```
(Replace YOUR_USERNAME and your-repo-name with your actual GitHub details).

2. Open with a local server: Due to browser security restrictions (CORS) for local files, it's recommended to serve the files using a simple HTTP server.

If you have Python installed, navigate to the project root in your terminal and run:
```
python -m http.server
```

Then, open your web browser and go to http://localhost:8000 (or the port indicated by your server).

## Deployment

This project is designed to be easily deployed using GitHub Pages. Simply push the code to a public GitHub repository, and configure GitHub Pages to serve from your main (or master) branch's root directory.
