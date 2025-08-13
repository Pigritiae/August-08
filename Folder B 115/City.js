const COLS = 10;
const ROWS = 10;
const SIZE = 40;
let grid = [];
let buildType = 'house';

let imgHouse, imgTree, imgRoad, imgStreetLight, imgSand;

function preload() {
    imgHouse = loadImage("img/Pig_House_Build.png");
    imgTree = loadImage("img/Evergreen.png");
    imgRoad = loadImage("img/Road_Turf.png");
    imgStreetLight = loadImage("img/The_Gorge_StreetLight.png");
    imgSand = loadImage("img/Sand.png");
}
function setup() {
    let canvas = createCanvas(COLS * SIZE, ROWS * SIZE);
    canvas.parent('canvas-holder');
    for (let y =0; y < ROWS; y++) {
        grid[y] = [];
        for (let x = 0; x < COLS; x++) {
            grid[y][x] = null;
        }
    }
}
function draw() {
    background(220);
    drawGrid();
}
function drawGrid() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            stroke(180);
            let cell = grid[y][x];
            let bgColor = "#f0f0f0";
            if (cell === 'house') {
                bgColor = "#a0522d";
            } else if (cell === 'road') {
                bgColor = "#b0b0b0"
            } else if (cell === 'tree') {
                bgColor = "#8fbc8f";
            } else if (cell === 'streetLight') {
                bgColor = "#ffe789ff";
            } else if (cell === 'sand') {
                bgColor = "#f5deb3";
            }
            fill(bgColor);
            rect(x * SIZE, y * SIZE, SIZE, SIZE);
        }
    }
}
function mousePressed() {
    let col = floor(mouseX / SIZE);
    let row = floor(mouseY / SIZE);
    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
        grid[row][col] = buildType;
    }
}
function setBuildType(type) {
    buildType = type;
}