var canvas
var context
var cherryImage
var risImage
var counter
var playTime = 0
var player
var objects = {}

const FRAME_PER_SEC = 60
const IMAGE_SIZE = 32
const PLAYER_VELOCITY = 5

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
    this.id = new Date().getTime().toString(16)  + Math.floor(1000*Math.random()).toString(16)
    objects[this.id] = this
  }
  destroy() {
    delete objects[this.id]
  }
  move() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }
}

window.onload = function() {
  console.log("onload end.")
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
  cherryImage = new Image()
  cherryImage.src = "./cherry.png"
  risImage = new Image()
  risImage.src = "./ris.png"
  player = new GameObject(
    new Vector(canvas.width / 2 - IMAGE_SIZE / 2, canvas.height - IMAGE_SIZE*1.5),
    new Vector(0, 0), risImage)
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
  createDropObject()
  checkCollisionDropObject()
  Object.keys(objects).forEach(key => {
    objects[key].move()
  })
  playTime += 1
  draw()
}

var draw = function() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillText("プレイ時間：" + Math.floor(playTime / FRAME_PER_SEC).toString(), 5, 5 + 12)
  Object.keys(objects).reverse().forEach(key => {
    context.drawImage(objects[key].imageObj, objects[key].pos.x, objects[key].pos.y, IMAGE_SIZE, IMAGE_SIZE)
  });
}

var createDropObject = function() {
  if (playTime / 30 % 2 === 0) {
    new GameObject(
      new Vector(Math.random() * (canvas.width - IMAGE_SIZE), 0),
      new Vector(0, 2),
      cherryImage
    )
  }
}
var checkCollisionDropObject = function() {

}