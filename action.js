var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = self.innerHeight;

canvas.offScreenCanvas = document.createElement('canvas');
canvas.offScreenCanvas.width = self.innerWidth;
canvas.offScreenCanvas.height = self.innerHeight;

let root = document.documentElement;
root.style.setProperty('--window-width', innerWidth + 'px');
root.style.setProperty('--window-height', innerHeight + 'px');

var offScreenCtx = canvas.offScreenCanvas.getContext('2d');

const ctx = canvas.getContext('2d', {alpha: false});

const randomFromRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
 
function Globe(x, y, r, color){
    this.x = x;
    this.y = y;
    this.r = r;
    this.particleNumber = undefined;
    this.globeParticles = [];
    this.color = color;
    this.speed = 0;

    this.reanimate = function(grow, blur, speed){
        //animateFunction();
        this.speed = speed * 0.0375;
        if(grow){
            this.x += this.speed;
            this.y += this.speed - (this.speed * 0.333333);
            this.r += speed * 0.0025;
        }

        if(canvas.height + this.r - this.y > 0){
            this.draw(blur);
        }
        else{
            this.on = false;
        }
    }
    this.drawOffscreen = function(grow, blur, shrink){
        if(grow){
            this.x += this.speed;
            this.y += this.speed - 0.05;
            this.r += 0.01;
        }

        if(canvas.height + this.r - this.y > 0){
            offScreenCtx.beginPath();
            offScreenCtx.fillStyle = `rgba(${this.color}, 0.9)`;
            if(blur)
                offScreenCtx.filter = `blur(${blur})`
            offScreenCtx.arc(canvas.width - Math.floor(this.x), Math.floor(this.y), Math.floor(this.r), 0, Math.PI * 2, false);
            offScreenCtx.fill();
            offScreenCtx.filter = "none";
        }
        else{
            this.on = false;
        }
    }
    this.draw = function(blur){
        ctx.beginPath();
        ctx.fillStyle = `rgba(${this.color}, 0.9)`;
        if(blur)
            ctx.filter = `blur(${blur})`
        ctx.arc(canvas.width - this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.filter = "none";
    }
}


const addImage = function(src, x, y, angle, w, h){
    this.x = x;
    this.y = y;

    this.postion = {x: x, y: y};
    this.size = {width: w, height: h};
    this.rot = angle; //rotate

    this.img = new Image();
    this.img.src = src;

    this.draw = function(y, t = 0){
        this.x -= t;
        this.y = y;
        ctx.drawImage(this.img, this.x , this.y, this.size.width, this.size.height)
    }
}

var perm = [278,401,204,53,273,101,414,228,286,64,436,240,267,361,491,428,146,287,463,181,294,226,25,
            26,379,451,362,309,121,72,177,308,112,336,250,384,443,45,217,405,449,450,46,412,172,158,
            56,114,440,137,59,164,454,416,496,185,18,136,352,90,213,175,426,161,7,182,100,229,241,29,
            49,171,208,36,144,306,474,74,61,147,237,104,148,504,494,434,276,167,390,23,70,93,124,411,
            509,10,472,38,387,98,163,399,65,415,0,73,499,5,323,304,363,372,357,39,281,244,30,319,20,
            366,385,291,427,54,6,367,313,231,135,381,246,37,356,143,394,456,492,490,218,349,446,488,
            316,106,333,393,332,431,262,377,435,133,162,89,448,285,225,248,461,22,77,96,127,122,459,
            168,347,169,359,142,239,466,92,331,277,312,445,487,206,107,115,116,441,69,293,345,221,234,
            301,9,320,57,258,261,430,453,2,66,205,424,410,358,152,154,340,125,321,344,12,288,176,335,
            408,151,392,192,471,383,198,284,113,187,391,400,149,216,506,224,257,117,126,337,292,507,
            15,305,88,189,265,130,290,195,409,318,60,510,406,209,467,282,233,480,354,150,501,140,179,
            95,360,500,47,484,328,271,407,110,52,215,425,247,203,341,478,201,78,139,28,270,82,272,370,
            119,317,413,444,21,11,197,63,43,50,353,232,210,120,350,469,80,31,188,481,511,103,376,99,375,
            429,464,212,202,108,369,368,339,245,251,230,123,260,76,326,351,41,17,134,269,395,438,40,42,
            156,1,388,458,3,460,153,397,264,191,310,16,422,404,62,160,242,24,184,33,259,365,196,193,223,
            299,296,274,14,190,479,79,238,433,334,489,498,311,87,289,19,324,423,236,157,178,71, 303,97,
            432,211,128,346,8,32,477,166,300,503,402,159,283,486,437,194,398,155,396,439,298,199,222,253,
            48,386,58,275,483,380,55,302,314,502,268,220,505,13,455,495,364,442,421,85,180,138,342,173,
            325,183,279,207,475,141,473,348,280,81,44,132,111,75,4,67,508,266,109,355,83,470,243,418,322,
            373,485,235,327,102,118,255,129,343,145,338,457,227,68,34,51,468,295,315,94,214,86,252,462,
            307,374,174,493,389,91,382,403,219,419,200,186,378,420,482,105,27,497,465,263,447,249,329,
            170,165,452,330,476,256,84,297,35,131,371,417,254
  ];

const cerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;
const noise1 = x => {
    x = x * 0.003 % 200;
    return cerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

function snowground(){
    ctx.fillStyle = "#E7DFD5";;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for(var i = 0; i < canvas.width; i++){
        ctx.lineTo(i, canvas.height - noise1(t + i) * 0.6);
    }
    ctx.lineTo(canvas.width, canvas.height)
    ctx.fill();
}

function drawMountain(){
    this.base = Math.random() * canvas.width;
    this.h = Math.random() * canvas.height;

    this.draw = function(){  
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(this.base/2, this.h);
        ctx.lineTo(this.base, canvas.height);
        ctx.fillStyle = "#3B69"
        ctx.closePath();
        ctx.fill();
    }
}

var t = 0;
var opacity = 1;
var sky = `rgba(51, 153, 255, ${opacity})`;

var globe = {moon: new Globe(100, 80, 35, "255, 255, 200"), sun: new Globe(100, 80, 50, "255, 255, 0")}
var mount = new drawMountain();

// var evergreen = new addImage("evrg.png", canvas.width - 100, canvas.height, 0, 100, 100);
// var snowmobile = new addImage("snowmobile2.png", 100, canvas.height/2, 0, 200, 200);
//var player = new addImage("evrg.png", canvas.width / 2, canvas.height/2, 0, 100, 100);

class PlayerCharacter{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.rot = 0; //Math.PI / 180 * 90degrees

    }
}

offScreenCtx.fillStyle = `#204051`;
offScreenCtx.fillRect(0, 0, canvas.width, canvas.height);

var star = [];
for(var i = 0; i < 30; i++){
    let x = randomFromRange(0, canvas.width);
    let y = randomFromRange(0, canvas.height/2);
    let r = randomFromRange(2, 4);
    star.push(new Globe(x, y, r, "255, 255, 255"));
    star[i].drawOffscreen(false, "0.7px", false);
}

// noise.seed(Math.random());
// for (var x = 0; x < canvas.width; x++) {
//     for (var y = 0; y < canvas.height / 2; y++) {
//         // All noise functions return values in the range of -1 to 1.

//         // noise.simplex2 and noise.perlin2 for 2d noise
//         var value = noise.simplex2(x / 100, y / 100) * 127 + 28;
//         offScreenCtx.fillStyle = `rgba(${value}, ${value}, ${value}, 0.1)`;
//         offScreenCtx.fillRect(x, y, 1, 1)
//     }
// }


var speedFactor = 4;
function animate(){
    t += speedFactor;
    
    //This block of comment cost operations frames per sec on single generation
    //of animations

    ctx.fillStyle = `#204051`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var i = 0; i < 10; i++){
        star[i].reanimate(false, "0.7px", false);
    }
    
    ctx.drawImage(canvas.offScreenCanvas, 0, 0);

    globe.moon.reanimate(true, "4px", speedFactor / 2);

    // mount.draw();

    snowground();

    // snowmobile.draw();
    // evergreen.draw(canvas.height - (noise(t + i) * 0.1) - 35, speedFactor);
    requestAnimationFrame(animate);
}
animate();

const pause = ()=>{
    speedFactor = 0;
}
const continued = ()=>{
    speedFactor = 4;
}

let status = document.getElementById("status");
status.onmouseover = pause();
status.onmouseleave = continued();

let options = document.getElementById("options");
options.onmouseover = pause();
options.onmouseleave = continued();

let option_btns = document.querySelectorAll(".options-burger-bgnd");
let modal_views = document.querySelectorAll(".modal");
let checkboxes = document.querySelectorAll('input[type="checkbox"]');

let pauseBtn = document.getElementById("pause-btn");
let gamePaused = document.getElementById("game-paused");
let optionsFlex = document.getElementById("options-flex");

checkboxes.forEach(item => item.checked = false);

option_btns.forEach(item => {
        item.addEventListener('click', (e)=>{
        for(let c = 0; c < modal_views.length; c++){
            if(e.target.parentNode.control != modal_views[c] 
                && e.target != document.getElementById("fullscreen-btn")){
                modal_views[c].checked = false;
            }
        }
        e.target == pauseBtn && gamePaused.checked == true ? optionsFlex.checked = false
        : e.target != document.getElementById("fullscreen-btn")? optionsFlex.checked = true:
        "success";
    });
});

let no = document.querySelectorAll(".no");
no.forEach(elem => {
    elem.addEventListener('click', ()=>{
        modal_views.forEach(item => item.checked = false);
        optionsFlex.checked = false;
    });
});

let quitBtn = document.getElementById("confirm-quit-btn");
quitBtn.addEventListener("click", ()=>{
    window.opener = self;
    window.close();
});