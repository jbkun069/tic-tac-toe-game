# Tic-Tac-Toe Game

A classic Tic-Tac-Toe game built with modern web technologies, featuring a choice of board sizes and a light/dark mode toggle.

## Features

- **Two-Player Mode**: Play against a friend on the same device.
- **Board Size Selection**: Choose between a standard 3x3 board or a larger 4x4 board for extended gameplay.
- **Responsive Design**: Enjoy the game seamlessly on various screen sizes, from mobile to desktop.
- **Light/Dark Mode Toggle**: Switch between different visual themes for a personalized experience.
- **Game Over State**: Cells become unclickable once a win or draw occurs, providing clear game state feedback.

## How to Play

1. **Choose Board Size**: Upon loading, select either "3x3 Board" or "4x4 Board".
2. **Take Turns**: Player X goes first, followed by Player O. Click on an empty cell to place your mark.
3. **Win Condition**: Get three (or four for 4x4) of your marks in a row, column, or diagonal to win.
4. **Draw**: If all cells are filled and no player has won, the game is a draw.
5. **Reset Game**: Click the "Reset Game" button to start a new round with the current board size.
6. **Toggle Theme**: Use the "🌙 Dark Mode" / "☀️ Light Mode" button to change the visual theme. Your preference will be saved.

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
