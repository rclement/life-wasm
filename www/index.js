import { Universe, Cell } from "life-wasm";
import { memory } from "life-wasm/life_wasm_bg";
import Bulma from "bulma";

const playPauseButton = document.getElementById("play-pause");
const randomizeButton = document.getElementById("randomize");
const clearButton     = document.getElementById("clear");
const widthInput      = document.getElementById("width-input");
const heightInput     = document.getElementById("height-input");
const canvas          = document.getElementById("life-canvas");

const CELL_SIZE   = 5;
const GRID_COLOR  = "#aaaaaa";
const DEAD_COLOR  = "#000000";
const ALIVE_COLOR = "#ffffff";

let universe    = null;
let ctx         = null;
let animationId = null;

const getIndex = (row, col) => {
  const width   = universe.width();

  return row * width + col;
}

const clearCells = () => {
  const width   = universe.width();
  const height  = universe.height();

  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      universe.set_cell(row, col, Cell.Dead);
    }
  }
}

const randomizeCells = () => {
  const width   = universe.width();
  const height  = universe.height();

  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      const state = Math.random() < 0.5 ? Cell.Dead : Cell.Alive;
      universe.set_cell(row, col, state);
    }
  }
}

const createCanvas = () => {
  canvas.height = (CELL_SIZE + 1) * universe.height() + 1;
  canvas.width  = (CELL_SIZE + 1) * universe.width()  + 1;
  ctx           = canvas.getContext("2d");
}

const drawGrid = () => {
  const width   = universe.width();
  const height  = universe.height();

  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  for (let i = 0; i <= width; ++i) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  for (let i = 0; i <= height; ++i) {
    ctx.moveTo(0,                           i * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, i * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
}

const drawCells = () => {
  const width     = universe.width();
  const height    = universe.height();
  const cellsPtr  = universe.cells();
  const cells     = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
}

const createUniverse = () => {
  const width   = Number.parseInt(widthInput.value);
  const height  = Number.parseInt(heightInput.value);

  universe = Universe.new(width, height);

  clearCells();
  createCanvas();
  drawGrid();
  drawCells();
}

const renderLoop = () => {
  universe.tick();
  drawCells();

  animationId = requestAnimationFrame(renderLoop);
}

const isPaused = () => {
  return animationId === null;
};

const play = () => {
  playPauseButton.textContent = "pause";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "play";
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener("click", event => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

randomizeButton.addEventListener("click", event => {
  randomizeCells();
  drawCells();
});

clearButton.addEventListener("click", event => {
  clearCells();
  drawCells();
});

widthInput.addEventListener("change", event => {
  createUniverse();
})

heightInput.addEventListener("change", event => {
  createUniverse();
})

canvas.addEventListener("click", event => {
  const width   = universe.width();
  const height  = universe.height();

  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  universe.toggle_cell(row, col);

  drawCells();
});

createUniverse();
pause();
