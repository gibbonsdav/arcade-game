const rulesBtn = document.getElementById("rules-btn")
const closeBtn = document.getElementById("close-btn")
const rules = document.getElementById("rules")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let score = 0

const brickRowCount = 9
const brickColumnCount = 5

// Making the ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
  visible: true,
}

// Making the paddle
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true,
}

// Create Brick Props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
}

// create bricks
const bricks = []
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = []
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY
    bricks[i][j] = { x, y, ...brickInfo }
  }
}

// Drawing the ball
function drawBall() {
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
  ctx.fillStyle = ball.visible ? "#0095dd" : "transparent"
  ctx.fill()
  ctx.closePath()
}

// draw the paddle
function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
  ctx.fillStyle = paddle.visible ? "#0095dd" : "transparent"
  ctx.fill()
  ctx.closePath()
}

//Draw score in canvas
function drawScore() {
  ctx.font = "20px Arial"
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30)
}

// draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath()
      ctx.rect(brick.x, brick.y, brick.w, brick.h)
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent"
      ctx.fill()
      ctx.closePath()
    })
  })
}

//move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w
  }
  if (paddle.x < 0) {
    paddle.x = 0
  }
}

//move ball on canvas
function moveBall() {
  ball.x += ball.dx
  ball.y += ball.dy

  //wall collision (right or left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1 //same as ball.dx = ball.dx * -1
  }

  //wall collision (top and bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1
  }

  // paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed
  }

  // brick collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1
          brick.visible = false

          increaseScore()
        }
      }
    })
  })

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks()
    score = 0
  }
}

// Increase score
function increaseScore() {
  score++
  if (score % (brickRowCount * brickColumnCount) === 0) {
    ball.visible = false
    paddle.visible = false
    //After 0.5 sec restart the game
    setTimeout(function () {
      showAllBricks()
      score = 0
      paddle.x = canvas.width / 2 - 40
      paddle.y = canvas.height - 20
      ball.x = canvas.width / 2
      ball.y = canvas.height / 2
      ball.visible = true
      paddle.visible = true
    }, delay)
  }
}

//show all the bricks
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true))
  })
}

function draw() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()
  drawPaddle()
  drawScore()
  drawBricks()
}

//update canvas drawing and animation
function update() {
  movePaddle()
  moveBall()
  //draw everything
  draw()

  requestAnimationFrame(update)
}

update()

//keydown event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed
  }
}

//keyup event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0
  }
}

//keyboard event handler
document.addEventListener("keydown", keyDown)
document.addEventListener("keyup", keyUp)

//Rules and closing event handlers
rulesBtn.addEventListener("click", () => rules.classList.add("show"))
closeBtn.addEventListener("click", () => rules.classList.remove("show"))
