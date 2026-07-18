let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let gameOverMenu = document.querySelector(".gameOver");
let image = document.querySelector(".image");
let record = document.getElementById("recordCount")
let score = document.getElementById("scoreCount")

let cubeY = canvas.height - 132;
let velocity = 0;
let gravity = 1;
let jumping = false;
let cubeX = 600;
let speed = 5;
let deathAnimation = false;
let lastMilestone = 0;

//let running = true;

let boxes = [];
newBox();
function newBox(){
    boxes.push({
        x: canvas.width,
        y:canvas.height - 122,
        width: 40,
        height: 40,
        spawnDistance: Math.floor(Math.random() * 300) + 301,//////////////////////////////
        passed: false
    })
}
let current;
let rotation = 0;
let gameMode = 'start';

function grounds() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    ctx.beginPath()
    ctx.moveTo(0, canvas.height-80)
    ctx.lineTo(canvas.width, canvas.height-80)
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();


    
    if (jumping){
        cubeY -= velocity;
        velocity -= gravity;//-=
        
        if (velocity <= 0 && rotation < Math.PI / 2) {
            rotation += 0.1; // 90deg flip
        }
        if (cubeY >= canvas.height - 132){
            if (gameMode== 'start'){//make death animation on have this
                cubeY = canvas.height - 132;
                velocity = 0;
                jumping = false;
                rotation = 0
            }
        }

    }

    for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        box.x -= speed;

        ctx.fillStyle = 'rgb(194, 75, 71)';///////////////////////
        ctx.roundRect(box.x,box.y,box.width,box.height,5);
        ctx. fill()
        
        if (!box.passed && box.x + box.width< 50){
            box.passed = true;
            updateScore();
        }

        let cubeLeft = 50;
        let cubeRight = 100;
        let cubeTop = cubeY;
        let cubeBottom = cubeY + 50;

        let boxLeft = box.x;
        let boxRight = box.x + box.width;
        let boxTop = box.y;
        let boxBottom = box.y + box.height;

        let xCollision = cubeRight > boxLeft && cubeLeft < boxRight;
        let yCollision = cubeBottom > boxTop && cubeTop < boxBottom;

        if (xCollision && yCollision) {
            gameOver();
        }
    }

    let lastBox = boxes[boxes.length-1];

    if (lastBox.x < canvas.width - lastBox.spawnDistance){
        newBox()
    }

    //cuube
    if (deathAnimation && !jumping) {/////////////////////////////////
        cubeY -= 20;
        image.style.display = 'block';
    }
    ctx.save()
    ctx.translate(50 + 25, cubeY + 25);
    ctx.rotate(rotation)
    ctx.fillStyle = 'rgb(71, 176, 194)';
    ctx.fillRect(-25, -25, 50, 50);
    //ctx.fillRect(50,cubeY,50,50);
    ctx.restore()

    if (current % 5 === 0 && current !== 0 && current !== lastMilestone) {
        speed += 1;
        lastMilestone = current;
    }

    requestAnimationFrame(grounds);

}


document.addEventListener('keydown', ()=>{
    if(gameMode == 'start'){
        jump()
    }
    if (gameMode == 'gameOver'){
        restartGame();
    }
});

function jump() {
    if (!jumping) {
        jumping = true;
        velocity = 15; // jump strength
    }//    window.requestAnimationFrame(jump)
}
function gameOver(){
    gameMode = 'gameOver';
    gameOverMenu.style.display = 'block';
    deathAnimation = true;
}
function restartGame(){
    gameOverMenu.style.display = "none";
    image.style.display = 'none';
    score.innerHTML = 0;
    jumping = false
    velocity = 0;
    lastMilestone = 0;
    speed = 5
    rotation = 0
    boxes = []
    newBox()
    cubeY = canvas.height - 132;
    gameMode = "start";
    deathAnimation =false;
}
let newRecord = 0;

function updateScore(){
    if (gameMode != 'gameOver'){
        current = boxes.filter(b=>b.passed).length
        score.innerHTML = current;
        if (current > newRecord){
            newRecord = current;
            record.innerHTML = newRecord;
        }
    }
}

grounds()


