(function (createjs, window) {

  function Cloud(options) {
    this.initialize(options);
  }

  var p = Cloud.prototype = new createjs.Container();

  Cloud.prototype.Container_initialize = p.initialize;

  Cloud.prototype.initialize = function initialize(options) {
    this.Container_initialize();

    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;

    var po = options.particleOptions;

    for (var i = 0; i < options.density; i++) {
      var particle = new createjs.Shape(),
        particleX = Math.random() * options.width,
        particleY = Math.random() * options.height;

      particle
        .graphics
        .beginRadialGradientFill(["rgba(255, 255, 255, " + po.transparency + ")", "rgba(255, 255,255, 0)"], [0, 1], particleX, particleY, 0, particleX, particleY, po.radius)
        .drawCircle(particleX, particleY, po.radius)
        .endFill();

      this.addChild(particle);
    }
  };

  window.Cloud = Cloud;

}(createjs, window));


(function (createjs, window) {
  function Star(options) {
    this.initialize(options);
  }

  var p = Star.prototype = new createjs.Container();



  Star.prototype.Container_initialize = p.initialize;

  Star.prototype.initialize = function initialize(options) {
    this.Container_initialize();

    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius;
    this.opacity = options.opacity;


    var isTwinkler = Math.random() > 0.4;

    var particle = new createjs.Shape();

    particle
      .graphics
      .beginRadialGradientFill([
        "rgba(255, 255, 255, " + options.opacity + ")", "rgba(255, 255, 255, " + (options.opacity * 0) + ")"
      ], [0, 1], options.x, options.y, 0, options.x, options.y, options.radius)
      .drawCircle(options.x, options.y, options.glow)
      .endFill();

    this.addChild(particle);

    if (isTwinkler) {
      var on = (Math.random() * 3000) + 500,
        off = (Math.random() * 3000) + 500;

      createjs
        .Tween
        .get(particle, {
          loop: true
        })
        .to({
          alpha: 0
        }, on)
        .to({
          alpha: 1
        }, off);
    }

  };

  window.Star = Star;

}(createjs, window));


function animateCanvas(cj, canvas) {

  var speed = 200;

  var stage,
    skyline,
    gradientSky,
    timeOfDayGradient,
    sunMoon,
    frontClouds = [],
    backClouds = [],
    stars = [];

  var scale = 2,
    gradientHeight = 1980 * scale,
    start = -gradientHeight + 325,
    end = 0;


  function createImage(url, onLoad, opts) {
    var img = new Image();
    img.src = url;
    img.onload = onLoad;

    var btmp = new cj
      .Bitmap(img)
      .set(opts);

    return btmp;
  }

  function createElements() {
    stage = new cj.Stage(canvas);
    //--
    skyline = new cj.Bitmap('/js/img/okc_skyline.png');

    timeOfDayGradient = createImage('/js/img/TimeOfDayGradient.jpg', loadTodGradient, {
      x: canvas.width * 0.5,
      y: start
    });

    sunMoon = createImage('/js/img/sun_moon_stars.png', loadSunMoon, {
      x: canvas.width * 0.5,
      y: 325
    });

    function rand(lo, high) {
      return (Math.random() * (high - lo)) + lo;
    }

    function fcOptions() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * (rand(3, 7) * 0.1),
        width: rand(150, 250),
        height: rand(30, 70),
        density: rand(25, 50),
        particleOptions: {
          radius: rand(30, 70),
          transparency: rand(0.25, 2) * 0.1
        }
      };
    }

    function bcOptions() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * (rand(3, 7) * 0.1),
        width: rand(100, 200),
        height: rand(25, 50),
        density: rand(25, 50),
        particleOptions: {
          radius: rand(25, 50),
          transparency: rand(2, 6) * 0.1,
        }
      };
    }

    function starOptions() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: rand(1, 3),
        glow: rand(1,5, 6),
        opacity: rand(8, 9) * 0.1
      };
    }


    var fcloudsAmt = rand(10, 30);
    var bCloudsAmt = rand(5, 45);

    var starsAmt = rand(1700, 3000);

    for (var k = 0; k < fcloudsAmt; k++) {
      var opts = fcOptions();
      frontClouds.push(new Cloud(opts));
    }

    for (var k = 0; k < bCloudsAmt; k++) {
      var opts = bcOptions();
      backClouds.push(new Cloud(opts));
    }

    for (var k = 0; k < starsAmt; k++) {
      var opts = starOptions();
      stars.push(new Star(opts));
    }

  }

  function loadTodGradient(evt) {
    timeOfDayGradient.regX = timeOfDayGradient.image.width / 2;
  }

  function loadSunMoon(evt) {
    sunMoon.regY = sunMoon.image.height / 2;
    sunMoon.regX = sunMoon.image.width / 2;
  }

  function addElements() {
    stage.addChild(timeOfDayGradient);

    for (var t = 0, tt = stars.length; t < tt; t++) {
      stage.addChild(stars[t]);
    }

    for (var t = 0, tt = backClouds.length; t < tt; t++) {
      stage.addChild(backClouds[t]);
    }

    stage.addChild(sunMoon);
    stage.addChild(skyline);

    for (var t = 0, tt = frontClouds.length; t < tt; t++) {
      stage.addChild(frontClouds[t]);
    }
  }


  function setAnimations() {

    var _animTodGradient = cj
      .Tween
      .get(timeOfDayGradient, {
        loop: true
      });

    var _animSunMoon = cj
      .Tween
      .get(sunMoon, {
        loop: true
      });




    var gradUp = {
        y: end
      },
      gradDown = {
        y: start
      },
      gradSpeed = (speed * 0.5) * 1000;

    var sunRot = {
        rotation: 360
      },
      sunSpeed = speed * 1000;

    var fcloudspeed = speed * 75,
      bcloudspeed = speed * 150;

    _animTodGradient
      .to(gradUp, gradSpeed)
      .to(gradDown, gradSpeed);

    _animSunMoon
      .to(sunRot, sunSpeed);



    function tweenCloud(cloud, cloudSpeed) {

      var c = cj
        .Tween
        .get(cloud, {
          loop: true
        });

      c
        .to({
          x: canvas.width
        }, cloudSpeed * (canvas.width / cloud.x))
        .to({
          x: 0 - cloud.width
        }, 1)
        .to({
          x: cloud.x
        }, cloudSpeed * (canvas.width / cloud.x));


    }


    for (var t = 0, tt = frontClouds.length; t < tt; t++) {
      tweenCloud(frontClouds[t], fcloudspeed);
    }

    for (var t = 0, tt = backClouds.length; t < tt; t++) {
      tweenCloud(backClouds[t], bcloudspeed);
    }

  }


  function scaleElements() {
    skyline.x = (canvas.width * 0.5) - 450;
    skyline.y = 0;
    timeOfDayGradient.scaleX = timeOfDayGradient.scaleY = scale;
    sunMoon.scaleX = sunMoon.scaleY = 0.4;
  }


  createElements();
  addElements();
  scaleElements();
  setAnimations();


  function tick() {
    stage.update();
  }

  //on repeat
  cj.Ticker.addEventListener('tick', tick);
  createjs.Ticker.setFPS(20);
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
    animateCanvas(cj, canvas);
  }
})(createjs);