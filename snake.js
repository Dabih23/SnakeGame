class SnakeGame {
    constructor() {
      this.boardSize = 10;
      this.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
      this.direction = 'right';
      this.apple = {};
      this.score = 0;
      this.bestScore = localStorage.getItem('bestScore') || 0;
      this.board = document.querySelector('.game-board');
      this.scoreElement = document.querySelector('#score');
      this.bestScoreElement = document.querySelector('#best-score');
      this.restartButton = document.querySelector('.restart-button');
      this.render();
      this.start();
      this.addEventListeners();
    }
  
    render() {
      this.board.innerHTML = '';
      for (let i = 0; i < this.boardSize; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < this.boardSize; j++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          if (this.isSnake({ x: j, y: i })) {
            cell.classList.add('snake');
          } else if (this.isApple({ x: j, y: i })) {
            cell.classList.add('apple');
          }
          row.appendChild(cell);
        }
        this.board.appendChild(row);
      }
      this.scoreElement.textContent = `Score: ${this.score}`;
      this.bestScoreElement.textContent = `Best score: ${this.bestScore}`;
    }
  
    start() {
      this.generateApple();
      this.intervalId = setInterval(() => {
        this.move();
        this.render();
      }, 500);
    }
  
    move() {
      const head = this.snake[0];
      let newHead;
      switch (this.direction) {
        case 'up':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'down':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'left':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'right':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }
      if (this.isApple(newHead)) {
        this.snake.unshift(newHead);
        this.score++;
        this.generateApple();
      } else {
        this.snake.pop();
        this.snake.unshift(newHead);
      }
      if (this.isGameOver()) {
        clearInterval(this.intervalId);
        this.handleGameOver();
      }
    }
  
    isSnake({ x, y }) {
      return this.snake.some(segment => segment.x === x && segment.y === y);
    }
  
    isApple({ x, y }) {
      return this.apple.x === x && this.apple.y === y;
    }
  
    generateApple() {
      let apple;
      do {
        apple = {
          x: Math.floor(Math.random() * this.boardSize),
          y: Math.floor(Math.random() * this.boardSize)
        };
      } while (this.isSnake(apple));
      this.apple = apple;
    }
  
    isGameOver() {
      const head = this.snake[0];
      return (
        head.x < 0 ||
        head.x >= this.boardSize ||
        head.y < 0 ||
        head.y >= this.boardSize ||
        this.snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
      );
    }
  
    handleGameOver() {
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        localStorage.setItem('bestScore', this.bestScore);
      }
      this.render();
      this.restartButton.style.display = 'block';
    }
  
    addEventListeners() {
      document.addEventListener('keydown', event => {
        switch (event.key) {
          case 'ArrowUp':
            if (this.direction !== 'down') {
              this.direction = 'up';
            }
            break;
          case 'ArrowDown':
            if (this.direction !== 'up') {
              this.direction = 'down';
            }
            break;
          case 'ArrowLeft':
            if (this.direction !== 'right') {
              this.direction = 'left';
            }
            break;
          case 'ArrowRight':
            if (this.direction !== 'left') {
              this.direction = 'right';
            }
            break;
        }
      });
      this.restartButton.addEventListener('click', () => {
        this.snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }];
        this.direction = 'right';
        this.apple = {};
        this.score = 0;
        this.restartButton.style.display = 'none';
        this.start();
      });
    }
  }
  
  const game = new SnakeGame();