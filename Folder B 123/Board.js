document.addEventListener('DOMContentLoaded', () => {
    const sudokuBoard = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const resetGameBtn = document.getElementById('reset-game-btn');
    const checkBoardBtn = document.getElementById('check-board-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    const puzzles = [
        [
            [0, 0, 4, 0],
            [3, 0, 0, 1],
            [0, 1, 0, 0],
            [0, 4, 0, 2]
        ],
        [
            [1, 0, 0, 4],
            [0, 4, 1, 0],
            [0, 2, 3, 0],
            [4, 0, 0, 1]
        ],
        [
            [0, 2, 0, 0],
            [0, 0, 4, 0],
            [4, 0, 0, 2],
            [0, 1, 0, 0]
        ],
        [
            [0, 0, 0, 1],
            [2, 0, 0, 0],
            [0, 0, 0, 3],
            [4, 0, 0, 0]
        ]
    ];

    let currentPuzzle = [];
    let initialPuzzle = [];
    let selectedCell = null;

    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }

    function initializeGame(puzzleData) {
        sudokuBoard.innerHTML = '';
        initialPuzzle = JSON.parse(JSON.stringify(puzzleData));
        currentPuzzle = JSON.parse(JSON.stringify(puzzleData));

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const cell = document.createElement('div');
                cell.classList.add('sudoku-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.max = '4';
                input.maxLength = '1';
                input.value = currentPuzzle[r][c] !== 0 ? currentPuzzle[r][c] : '';

                if (initialPuzzle[r][c] !== 0) {
                    input.readOnly = true;
                    cell.classList.add('fixed');
                } else {
                    input.addEventListener('input', handleCellInput);
                    input.addEventListener('focus', handleCellFocus);
                    input.addEventListener('blur', handleCellBlur);
                }
                
                cell.appendChild(input);
                sudokuBoard.appendChild(cell);
            }
        }
        validateBoard(false);
    }

    function handleCellInput(e) {
        const input = e.target;
        const row = parseInt(input.closest('.sudoku-cell').dataset.row);
        const col = parseInt(input.closest('.sudoku-cell').dataset.col);
        let value = parseInt(input.value);

        if (isNaN(value) || value < 1 || value > 4) {
            input.value = '';
            value = 0;
        }

        currentPuzzle[row][col] = value;
        validateBoard(false);
    }

    function handleCellFocus(e) {
        if (selectedCell) {
            selectedCell.classList.remove('highlighted');
        }
        selectedCell = e.target.closest('.sudoku-cell');
        selectedCell.classList.add('highlighted');
    }

    function handleCellBlur(e) {
        if (selectedCell) {
            selectedCell.classList.remove('highlighted');
            selectedCell = null;
        }
    }

    function validateBoard(showMessageS) {
        let isValid = true;
        const cells = sudokuBoard.querySelectorAll('.sudoku-cell');
        cells.forEach(cell => cell.classList.remove('invalid'));
        
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const value = currentPuzzle[r][c];
                const cellEl = cells[r * 4 + c];

                if (value === 0) continue;
                
                // Check row and column
                for (let k = 0; k < 4; k++) {
                    if ((k !== c && currentPuzzle[r][k] === value) || (k !== r && currentPuzzle[k][c] === value)) {
                        cellEl.classList.add('invalid');
                        isValid = false;
                    }
                }
                
                // Check 2x2 box
                const startRow = Math.floor(r / 2) * 2;
                const startCol = Math.floor(c / 2) * 2;
                for (let br = startRow; br < startRow + 2; br++) {
                    for (let bc = startCol; bc < startCol + 2; bc++) {
                        if (br !== r || bc !== c) {
                            if (currentPuzzle[br][bc] === value) {
                                cellEl.classList.add('invalid');
                                isValid = false;
                            }
                        }
                    }
                }
            }
        }

        if (showMessageS) {
            if (isValid) {
                if (checkWin()) {
                    showMessage('Congratulations! You Solved Sudoku.');
                } else {
                    showMessage('The board is still valid. Keep going!');
                }
            } else {
                showMessage('There are errors on the board. Check the cells in red.');
            }
        }

        return isValid;
    }

    function checkWin() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentPuzzle[r][c] === 0) {
                    return false;
                }
            }
        }
        return validateBoard(false);
    }

    function startNewGame() {
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        initializeGame(puzzles[randomIndex]);
        showMessage('New game started. Good luck!');
    }

    function resetGame() {
        initializeGame(initialPuzzle);
        showMessage('Restarting the game to its initial state.');
    }

    newGameBtn.addEventListener('click', startNewGame);
    resetGameBtn.addEventListener('click', resetGame);
    checkBoardBtn.addEventListener('click', () => validateBoard(true));
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    startNewGame();
});
/* Código corrigido pela IA Gemini */