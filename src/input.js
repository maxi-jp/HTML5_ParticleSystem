// key events
var lastPress = null;

const KEY_LEFT  = 37, KEY_A = 65;
const KEY_UP    = 38, KEY_W = 87;
const KEY_RIGHT = 39, KEY_D = 68;
const KEY_DOWN  = 40, KEY_S = 83;
const KEY_PAUSE = 19;
const KEY_SPACE = 32;
const KEY_SCAPE = 27;
const KEY_LSHIFT = 16;

const KEY_0 = 48;
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;

var input = {
    mouse: {
        x: 0,
        y: 0,
        pressed: false
    },
    keyboard: {
        keyup: {},
        keypressed: {}
    },
    isKeyPressed: function(keycode) {
        return this.keyboard[keycode];
    },
    isKeyDown: function(keycode) {
        return this.keyboard.keypressed[keycode];
    },
    isKeyUp: function (keycode) {
        return this.keyboard.keyup[keycode];
    },
    isMousePressed: function () {
        return this.mouse.pressed;
    },
    update: function() {
        for (var property in this.keyboard.keyup) {
            if (this.keyboard.keyup.hasOwnProperty(property)) {
                this.keyboard.keyup[property] = false;
            }
        }
    },
    postUpdate: function () {
        for (var property in this.keyboard.keypressed) {
            if (this.keyboard.keypressed.hasOwnProperty(property)) {
                this.keyboard.keypressed[property] = false;
            }
        }
    }
};

function SetupKeyboardEvents ()
{
    AddEvent(document, "keydown", function (e) {
        console.log(e.keyCode);
        input.keyboard[e.keyCode] = true;
        input.keyboard.keypressed[e.keyCode] = true;
    } );

    AddEvent(document, "keyup", function (e) {
        input.keyboard.keyup[e.keyCode] = true;
        input.keyboard[e.keyCode] = false;
    } );

    function AddEvent (element, eventName, func)
    {
        if (element.addEventListener)
            element.addEventListener(eventName, func, false);
        else if (element.attachEvent)
            element.attachEvent(eventName, func);
    }
}

function SetupMouseEvents ()
{
    // mouse click event
    canvas.addEventListener("mousedown", MouseDown, false);
    // mouse move event
    canvas.addEventListener("mousemove", MouseMove, false);
    // mouse up event
    canvas.addEventListener("mouseup", MouseUp, false);
}

function MouseDown (event)
{
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    input.mouse.pressed = true;

    console.log("MouseDown: " + "X=" + clickX + ", Y=" + clickY);
}

function MouseUp (event)
{
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    input.mouse.pressed = false;

    console.log("MouseUp: " + "X=" + clickX + ", Y=" + clickY);
}

function MouseMove (event)
{
    var rect = canvas.getBoundingClientRect();
    input.mouse.x = event.clientX - rect.left;
    input.mouse.y = event.clientY - rect.top;
    //console.log(input.mouse);
}
