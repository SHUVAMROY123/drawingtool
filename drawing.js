const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const colorPicker = document.getElementById("color");
const brushSize = document.getElementById("brushSize");
const sizeValue = document.getElementById("sizeValue");

const brushBtn = document.getElementById("brushBtn");
const lineBtn = document.getElementById("lineBtn");
const rectBtn = document.getElementById("rectBtn");
const circleBtn = document.getElementById("circleBtn");
const eraserBtn = document.getElementById("eraserBtn");

const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");



let isDrawing = false;

let startX = 0;
let startY = 0;

let currentColor = "#000000";
let currentSize = 5;

let currentTool = "brush";



function setupCanvas() {

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

setupCanvas();



function getPosition(event) {

  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}



function updateStyle() {

  ctx.lineWidth = currentSize;

  ctx.lineCap = "round";

  ctx.lineJoin = "round";

  if (currentTool === "eraser") {

    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#ffffff";

  } else {

    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
  }
}



canvas.addEventListener("pointerdown", function(event) {

  isDrawing = true;

  const position = getPosition(event);

  startX = position.x;
  startY = position.y;

  ctx.beginPath();

  ctx.moveTo(startX, startY);

  updateStyle();

  
  if (
    currentTool === "brush" ||
    currentTool === "eraser"
  ) {

    drawDot(startX, startY);
  }

  canvas.setPointerCapture(event.pointerId);
});



canvas.addEventListener("pointermove", function(event) {

  if (!isDrawing) return;

  const position = getPosition(event);

  const currentX = position.x;
  const currentY = position.y;


  

  if (currentTool === "brush") {

    ctx.lineTo(currentX, currentY);

    ctx.stroke();
  }


  
  else if (currentTool === "eraser") {

    ctx.lineTo(currentX, currentY);

    ctx.stroke();
  }


  

  else if (currentTool === "line") {

    redrawCanvas();

    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(currentX, currentY);

    ctx.stroke();
  }


  
  else if (currentTool === "rectangle") {

    redrawCanvas();

    const width = currentX - startX;
    const height = currentY - startY;

    ctx.strokeRect(
      startX,
      startY,
      width,
      height
    );
  }


  
  else if (currentTool === "circle") {

    redrawCanvas();

    const radius = Math.sqrt(
      Math.pow(currentX - startX, 2) +
      Math.pow(currentY - startY, 2)
    );

    ctx.beginPath();

    ctx.arc(
      startX,
      startY,
      radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }

});




canvas.addEventListener("pointerup", function(event) {

  if (!isDrawing) return;

  const position = getPosition(event);

  const endX = position.x;
  const endY = position.y;

  updateStyle();


  // Final line
  if (currentTool === "line") {

    ctx.beginPath();

    ctx.moveTo(startX, startY);

    ctx.lineTo(endX, endY);

    ctx.stroke();
  }


  // Final rectangle
  else if (currentTool === "rectangle") {

    const width = endX - startX;
    const height = endY - startY;

    ctx.strokeRect(
      startX,
      startY,
      width,
      height
    );
  }


  
  else if (currentTool === "circle") {

    const radius = Math.sqrt(
      Math.pow(endX - startX, 2) +
      Math.pow(endY - startY, 2)
    );

    ctx.beginPath();

    ctx.arc(
      startX,
      startY,
      radius,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }


  isDrawing = false;

  ctx.closePath();

});

canvas.addEventListener("pointercancel", function() {

  isDrawing = false;

});



function drawDot(x, y) {

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    currentSize / 2,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    currentTool === "eraser"
      ? "#ffffff"
      : currentColor;

  ctx.fill();
}



let savedImage = null;

function saveCurrentCanvas() {

  savedImage = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
}



function redrawCanvas() {

  if (savedImage) {

    ctx.putImageData(
      savedImage,
      0,
      0
    );

  } else {

    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  updateStyle();
}



const buttons = [
  brushBtn,
  lineBtn,
  rectBtn,
  circleBtn,
  eraserBtn
];


function selectTool(tool, button) {

  currentTool = tool;

  buttons.forEach(function(btn) {

    btn.classList.remove("active");

  });

  button.classList.add("active");

  updateStyle();
}



brushBtn.addEventListener("click", function() {

  selectTool("brush", brushBtn);

});



lineBtn.addEventListener("click", function() {

  selectTool("line", lineBtn);

});



rectBtn.addEventListener("click", function() {

  selectTool("rectangle", rectBtn);

});


// Circle
circleBtn.addEventListener("click", function() {

  selectTool("circle", circleBtn);

});



eraserBtn.addEventListener("click", function() {

  selectTool("eraser", eraserBtn);

});



colorPicker.addEventListener("input", function(event) {

  currentColor = event.target.value;

  if (currentTool === "eraser") {

    currentTool = "brush";

    brushBtn.classList.add("active");
    eraserBtn.classList.remove("active");
  }

  updateStyle();

});



brushSize.addEventListener("input", function(event) {

  currentSize = Number(event.target.value);

  sizeValue.textContent = currentSize;

  updateStyle();

});



clearBtn.addEventListener("click", function() {

  const confirmClear =
    confirm("Are you sure you want to clear the canvas?");

  if (!confirmClear) return;

  ctx.fillStyle = "#ffffff";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  savedImage = null;

});



saveBtn.addEventListener("click", function() {

  const link = document.createElement("a");

  link.download = "my-drawing.png";

  link.href = canvas.toDataURL("image/png");

  link.click();

});



updateStyle();
