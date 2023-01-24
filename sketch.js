let canvas;
let numPoints = 100;
let xNoiseFreq = 0.005;
let yNoiseFreq = 0.005;
let xNoiseStep = 1.1;
let yNoiseStep = 1.1;
let xIncrement;
let echoArray = Array();
let echoxOffsetFactor = 10;
let echoyOffsetFactor = 10;
let randomColors = false;
let palette0 = ['#edede9', '#d6ccc2', '#f5ebe0', '#e3d5ca', '#d5bdaf', '#E6DCD1', '#ECE0D5', '#D9C3B6', '#D7D7D4'];
let palette1 = ['#3c1518', '#69140e', '#a44200', '#d58936', '#f2f3ae', '#872B07', '#BD661B', '#371316', '#F3F4B5'];
let palette2 = ['#4a4442', '#6e6867', '#a59c98', '#decccd', '#b89e97', '#8A8280', '#C2B4B3', '#BEA7A0', '#433E3C'];
let palette3 = ['#231f20', '#492924', '#bb4430', '#d79269', '#f1e3c0', '#82372a', '#c96b4d', '#F2E6C6', '#201C1D'];
let palette4 = ['#313238', '#4e4232', '#a08357', '#f1c47b', '#e8ddcb', '#776345', '#C9A469', '#2D2D33', '#EAE0D0'];
let palette5 = ['#1c2321', '#7d98a1', '#5e6572', '#a9b4c2', '#eef1ef', '#6E7F8A', '#848D9A', '#19201E', '#F0F2F0'];
let palettes = [palette0, palette1, palette2, palette3, palette4, palette5];
let currentPaletteIndex = 0;
let currentPalette = palettes[currentPaletteIndex];


// LINE CLASS
class Line {
    constructor(xIncrement, positionInArray, xOffsetFactor, yOffsetFactor, color) {
        this.xIncrement = xIncrement;
        this.positionInArray = positionInArray;
        this.originalxOffsetFactor = xOffsetFactor;
        this.originalyOffsetFactor = yOffsetFactor;
        this.xOffsetFactor = xOffsetFactor;
        this.yOffsetFactor = yOffsetFactor;
        this.noiseValues = Array();
        this.color = color;
    }
    
    draw() {
        stroke(this.color);
        beginShape();
        for (let i = 0; i < this.noiseValues.length; i++) {
            curveVertex(i * xIncrement + (this.positionInArray * this.xOffsetFactor), this.noiseValues[i] + (this.positionInArray * this.yOffsetFactor));
        }
        endShape();
    }
}

// FUNCTIONS INSIDE "MAIN" NOT PART OF A CLASS
function setup() {
    // create canvas
    canvas = createCanvas(windowWidth,windowHeight);  
    // set the canvas as a child of the container element
    canvas.parent("container");
    // call the resize function
    resizeIt();
    stroke(255);
    noFill();
    xIncrement = width * 7 / numPoints;
    // create the leading line that has the most recent noise values
    let randomIndex = Math.floor(Math.random() * (currentPalette.length - 0) + 0);
    let newLine = new Line(width * 7 / numPoints, 0, 0, 0, currentPalette[randomIndex]);
    currentPalette.splice(randomIndex, 1);
    // initialize that line with noise values
    for (let x = 0; x <= width; x += xIncrement) {
        newLine.noiseValues.push(noise(x * xNoiseFreq, frameCount * yNoiseFreq) * height);
    }
    // push leading line to the front of the echoArray
    echoArray.push(newLine);
}

function draw() {
    background(0);
    // update previous lines to have previous noise values from line drawn previously
    for(let i = echoArray.length - 1; i > 0; i--){
        echoArray[i].noiseValues = echoArray[i - 1].noiseValues;
    }
    // draw all of the lines
    for(let i = 0;i < echoArray.length;i++) {
        echoArray[i].draw();
    }
    // update the leading line to have new noise values
    echoArray[0].noiseValues = Array();
    for (let x = 0; x <= width; x += xIncrement) {
        echoArray[0].noiseValues.push(noise(x * xNoiseFreq, frameCount * yNoiseFreq) * height);
    }
}

function keyPressed() {
    changeParams(key);
}

function changeParams(key){
    if (key === 'ArrowUp') {
        yNoiseFreq = yNoiseFreq * yNoiseStep;
        echoArray[0].yNoiseFreq = yNoiseFreq;
    } else if (key === 'ArrowDown') {
        yNoiseFreq = yNoiseFreq / yNoiseStep;
        echoArray[0].yNoiseFreq = yNoiseFreq;
    } else if (key === 'ArrowLeft') {
        xNoiseFreq = xNoiseFreq / xNoiseStep;
        echoArray[0].xNoiseFreq = xNoiseFreq;
    } else if (key === 'ArrowRight') {
        xNoiseFreq = xNoiseFreq * xNoiseStep;
        echoArray[0].xNoiseFreq = xNoiseFreq;
    } else if (key === 'q') {
        if(echoArray.length < 9){
            // add a new line 1
            let randomIndex = Math.floor(Math.random() * (currentPalette.length - 0) + 0);
            let newLine = new Line(width * 7 / numPoints, echoArray.length, -1 * echoxOffsetFactor, -1 * echoyOffsetFactor, currentPalette[randomIndex]);
            currentPalette.splice(randomIndex, 1);
            newLine.xOffsetFactor = newLine.originalxOffsetFactor * Math.abs((mouseX - Math.floor(width  / 2)) / 100);
            newLine.yOffsetFactor = newLine.originalyOffsetFactor * Math.abs((mouseY - Math.floor(height / 2)) / 100);
            echoArray.push(newLine);
            // add new line 2;
            randomIndex = Math.floor(Math.random() * (currentPalette.length - 0) + 0);
            newLine = new Line(width * 7 / numPoints, echoArray.length, 1 * echoxOffsetFactor, 1 * echoyOffsetFactor, currentPalette[randomIndex]);
            currentPalette.splice(randomIndex, 1);
            newLine.xOffsetFactor = newLine.originalxOffsetFactor * Math.abs((mouseX - Math.floor(width  / 2)) / 100);
            newLine.yOffsetFactor = newLine.originalyOffsetFactor * Math.abs((mouseY - Math.floor(height / 2)) / 100);
            echoArray.push(newLine);
            echoxOffsetFactor * 2;
            echoyOffsetFactor * 2;
        }
    } else if (key === 'w') {
        if (echoArray.length != 1){
            currentPalette.push(echoArray[echoArray.length - 1].color);
            echoArray.pop();
            currentPalette.push(echoArray[echoArray.length - 1].color);
            echoArray.pop();
            echoxOffsetFactor / 2;
            echoyOffsetFactor / 2;
        }
    } else if (key === 'e'){
        // return colors back to the current palette
        for(let i in echoArray){
            currentPalette.push(echoArray[i].color);
        }
        // change and update palette index
        currentPaletteIndex += 1;
        if(currentPaletteIndex > 5){
            currentPaletteIndex = 0;
        }
        currentPalette = palettes[currentPaletteIndex];
        // change all of the lines in echoArray to have a new random color
        // new random color from the new current palette
        for(let i in echoArray){
            let randomIndex = Math.floor(Math.random() * (currentPalette.length - 0) + 0);
            echoArray[i].color = currentPalette[randomIndex];
            currentPalette.splice(randomIndex, 1);
        }
    }
}

function resizeIt() {
    // set the width and height variables to match the container size
    w = document.getElementById("container").offsetWidth;
    h = document.getElementById("container").offsetHeight;
    // set the canvas size to match the container size
    resizeCanvas(w, h);
    upperbound = w / 5;
}

function windowResized() {
    // call the resize function when the window is resized
    resizeIt();
}

function mouseMoved(){
    // x offset multiplication
    // x offset appears to be smaller as the mouse moves towards the center of the canvas
    for(let i in echoArray){
        echoArray[i].xOffsetFactor = echoArray[i].originalxOffsetFactor * Math.abs((mouseX - Math.floor(width / 2)) / 100);
        echoArray[i].xOffsetFactor *= mouseX < Math.floor(width / 2) ? 1 : -1;
    }
    // y offset multiplication
    // y offset become smaller as the mouse comes to the center of the screen
    for(let i in echoArray){
        echoArray[i].yOffsetFactor = echoArray[i].originalyOffsetFactor * Math.abs((mouseY - Math.floor(height / 2)) / 100);
        echoArray[i].yOffsetFactor *= mouseY < Math.floor(height / 2) ? 1 : -1;
    }
}
