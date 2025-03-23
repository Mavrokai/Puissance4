export class Game {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.currentPlayer = Math.floor(Math.random() * 2) + 1;

        
        this.players = [
            { name: "Joueur 1", color: '#e74c3c', score: 0 },
            { name: "Joueur 2", color: '#f1c40f', score: 0 }
        ];



        this.boardElement = document.querySelector('.board');
        this.resetButton = document.querySelector('.reset');
        this.playerDisplays = document.querySelectorAll('.player');



        this.editButton = document.querySelector('.edit-names');
        this.modalOverlay = document.querySelector('.modal-overlay');
        this.saveButton = document.querySelector('.save-names');
        this.player1Input = document.querySelector('#player1-name');
        this.player2Input = document.querySelector('#player2-name');


        this.player1ColorInput = document.querySelector('#player1-color');
        this.player2ColorInput = document.querySelector('#player2-color');



        this.init();
        this.setupModalListeners();
    }

    init() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.createBoard();
        this.setupEventListeners();
        this.updateDisplay();
    }



    createBoard() {
        this.boardElement.innerHTML = '';
        for (let col = 0; col < this.cols; col++) {
            const column = document.createElement('div');
            column.className = 'column';
            column.dataset.col = col;
            for (let row = 0; row < this.rows; row++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                column.appendChild(cell);
            }
            this.boardElement.appendChild(column);
        }
    }




    handleClick(e) {
        const colElement = e.target.closest('.column');
        if (!colElement) return;
        const col = parseInt(colElement.dataset.col, 10);

        if (isNaN(col) || this.isColumnFull(col)) return;

        const row = this.getAvailableRow(col);
        this.grid[row][col] = this.currentPlayer;

        this.updateCell(row, col);

        if (this.checkWin(row, col)) {

            this.players[this.currentPlayer - 1].score++;
            alert(`${this.players[this.currentPlayer - 1].name} gagne !`);
            this.reset();
        } else {
            if (this.checkDraw()) {

                alert('Match nul !');
                this.reset();
            } else {
                this.switchPlayer();
            }
        }


        this.updateDisplay();
    }

    checkDraw() {
        return this.grid.every(row => row.every(cell => cell !== 0));
    }

    getAvailableRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row][col] === 0) return row;
        }
        return -1;
    }

    isColumnFull(col) {
        return this.grid[0][col] !== 0;
    }

    updateCell(row, col) {

        const column = this.boardElement.children[col];
        const cell = column.children[this.rows - 1 - row];
        cell.style.backgroundColor = this.players[this.currentPlayer - 1].color;
    }




    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[1, 1], [-1, -1]],
            [[1, -1], [-1, 1]]
        ];



        return directions.some(direction => {
            let count = 1;
            direction.forEach(([dx, dy]) => {
                let x = row + dx;
                let y = col + dy;
                while (x >= 0 && x < this.rows &&
                    y >= 0 && y < this.cols &&
                    this.grid[x][y] === this.currentPlayer) {
                    count++;
                    x += dx;
                    y += dy;
                }
            });
            return count >= 4;
        });
    }


    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }



    updateDisplay() {
        this.playerDisplays.forEach((display, index) => {
            const player = this.players[index];
            display.innerHTML = `
                <span class="player-name">${player.name}</span>
                <span class="player-score">${player.score}</span>
            `;
            display.style.backgroundColor = index === this.currentPlayer - 1
                ? player.color
                : '#ffffff33';
        });
    }




    reset() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.boardElement.querySelectorAll('.cell').forEach(cell => {
            cell.style.backgroundColor = '';
        });
        this.currentPlayer = 1;
        this.updateDisplay();
    }



    setupEventListeners() {
        this.boardElement.addEventListener('click', e => this.handleClick(e));
        this.resetButton.addEventListener('click', () => this.reset());
    }

    setupModalListeners() {


        this.editButton.addEventListener('click', () => {
            this.modalOverlay.style.display = 'flex';
            this.player1Input.value = this.players[0].name;
            this.player2Input.value = this.players[1].name;
            this.player1ColorInput.value = this.players[0].color;
            this.player2ColorInput.value = this.players[1].color;
        });


        
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.modalOverlay.style.display = 'none';
            }
        });




        this.saveButton.addEventListener('click', () => {
            this.players[0].name = this.player1Input.value.trim() || "Joueur 1";
            this.players[1].name = this.player2Input.value.trim() || "Joueur 2";
            this.players[0].color = this.player1ColorInput.value;
            this.players[1].color = this.player2ColorInput.value;
            this.modalOverlay.style.display = 'none';
            this.updateDisplay();
        });
    }
}