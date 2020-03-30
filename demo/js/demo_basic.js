let BoundingBox = require('../../index.js');
let canvas = document.getElementById('world');
let ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;


var nRow =  8;    // default number of rows
var nCol = 8;    // default number of columns

w /= nCol;            // width of a block
h /= nRow;            // height of a block

var player1 = {x: 3, y:3, origin_type: BoundingBox.ORIGIN_CENTER, rotation: 0};
var player2 = {x: 5, y:6, origin_type: BoundingBox.ORIGIN_CENTER, rotation: 0};
let player = player1;


/**
 * function made by user2570380
 * https://stackoverflow.com/a/27667424/1356107
 * License CC-BY-SA-3.0
 * @param can 
 * @param nRow
 * @param nCol
 * @returns undefined;
 */
function drawCheckeredBackground() {
    ctx.beginPath();
    ctx.fillStyle = 'gray';
    for (var i = 0; i < nRow; ++i) {
        for (var j = 0, col = nCol / 2; j < col; ++j) {
            ctx.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
        }
    }
    

    ctx.fill();
}


document.body.addEventListener('input', (e) => {
    let classlist = event.target.classList;
    if (classlist.contains("rotation_setting")) {
        player.rotation = e.target.value;
    }
});
document.body.addEventListener("click",  (event) => {
    let classlist = event.target.classList;
    if (classlist.contains("origin_change")) {
        player.origin_type = BoundingBox[event.target.innerText];
    }
    if(classlist.contains('switch_player')) {
        player = (player === player1 ? player2 : player1);
        document.getElementById('rotation_setting').value = player.rotation;
    }
    
  });

let UP=38,DOWN=40,RIGHT=39,LEFT=37;
window.addEventListener('keydown', (e) => {
   if(e.which == UP) {
       player.y -= 1; 
       if(player.y < 0) {
           player.y = nRow-1;
       }
   }
   else if(e.which == DOWN) {
       player.y += 1; 
       if(player.y >= nRow) {
           player.y = 0;
       }
   }
   else if(e.which == LEFT) {
       player.x -= 1; 
       if(player.x < 0) {
           player.x = nCol-1;
       }
   }
   else if(e.which == RIGHT) {
       player.x += 1; 
       if(player.x >= nCol) {
           player.x = 0;
       }
   }
});

function getBB(player) 
{
    return BoundingBox.create(player.origin_type, player.x+0.5, player.y+0.5, 0.5, 0.5, player.rotation);;
}

function drawPlayer(posX, posY, color) 
{   
    posX = (posX * w) + (w / 2);
    posY = (posY * h) + (h / 2);
    var radius = w/4;
    
    ctx.beginPath();
    ctx.arc(posX, posY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(posX, posY, radius / 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}

function drawBB(player, other) 
{

    let bb = getBB(player);
    let bb_other = getBB(other);
    let intersects = bb.intersects(bb_other);
    bb.drawOnCanvas(ctx, w, h ,intersects, 1, 'red',  'goldenrod');
    bb_other.drawOnCanvas(ctx, w, h, intersects, 1, 'red', 'goldenrod');
    
}

function paint() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCheckeredBackground();
    drawBB(player1, player2);
    drawBB(player2, player1);
    drawPlayer(player1.x, player1.y, "green");
    drawPlayer(player2.x, player2.y, "orange");
    window.requestAnimationFrame(paint);
};
paint();

