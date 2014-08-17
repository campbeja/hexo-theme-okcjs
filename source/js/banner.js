/*
function animateCanvas(cj, canvas) {
  var stage = new cj.Stage(canvas)

  var ball = new cj.Shape();
  ball.graphics.beginFill("000000").drawCircle(0, 0, 50);
  ball.x = 10;
  ball.y = 200;

  cj.Tween.get(ball, {
    loop: true
  }).to({
    x: 450
  }, 3000)


  cj.Ticker.addEventListener('tick', tick)

  stage.addChild(ball);

  function tick() {
    stage.update()
  }
}


(function (cj) {
  var canvas = document.getElementById('banner-whizbang');
  var banner = document.getElementById('banner');
  var context = canvas.getContext('2d');
  
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    
    
    
    canvas.width = $(banner).width();
    canvas.height = $(banner).height();
    drawStuff();
  }
  resizeCanvas();

  function drawStuff() {
    animateCanvas(cj,canvas);
  }
})(createjs);
*/