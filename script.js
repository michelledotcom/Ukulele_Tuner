const model_url = "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

let pitch;
let audioContext;
let mic;
let freq = 0;

let threshold = 1;

let notes = [
  { note: "A", freq: 400 },
  { note: "E", freq: 329 },
  { note: "C", freq: 261 },
  { note: "G", freq: 391 },
];

/*

Some audito context object OK

set-up a mic, when you want the computer to listen to your mic
you call the start method and pass in the callback. 

mic.start callback is where we set-up our pitchDetection ML library
that library requires a model, audioContext, the mic stream which is like the audio input

the pitch detection library usess a callback, which is modelLoaded

modelLoaded, use the pitch object and tell it to getPitch, which is async
so it needs a callback which we've called gotPitch which receves the err
and frequency, but only runs once, so we call it recursively in itself

simplify all this callback shit using async await

*/

function setup() {
  createCanvas(400, 400);

  audioContext = getAudioContext();

  mic = new p5.AudioIn();

  mic.start(listening);
}

function listening() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
  console.log("listening");
}

function gotPitch(err, frequency) {
  if (err) {
    console.log(err);
  } else {
    if (frequency) {
      freq = frequency;
    }
  }

  pitch.getPitch(gotPitch);
}
function modelLoaded() {
  console.log("loaded");
  pitch.getPitch(gotPitch);
}

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(64);
  text(freq.toFixed(2), width / 2, height - 150);

  let closestNote = null;
  let recordDiff = Infinity;

  for (let i = 0; i < notes.length; i++) {
    let diff = abs(freq - notes[i].freq);

    if (abs(diff) < abs(recordDiff)) {
      closestNote = notes[i];
      recordDiff = diff;
    }
  }

  textSize(64);
  text(closestNote.note, width / 2, height - 50);

  let diff = recordDiff;

  let alpha = map(abs(diff), 0, 100, 255, 0);
  rectMode(CENTER);
  fill(255, alpha);
  stroke(255);
  strokeWeight(1);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }

  //building freq box and stroke
  rect(200, 100, 200, 50);

  stroke(255);
  strokeWeight(4);
  line(200, 0, 200, 200);

  noStroke();
  fill(255, 0, 0);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200 + diff / 2, 100, 10, 75);
}
