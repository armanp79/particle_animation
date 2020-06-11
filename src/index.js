import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as PIXI from 'pixi.js';
import songFile from './levels.mp3';

// particle info
const numParticles = 5000;
const radiusParticle = 2;

//colors
let theme = {
    pinkBlue:[0xFF0032, 0xFF5C00, 0x00FFB8, 0x53FF00,0xFF0032],
    yellowGreen:[0xF7F6AF, 0x9BD6A3, 0x4E8264, 0x1C2124, 0xD62822],
    yellowRed:[0xECD078, 0xD95B43, 0xC02942, 0x542437, 0x53777A],
    blueGray:[0x343838, 0x005F6B, 0x008C9E, 0x00B4CC, 0x00DFFC],
    blackWhite:[0xFFFFFF, 0x000000, 0xFFFFFF, 0x000000, 0xFFFFFF]
  }

let TOTAL_BANDS = 256
let theme_name = ['pinkBlue','yellowGreen','yellowRed','blueGray','blackWhite']
let theme_arr = []
let indexColor = 0;
let tint_num = 0

//position
let initX = 0;
let initY = 0;
let cp = new PIXI.Point();

//pixi
let app = null;
let arrCircles = [];
// audio
let audio = null;
let analyser = null;
let frequency_array = null;





function init() {
    //resize()
    initAudio()
    build()
    //resize()
    startAnimation()
   
    
}


function play() {
    if(audio.paused) {
        initAudio();
        console.log("playing now");
        //this.context.resume(); 
        audio.play();
        //this.rafId = requestAnimationFrame(this.tick);

     } else {
        console.log("pausing now");
        audio.pause();
        //cancelAnimationFrame(this.rafId);
     }
    
}



function changeTheme() {
    let current_theme = theme_name[tint_num]
    theme_arr = theme[current_theme]
    indexColor = 0
    let padColor = Math.ceil(numParticles / theme_arr.length)


    for (var i = 0; i < numParticles; i++) {
        let circle = arrCircles[i]
    
        let group = indexColor * padColor / numParticles


        circle.blendMode = PIXI.BLEND_MODES.NORMAL
        circle.indexBand = Math.round(group * (TOTAL_BANDS-56))-1
        if (circle.indexBand <= 0) {
        circle.indexBand = 49
        }
        circle.s = (Math.random() + (theme_arr.length-indexColor)*0.2)*0.1

        

        circle.tint = theme_arr[indexColor]
        indexColor++
        if (indexColor === 4) {indexColor = 0}
    }
    tint_num++
    if (tint_num === 5) {tint_num = 0}
}


function initAudio() {
    audio = new Audio(songFile);
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let source = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
    frequency_array = new Uint8Array(analyser.frequencyBinCount);

    console.log(frequency_array[1000])
   
}

function startAnimation () {
    requestAnimationFrame(update);
}


function build() {

    app = new PIXI.Application({
        width: 1000, height: 800, backgroundColor: 0x0000, resolution: window.devicePixelRatio || 1,
    });
    document.body.appendChild(app.view);
    

    buildCircles()
    
    for (var i = 0; i < numParticles; i++) {
        let circle = arrCircles[i]
        app.stage.addChild(circle)
    }
}

function buildCircles() {
    
    for (var i = 0; i < numParticles; i++) {
        let circle = new PIXI.Graphics();
        circle.beginFill(0xFFFFFF);
        circle.drawCircle(initX, initY, radiusParticle);
        
        initX += 15;
        if (i % 50 === 0) {
            initX = 10
            initY += 15
        }
        circle.endFill();
        circle.x = cp.x;
        circle.y = cp.y;
        arrCircles.push(circle)
        
    }
    changeTheme()
    
    
}

function update() {
    requestAnimationFrame(update)
    
    
    
    
    if (audio.paused) {}
    else{
        for (var i = 0; i < numParticles; i++) {
            analyser.getByteTimeDomainData(frequency_array)
            let circle = arrCircles[i]
            let d = frequency_array[i];
            circle.scale.set(d*.02,d*.02)
            circle.lineStyle(1 , 0xFFFFFF, 1 ,0.5, false)
            
            
        }
        
    }
}


init();
ReactDOM.render(
    <div>
        <button className="button" onClick={() => {play()}}>
            Play/Pause
        </button>
        <button className="button" onClick={() => {changeTheme()}}>
            Change Theme
        </button>
    </div>
    ,document.getElementById("root"))









