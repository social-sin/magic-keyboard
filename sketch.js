var noteVelocity = 0.1;
var noteVelocityInput;

var synth;

var fft;
var fftBands = 1024;
var waveform = [];

var keyMap = {};
var baseNote = 60;
var key2keycode = {
"q":"48","a":"49","z":"50","w":"51","s":"52","x":"53","e":"54","d":"55","c":"56","r":"57","f":"65","v":"66","t":"67","g":"68","b":"69","y":"70","h":"71","n":"72","u":"73","j":"74","m":"75","i":"76","k":"77","o":"78","l":"79","p":"80"
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  synth = new p5.MonoSynth();
  noteVelocityInput = createLabeledSlider('Velocity', 0, 1, noteVelocity, 20, 15);
  fft = new p5.FFT(.99, fftBands);
  key_order = "QAZWSXEDCRFVTGBYHNUJMIKOLP1234567890"
  for (var i=0; i<key_order.length; i++) {
    keyMap[key_order[i]] = i;
  }  
}

function draw() {
  background(0);
  drawFFT();
  fill(255);
  stroke(0);
  textAlign(CENTER);
  text("PRESS ANY LETTER KEY", width/2, height/2);
}

function keyPressed() {
  if (key in keyMap) {
    midiNoteNumber = baseNote + keyMap[key];
    synth.triggerAttack(midiToFreq(midiNoteNumber), noteVelocity, 0);
  }
}

function keyReleased() {
  if (key in keyMap) {
    midiNoteNumber = baseNote + keyMap[key];
    synth.triggerRelease();
  }
}

function drawFFT() {
  noFill();
  stroke(255);
  strokeWeight(2);
  waveform = fft.waveform();
  beginShape();
  for (var i = 0; i< waveform.length; i++){
    vertex(i*2, map(waveform[i], -1, 1, height, 0) );
  }
  endShape();
}

function createLabeledSlider(labelText, minVal, maxVal, initVal, xpos, ypos) {
  var slider = createSlider(minVal, maxVal, initVal, 0);
  var label = createElement("label", labelText);
  var numInput = createInput(str(initVal), 'number');
  slider.size(width / 2);
  slider.position(xpos, ypos);
  slider.input(() => {
    numInput.value(slider.value());
    noteVelocity = float(noteVelocityInput.value());
  });
  numInput.size(width / 8);
  numInput.position(xpos + slider.size().width + 10, ypos);
  numInput.input(() => {
    if (numInput.value() > maxVal) {
      slider.value(maxVal);
    } else if (numInput.value() < minVal) {
      slider.value(minVal);
    } else {
      slider.value(numInput.value());
    }
    noteVelocity = float(noteVelocityInput.value());
  });
  label.position(numInput.position().x + numInput.size().width + 10, ypos + 3);
  return numInput;
}
