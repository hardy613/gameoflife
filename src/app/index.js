import '../style/app.scss';
let cellSize = 10;
let width = 960;
let height = 500;
let ctxWidth = width / cellSize;
let ctxHeight = height / cellSize;
let gameInterval = null, canvas, ctx, btnPlay, btnStop;

const initialize2DArray = (w, h) => Array
	.from({ length: h })
	.map(() => Array.from({ length: w }, () => Math.floor(Math.random() * 2)));

let board = initialize2DArray(ctxWidth, ctxHeight);

const fillCell = (r, c, colour = 'firebrick') => {
	ctx.fillStyle = colour;
	ctx.fillRect((c * cellSize) + 1, (r * cellSize) + 1, cellSize - 2, cellSize - 2);
}

const countAliveNeighbours = (r, c) => {
	let alive = 0;
	let topRow = board[r - 1] ? board[r - 1] : board[board.length - 1]
	let bottomRow = board[r + 1] ? board[r + 1] : board[0];
	let topLeft = topRow[c - 1] !== undefined ? topRow[c - 1] : topRow[topRow.length - 1];
	let topRight = topRow[c + 1] !== undefined ? topRow[c + 1] : topRow[0];
	let left = board[r][c - 1] !== undefined ? board[r][c - 1] : board[r][board[r].length - 1];
	let right = board[r][c + 1] !== undefined ? board[r][c + 1] : board[r][0];
	let bottomLeft = bottomRow[c - 1] !== undefined ? bottomRow[c - 1] : bottomRow[bottomRow.length - 1];
	let bottomRight = bottomRow[c + 1] !== undefined ? bottomRow[c + 1] : bottomRow[0];
	if(topLeft === 1) alive++;
	if(topRow[c] === 1) alive++;
	if(topRight === 1) alive++;
	if(left === 1) alive++;
	if(right === 1) alive++;
	if(bottomLeft === 1) alive++;
	if(bottomRow[c] === 1) alive++;
	if(bottomRight === 1) alive++;
	return alive;
}

const calculateGameBoard = () => {
	let newBoard = [];
	for(let r = 0; r < board.length; r++) {
		newBoard[r] = [];
		for(let c = 0; c < board[r].length; c++) {
			newBoard[r][c] = board[r][c];
			let aliveNeighbours = countAliveNeighbours(r, c);
			if(aliveNeighbours < 2 || aliveNeighbours > 3) newBoard[r][c] = 0;
			if(newBoard[r][c] === 0 && aliveNeighbours === 3) newBoard[r][c] = 1;
			fillCell(r, c, newBoard[r][c] === 0 ? 'white' : 'firebrick');
		}
	}
	board = newBoard;
};

const play = () => {
	if(gameInterval === null) {
		gameInterval = setInterval(calculateGameBoard, 0);
		btnPlay.setAttribute('disabled', true);
		btnStop.removeAttribute('disabled');
	}
};

const stop = () => {
	if(gameInterval !== null) {
		clearInterval(gameInterval);
		gameInterval = null;
		btnPlay.removeAttribute('disabled');
		btnStop.setAttribute('disabled', true);
	}
};

const canvasOnClick = e => {
	let r = Math.round(e.offsetY / cellSize) - 1;
	let c = Math.round(e.offsetX / cellSize) - 1;
	board[r][c] = board[r][c] === 0 ? 1 : 0;
	fillCell(r, c, board[r][c] === 0 ? 'white' : 'firebrick');
};

window.onload = () => {
	canvas = document.getElementById('game-board');
	ctx = canvas.getContext('2d');
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);

	ctx.beginPath();

	for(let i = 0; i <= width; i += cellSize) {
		ctx.moveTo(i, 0);
		ctx.lineTo(i, i + height);
	}

	for(let i = 0; i <= height; i += cellSize) {
		ctx.moveTo(0, i);
		ctx.lineTo(i + width, i);
	}

	ctx.closePath();
	ctx.stroke();
	canvas.addEventListener('click', canvasOnClick);

	btnPlay = document.getElementById('play');
	btnStop = document.getElementById('stop');
	btnPlay.addEventListener('click', play);
	btnStop.addEventListener('click', stop);
	calculateGameBoard();
};

window.onunload = () => {
	btnPlay.removeEventListener('click', play);
	btnStop.removeEventListener('click', stop);
	canvas.removeEventListener('click', canvasOnClick);
};
