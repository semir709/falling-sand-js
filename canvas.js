const canvas = document.querySelector("canvas");
const width = 800;
const height = 600;
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext("2d");

const gridW = 10;

const creating2dArray = (cols, rows) => {
  const arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0;
    }
  }

  return arr;
};

let colorValue = 1;

const isInCanvas = (x) => {
  return x <= col - 1 && x >= 0;
};

let col = width / gridW;
let row = height / gridW;
let grid = creating2dArray(col, row);
let velocityGrid = creating2dArray(col, row);
const gravity = 0.1;

let dragEnable = false;

let interval = null;

let mouseX = 0;
let mouseY = 0;

// Mouse event
canvas.addEventListener("mousemove", (e) => {
  if (dragEnable) {
    mouseX = Math.floor(e.offsetX / gridW);
    mouseY = Math.floor(e.offsetY / gridW);
    let matrix = 5;
    let extent = Math.floor(matrix / 2);
    for (let i = -extent; i < extent; i++) {
      for (let j = -extent; j < extent; j++) {
        if (Math.random() < 0.75) {
          let col = mouseX + i;
          let row = mouseY + j;
          grid[col][row] = colorValue;
          velocityGrid[col][row] = 1;
        }
      }
    }
  }
  colorValue += 1;
  if (colorValue > 360) {
    colorValue = 1;
  }
});

canvas.addEventListener("mousedown", (e) => {
  dragEnable = true;
  mouseX = Math.floor(e.offsetX / gridW);
  mouseY = Math.floor(e.offsetY / gridW);
  interval = setInterval(() => {
    console.log(e.offsetX, "event");
    let matrix = 5;
    let extent = Math.floor(matrix / 2);
    for (let i = -extent; i < extent; i++) {
      for (let j = -extent; j < extent; j++) {
        if (Math.random() < 0.75) {
          let col = mouseX + i;
          let row = mouseY + j;
          grid[col][row] = colorValue;
          velocityGrid[col][row] = 1;
        }
      }
    }

    colorValue += 1;
    if (colorValue > 360) {
      colorValue = 1;
    }
  }, 100);
});

canvas.addEventListener("mouseup", () => {
  dragEnable = false;
  clearInterval(interval);
});

// Animation
function animation() {
  requestAnimationFrame(animation);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Draw
  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      //drawing grid
      // ctx.beginPath();
      // ctx.rect(i * gridW, j * gridW, gridW, gridW);
      // ctx.stroke();

      // draw sand
      if (grid[i][j] > 0) {
        ctx.beginPath();
        ctx.rect(i * gridW, j * gridW, gridW, gridW);
        ctx.fillStyle = `hsl(${grid[i][j]}, 100%, 50%)`;
        ctx.fill();
      }
    }
  }

  let nextGrid = creating2dArray(col, row);
  let nextVelocityGrid = creating2dArray(col, row);

  // Collision
  for (let i = 0; i < col; i++) {
    for (let j = 0; j <= row; j++) {
      let state = grid[i][j];
      let velocityState = velocityGrid[i][j];
      let moved = false;

      // if it is sand
      if (state > 0) {
        let newPos = parseInt(j + velocityState);
        for (let y = newPos; y > j; y--) {
          let below = grid[i][y];
          //left or right
          let dir = 1;
          if (Math.random() < 0.5) {
            dir *= -1;
          }
          let belowA = -1;
          let belowB = -1;
          if (isInCanvas(i + dir)) {
            belowA = grid[i + dir][y];
          }
          if (isInCanvas(i - dir)) {
            belowB = grid[i - dir][y];
          }
          if (below === 0) {
            nextGrid[i][y] = state;
            nextVelocityGrid[i][y] = velocityState + gravity;
            moved = true;
            break;
          } else if (belowA === 0) {
            nextGrid[i + dir][y] = state;
            nextVelocityGrid[i + dir][y] = velocityState + gravity;
            moved = true;
            break;
          } else if (belowB === 0) {
            nextGrid[i - dir][y] = state;
            nextVelocityGrid[i - dir][y] = velocityState + gravity;
            moved = true;
            break;
          }

          if (state > 0 && !moved) {
            nextGrid[i][j] = state;
            nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
          }
        }
      }
    }
  }
  grid = nextGrid;
  velocityGrid = nextVelocityGrid;
}

animation();
