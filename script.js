class Game {
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

        this.init();
    }



    init() {

        // Création d'une grille
        //  fill() combinée à map() permet de créer un tableau de 6 lignes contenant chacune 7 colonnes
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

        // Récupération de l'index de la colonne cliquée via l'élément le plus proche ayant la classe 'column'
        const col = e.target.closest('.column')?.dataset.col;
        if (col === undefined || this.isColumnFull(col)) return;

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


    // match null
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

        // Sélectionne la colonne correspondante dans le DOM
        const column = this.boardElement.children[col];


        // L'index de la cellule dans le DOM est inversé (la première ligne de la grille se trouve en bas)
        const cell = column.children[this.rows - 1 - row];
        cell.style.backgroundColor = this.players[this.currentPlayer - 1].color;
    }

    checkWin(row, col) {
        // Définit les 4 directions à vérifier :
        // Horizontal : [0, 1] (droite) et [0, -1] (gauche)
        //  Vertical : [1, 0] (bas) et [-1, 0] (haut)
        // Diagonale montante et descendante
        const directions = [
            [[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[1, 1], [-1, -1]],
            [[1, -1], [-1, 1]]
        ];

        
        // Pour chaque paire de directions, je compte les jetons a la suite du joueur courant
        return directions.some(direction => {
            let count = 1;


            direction.forEach(([dx, dy]) => {
                let x = +row + dx;
                let y = +col + dy;
                
                
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
}

new Game();