window.graphics = {
  // Set default styles
  currentColor: "black",
  fillStyle: { pattern: "solid", color: "black" },
  lineThickness: 1,
  fontSize: 16,
};

function setcolor(color) {
  window.graphics.currentColor = color;
  ctx.strokeStyle = color;
}

function getcolor() {
  return window.graphics.currentColor;
}

function setbkcolor(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Clear Canvas
function cleardevice() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draw Line
function line(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Draw Rectangle
function rectangle(x1, y1, x2, y2) {
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
}

// Draw Bar (Filled Rectangle)
function bar(x1, y1, x2, y2) {
  ctx.fillStyle = window.graphics.fillStyle.color;
  ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
}

// Circle
function circle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

// Ellipse
function ellipse(x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
  ctx.stroke();
}

// Draw Arc
function arc(x, y, startAngle, endAngle, radius) {
  ctx.beginPath();
  ctx.arc(
    x,
    y,
    radius,
    (Math.PI / 180) * startAngle,
    (Math.PI / 180) * endAngle
  );
  ctx.stroke();
}

// Set Fill Style
function setfillstyle(pattern, color) {
  window.graphics.fillStyle.pattern = pattern;
  window.graphics.fillStyle.color = color;
  ctx.fillStyle = color;
}

// Get pixel color at a given coordinate
function getPixelColor(x, y) {
  const pixelData = ctx.getImageData(x, y, 1, 1).data; // Get RGBA data
  return {
    r: pixelData[0],
    g: pixelData[1],
    b: pixelData[2],
    a: pixelData[3],
  };
}

// Set pixel color at a given coordinate
function setPixelColor(x, y, color) {
  const imageData = ctx.getImageData(x, y, 1, 1);
  imageData.data[0] = color.r; // Red
  imageData.data[1] = color.g; // Green
  imageData.data[2] = color.b; // Blue
  imageData.data[3] = color.a; // Alpha (opacity)
  ctx.putImageData(imageData, x, y);
}

// Compare two colors (checks if they are the same)
function colorsMatch(c1, c2) {
  return c1.r === c2.r && c1.g === c2.g && c1.b === c2.b && c1.a === c2.a;
}

// Flood fill function
function floodfill(x, y, fillColor) {
  const targetColor = getPixelColor(x, y);
  if (colorsMatch(targetColor, fillColor)) {
    // Already filled with the target color, no need to process
    return;
  }

  const stack = [{ x, y }];

  while (stack.length > 0) {
    const { x: currX, y: currY } = stack.pop();
    const currentColor = getPixelColor(currX, currY);

    // If the current pixel matches the target color, fill it and add neighbors to the stack
    if (colorsMatch(currentColor, targetColor)) {
      setPixelColor(currX, currY, fillColor);

      // Add neighboring pixels to the stack
      stack.push({ x: currX + 1, y: currY }); // Right
      stack.push({ x: currX - 1, y: currY }); // Left
      stack.push({ x: currX, y: currY + 1 }); // Down
      stack.push({ x: currX, y: currY - 1 }); // Up
    }
  }
}

// Put Pixel
function putpixel(x, y, color = "red") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

// Get Max X and Y
function getmaxx() {
  return canvas.width;
}
function getmaxy() {
  return canvas.height;
}

// Text Functions
function settextstyle(fontSizeInput) {
  fontSize = fontSizeInput;
  ctx.font = `${fontSize}px Arial`;
}

function outtextxy(x, y, text) {
  ctx.fillStyle = window.graphics.currentColor;
  ctx.fillText(text, x, y);
}

// Delay
function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const { round, ceil, floor } = Math;

const RED = "red";
const PURPLE = "purple";
const YELLOW = "yellow";
const BLACK = "black";
const SOLID_FILL = "solid_fill";
