
var canvas = /** @type {HTMLCanvasElement} */(null);
var ctx = /** @type {CanvasRenderingContext2D} */(null);

var time = 0,
    fps = 0,
    framesAcum = 0,
    acumDelta = 0;
var targetDT = 1/60; // 60 fps
var globalDT;

// game variables
var assets = {
    smoke: {
        img: null,
        path: "./assets/smoke.png"
    },
    snow: {
        img: null,
        path: "./assets/snow.png"
    },
    waterdrop: {
        img: null,
        path: "./assets/waterdrop.png"
    }
}

const rainParticlesConfig = {
    maxParticleCount: 1000,

    globalCompositeOperation: "source-over",

    emitterType: 1,

    AREA_X1: -200,
    AREA_Y1: -100,
    AREA_X2: 700,
    AREA_Y2: -100,

    MIN_INITIAL_VELOCITY: 400,
    MAX_INITIAL_VELOCITY: 800,

    MIN_DIRECTION_X: 0.15,
    MAX_DIRECTION_X: 0.25,

    MIN_DIRECTION_Y: 1,
    MAX_DIRECTION_Y: 1,

    MIN_OPACITY_DECREMENT_VELOCITY: 0.1,
    MAX_OPACITY_DECREMENT_VELOCITY: 1,

    MIN_INITIAL_SCALE: 0.25,
    MAX_INITIAL_SCALE: 0.33,

    MIN_SCALE_VELOCITY: 0,
    MAX_SCALE_VELOCITY: 0,

    MIN_INITIAL_ROTATION: -0.05,
    MAX_INITIAL_ROTATION: 0.05,

    MIN_ROTATION_VELOCITY: 0.001,
    MAX_ROTATION_VELOCITY: 0.01,

    MIN_TIME_TO_SPAWN_PARTICLE: 0.001,
    MAX_TIME_TO_SPAWN_PARTICLE: 0.002
}

const snowParticlesConfig = {
    maxParticleCount: 1000,

    globalCompositeOperation: "source-over",

    emitterType: 1,

    AREA_X1: -100,
    AREA_Y1: -100,
    AREA_X2: 750,
    AREA_Y2: -100,

    MIN_INITIAL_VELOCITY: 30,
    MAX_INITIAL_VELOCITY: 60,

    MIN_DIRECTION_X: -0.25,
    MAX_DIRECTION_X: 0.25,

    MIN_DIRECTION_Y: 1,
    MAX_DIRECTION_Y: 1,

    MIN_OPACITY_DECREMENT_VELOCITY: 0.05,
    MAX_OPACITY_DECREMENT_VELOCITY: 0.15,

    MIN_INITIAL_SCALE: 0.05,
    MAX_INITIAL_SCALE: 0.25,

    MIN_SCALE_VELOCITY: 0,
    MAX_SCALE_VELOCITY: 0.01,

    MIN_INITIAL_ROTATION: 0,
    MAX_INITIAL_ROTATION: PI2,

    MIN_ROTATION_VELOCITY: 0.1,
    MAX_ROTATION_VELOCITY: 0.5,

    MIN_TIME_TO_SPAWN_PARTICLE: 0.001,
    MAX_TIME_TO_SPAWN_PARTICLE: 0.002
}

const smokeParticlesConfig = {
    maxParticleCount: 100,

    globalCompositeOperation: "source-over",

    emitterType: 0,

    MIN_INITIAL_VELOCITY: 10,
    MAX_INITIAL_VELOCITY: 60,

    MIN_DIRECTION_X: -1,
    MAX_DIRECTION_X: 1,

    MIN_DIRECTION_Y: -1,
    MAX_DIRECTION_Y: 1,

    MIN_OPACITY_DECREMENT_VELOCITY: 0.5,
    MAX_OPACITY_DECREMENT_VELOCITY: 2,

    MIN_INITIAL_SCALE: 0.05,
    MAX_INITIAL_SCALE: 0.5,

    MIN_SCALE_VELOCITY: 0.25,
    MAX_SCALE_VELOCITY: 0.5,

    MIN_INITIAL_ROTATION: 0,
    MAX_INITIAL_ROTATION: PI2,

    MIN_ROTATION_VELOCITY: 0.05,
    MAX_ROTATION_VELOCITY: 0.15,

    MIN_TIME_TO_SPAWN_PARTICLE: 0.1,
    MAX_TIME_TO_SPAWN_PARTICLE: 0.01
}

var particleSystem = null;
var background = null;

function LoadImages(assets, onloaded) {
    let imagesToLoad = 0;
    
    const onload = () => --imagesToLoad === 0 && onloaded();

    /*const onload = function() {
        --imagesToLoad;
        if (imagesToLoad === 0) {
            onloaded();
        }
    }*/

    // iterate through the object of assets and load every image
    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) {
            imagesToLoad++; // one more image to load

            // create the new image and set its path and onload event
            const img = assets[asset].img = new Image;
            img.src = assets[asset].path;
            img.onload = onload;
        }
     }
    return assets;
}

function Init() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    // input setup
    SetupKeyboardEvents();
    SetupMouseEvents();
    
    // assets loading
    LoadImages(assets, () => {
        Start();
        Loop();
    });
}

function Start() {
    time = performance.now();

    background = new ColorChangingBackground();
    particleSystem = new ParticleSystem(assets.smoke.img);
}

function Loop() {
    requestAnimationFrame(Loop);
    
    // compute FPS
    let now = performance.now();

    let deltaTime = (now - time) / 1000;
    globalDT = deltaTime;

    time = now;

    framesAcum++;
    acumDelta += deltaTime;

    if (acumDelta >= 1) {
        fps = framesAcum;
        framesAcum = 0;
        acumDelta -= 1;
    }

    if (deltaTime > 1000)
        return;

    // Game logic -------------------
    Update(deltaTime);

    // Draw the game ----------------
    Draw();

    // reset input data
    Input.PostUpdate();
}

function Update(deltaTime) {
    // A / S / D / F: change the particle system
    if (Input.IsKeyDown(KEY_A))
        particleSystem = new ParticleSystem(assets.smoke.img);
    if (Input.IsKeyDown(KEY_S))
        particleSystem = new ParticleSystem(assets.smoke.img, smokeParticlesConfig);
    if (Input.IsKeyDown(KEY_D))
        particleSystem = new ParticleSystem(assets.waterdrop.img, rainParticlesConfig);
    if (Input.IsKeyDown(KEY_F))
        particleSystem = new ParticleSystem(assets.snow.img, snowParticlesConfig);

    // Q: change the background
    if (Input.IsKeyDown(KEY_Q)) {
        if (background.constructor.name === 'ColorChangingBackground') {
            // set the rainbow background
            canvas.setAttribute('style', 'background-color: black');
            background = new ColorRainbowBackground();
        }
        else if (background.constructor.name === 'ColorRainbowBackground') {
            // set the color changing background
            canvas.setAttribute('style', 'background-color: white');
            background = new ColorChangingBackground();
        }
    }

    background.Update(deltaTime);

    particleSystem.emitter.position.x = Input.mouse.x;
    particleSystem.emitter.position.y = Input.mouse.y;

    particleSystem.Update(deltaTime);
}

function Draw() {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (background.constructor.name === 'ColorChangingBackground') {
        // draw the background behind the particles
        // draw the background
        background.Draw(ctx);
        // draw the particle system
        particleSystem.Draw(ctx);
    }
    else if (background.constructor.name === 'ColorRainbowBackground') {
        // draw the background over the particles
        // draw the particle system
        particleSystem.Draw(ctx);
        // draw the background
        background.Draw(ctx);
    }

    // draw the fps
    DrawStats(ctx);
}

function DrawStats(ctx) {
    ctx.textAlign = "start";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(2, 2, 110, 54);
    ctx.fillStyle = "white";
    ctx.font = "12px Comic Sans MS regular";
    
    
    ctx.fillText("FPS: " + fps, 6, 14);
    ctx.fillText("FPS (dt): " + (1 / globalDT).toFixed(2), 6, 32);
    ctx.fillText("deltaTime: " + (globalDT).toFixed(4), 6, 50);
}

window.onload = Init;
