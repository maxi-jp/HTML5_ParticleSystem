
const PI2 = Math.PI * 2;

var canvas;
var ctx;

var deltaTime = 0;
var targetDT = (1 / 60) * 1000;
var targetDTSeconds = (1 / 60);

var time = 0,
    FPS  = 0,
    frames    = 0,
    acumDelta = 0;

// images references
var smoke, smoke2;

var particleSystem = null;
var background = null;

window.requestAnimationFrame = (function (evt) {
    return window.requestAnimationFrame ||
    	window.mozRequestAnimationFrame    ||
    	window.webkitRequestAnimationFrame ||
    	window.msRequestAnimationFrame     ||
    	function (callback) {
        	window.setTimeout(callback, targetDT);
    	};
}) ();


canvas = document.getElementById("my_canvas");
if (canvas)
{
    ctx = canvas.getContext("2d");
    if (ctx)
    {
        SetupKeyboardEvents();
        SetupMouseEvents();
        
        // load images...
        smoke = new Image();
        smoke.src = "./assets/smoke.png";
        smoke.onload = function() {
            smoke2 = new Image();
            smoke2.src = "./assets/smoke.png";
            smoke2.onload = function() {
                // start the game
                Start();

                Loop();
            }
        }
    }
}

function Start ()
{
    console.log("Start");

    background = new Background();
    particleSystem = new ParticleSystem(200);
}

function Loop ()
{
    //console.log("loop");
    requestAnimationFrame(Loop);
    
    // compute FPS
    var now = Date.now();
    deltaTime = now - time;
    // si el tiempo es mayor a 1 seg: se descarta
    if (deltaTime > 1000)
        deltaTime = 0;
    time = now;

    frames++;
    acumDelta += deltaTime;

    if (acumDelta > 1000)
    {
        FPS = frames;
        frames = 0;
        acumDelta -= 1000;
    }

    // Game logic -------------------
    Update(deltaTime / 1000);

    // Draw the game ----------------
    Draw();

    // reset input data
    input.postUpdate();
}

function Update (deltaTime)
{
    input.update();

    background.Update(deltaTime);

    particleSystem.origin.x = input.mouse.x;
    particleSystem.origin.y = input.mouse.y;

    particleSystem.Update(deltaTime);
}

function Draw ()
{
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the background
    background.Draw(ctx);

    // draw the particle system
    particleSystem.Draw(ctx);

    // reset globalCompositeOperation
    ctx.globalCompositeOperation = 'source-over';

    // FPS
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS";
    ctx.fillText('FPS: ' + FPS, 10, 14);
}
