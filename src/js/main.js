import style from "../css/style.css";
import math from "mathjs";

// DOM Elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const funcInput = document.getElementById("func-input");
const drawButton = document.getElementById("draw-button");

// Constants
const xRange = 20;
const yRange = 20;
// Offset for xPoints, since canvas coordinates start at 0, and not -xRange
const xOffset = xRange;
const yOffset = yRange;

const pointSize = 1;
const pointSeparation = 0.05;

const bigFont = "26px Arial";
const smallFont = "12px Arial";

let unitX;
let unitY;

// Function to draw (should be dynamic)
let currentFunction = "2x^2 + 1";

window.onload = init;

function init() {
  canvas.style.width = window.innerWidth;
  canvas.style.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Set units based on canvas dimensions
  updateUnits();

  // Bind initial events
  bindEvents();

  // Set initial font (config)
  ctx.font = smallFont;

  // Set initial input values
  funcInput.value = currentFunction;

  render();
}

// Set unitX and unitY based on canvas dimensions
function updateUnits() {
  unitX = canvas.width / (xRange * 2);
  unitY = canvas.height / (yRange * 2);
}

// Main render function
function render() {
  // Clear previous frame
  ctx.fillStyle = "#fff";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw next frame
  draw();

  requestAnimationFrame(render);
}

function draw() {
  drawAxis();
  drawFunction(currentFunction);
}

function drawAxis() {
  const width = canvas.width;
  const height = canvas.height;

  ctx.beginPath();

  // Draw y axis
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  // Draw position values on X axis
  for (let i = -xRange; i <= xRange; i++) {
    const finalX = (i + xOffset) * unitX;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.fillText(`| ${i}`, finalX, height / 2);

    if (i === xRange) {
      ctx.font = bigFont;
      ctx.fillText("x", finalX - 20, height / 2 + 35);
      ctx.font = smallFont;
    }

    ctx.fill();
  }

  // Draw position values on Y axis
  for (let i = -yRange; i <= yRange; i++) {
    const finalY = (yOffset - i) * unitY;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.fillText(`- ${i}`, width / 2 - 1, finalY);

    if (i === yRange) {
      ctx.font = bigFont;
      ctx.fillText("y", width / 2 - 35, finalY + 20);
      ctx.font = smallFont;
    }

    ctx.fill();
  }

  // Draw x axis
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);

  ctx.stroke();
}

// Returns image value for a given function and a given x coordinate.
function getImage(funcStr, xVal) {
  return math
    .parse(funcStr)
    .compile()
    .eval({ x: xVal });
}

// Draws a given function.
// It must be provided as an array of coefficients, where each position
// in the array represents the exp value of the variable.
// i.e: [0, 2, 3, 1] := 2x + 3x^2 + x^3
function drawFunction(func) {
  for (let i = -xRange; i <= xRange; i += pointSeparation) {
    // Get codomain image
    let image = getImage(func, i);

    const finalX = (i + xOffset) * unitX;
    const finalY = (yOffset - image) * unitY;

    drawPoint(finalX, finalY);
  }
}

// Draw a point for given x and y values.
function drawPoint(x, y) {
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
}

// Event handlers:

function handleWindowResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Re-calculate units based on new dimensions
  updateUnits();
}

// Set current function to new func value
function handleDrawClick() {
  const funcValue = funcInput.value;
  currentFunction = funcValue;
}

// Event bindings
function bindEvents() {
  window.addEventListener("resize", handleWindowResize);
  drawButton.addEventListener("click", handleDrawClick);
}
