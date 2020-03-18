var canvas
var context
var bananaImage
var playerImage
var counter
var playTime = 0
var score = 0
var player
var objects = {}

const FRAME_PER_SEC = 60 //メインフレームのFPS
const IMAGE_SIZE = 32 // 使用画像の描画サイズ
const PLAYER_VELOCITY = 5 // プレイヤー移動速度
const SCORE_RISE_POINT = 100 // スコアの上げ幅

class Vector {
  x = 0
  y = 0
  constructor(x,y) {
    this.x = x
    this.y = y
  }
}

class GameObject {
  id
  pos
  vel
  imageObj
  constructor(posVec, velVec, imageObj) {
    this.pos = posVec
    this.vel = velVec
    this.imageObj = imageObj
    //this.id = Math.floor(0xffffffff*Math.random()).toString(16)
    this.id = new Date().getTime().toString(16)
    objects[this.id] = this
  }
  destroy() {
    delete objects[this.id]
  }
  move() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    if (this.pos.y > canvas.height - IMAGE_SIZE*1.5) {
      this.destroy()
    }
  }
}

window.onload = function() {
  // 初期化処理
  initialize()
  // メインフレームを設定
  setInterval(main, 1000 / FRAME_PER_SEC)//30.0)
}

var initialize = function() {
  counter = 0
  canvas = document.getElementById("canvas")
  context = canvas.getContext('2d')
  context.font = "12px Arial"
  bananaImage = new Image()
  bananaImage.src = "./banana.png"
  playerImage = new Image()
  playerImage.src = "./monkey.png"
  player = new GameObject(
    new Vector(canvas.width / 2 - IMAGE_SIZE / 2, canvas.height - IMAGE_SIZE*1.5),
    new Vector(0, 0),
    playerImage)
  // プレイヤー操作を設定
  // メインフレームに合わせて操作を受け付けるべきだが今は簡単さを重視
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowRight':
        player.pos.x += PLAYER_VELOCITY
        break;
      case 'ArrowLeft':
        player.pos.x -= PLAYER_VELOCITY
        break;
    }
  })
}

var main = function() {
  checkCollisionDropObject()
  Object.keys(objects).forEach(key => {
    objects[key].move()
  })
  createDropObject()
  playTime += 1
  draw()
  debugConsole()
}

var draw = function() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  // UI
  context.fillText("プレイ時間：" + Math.floor(playTime / FRAME_PER_SEC).toString(), 5, 5 + 12)
  context.fillText("スコア：" + score, canvas.width - 80 - 5, 5 + 12)

  // GameObject
  Object.keys(objects).reverse().forEach(key => {
    context.drawImage(objects[key].imageObj, objects[key].pos.x, objects[key].pos.y, IMAGE_SIZE, IMAGE_SIZE)
  });
}

var createDropObject = function() {
  if (playTime / 20 % 2 === 0) {
    new GameObject(
      new Vector(Math.random() * (canvas.width - IMAGE_SIZE), 0),
      new Vector(0, 2),
      bananaImage
    )
  }
}
var checkCollisionDropObject = function() {
  Object.keys(objects).forEach(key => {
    if (key === player.id) return
    
    // 当たり判定
    if (player.pos.x <= objects[key].pos.x + IMAGE_SIZE // 左端の判定
      && player.pos.x + IMAGE_SIZE >= objects[key].pos.x // 右端の判定
      && player.pos.y <= objects[key].pos.y + IMAGE_SIZE) { // 上端の判定
      objects[key].destroy()
      score += SCORE_RISE_POINT
    }
  })
}

var debugConsole = function() {
  if (playTime % 400 == 0) {
    console.log(objects)
  }
}