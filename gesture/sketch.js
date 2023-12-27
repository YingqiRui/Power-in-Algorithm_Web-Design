// Variables required for gesture recognition
let handpose;
let capture;
let predictions = [];
let oldHandPos;

// About video file
let vid;
let vidPause = false;
let timer = 0;
let timerLimit = 60;

function setup() {
  createCanvas(800, 600);

  capture = createCapture(VIDEO);
  print(capture.width + "--------" + capture.height);
  capture.size(width, height);
  print(capture.width + "--------" + capture.height);

  handpose = ml5.handpose(capture, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
  });

  // Hide the capture element, and just show the canvas
  capture.hide();

  vid = createVideo('assets/Training.mp4', vidLoad);
  vid.size(width, height);
  vid.hide();

  oldHandPos = createVector(-100, 0);
  // setupGhost();
}

function draw() {
  background(255);
  image(vid, 0, 0);
  timer++;

  detectHand();

  // The frame that stopped is automatically saved,
  // and the video speed returns to normal after the person's hand leaves the capture
  if (predictions.length == 0 && vidPause && timer > timerLimit) {
    saveCanvas('myCanvas', 'jpg');
    vid.speed(1);
    vidPause = false;
    timer = 0;
  }

  drawKeypoints();
  // drawGhost();
}

function modelReady() {
  console.log("Model ready!");
}

// This function is called when the video loads
function vidLoad() {
  vid.loop();
}

// A function to get the detected keypoints
function detectHand() {
  let hold = false; // Does the user clench his fist
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    const keypoint1 = prediction.landmarks[0];  // WRIST
    const keypoint2 = prediction.landmarks[5];  // INDEX_FINGER_MCP
    const keypoint3 = prediction.landmarks[8];  // NDEX_FINGER_TIP
    const keypoint4 = prediction.landmarks[9];  // MIDDLE_FINGER_MCP
    const keypoint5 = prediction.landmarks[12];  // MIDDLE_FINGER_TIP
    const keypoint6 = prediction.landmarks[13];  // RING_FINGER_MCP
    const keypoint7 = prediction.landmarks[16];  // RING_FINGER_TIP
    const keypoint8 = prediction.landmarks[17];  // PINKY_MCP
    const keypoint9 = prediction.landmarks[20];  // PINKY_TIP

    // Calculate the distance from the wrist
    let dist1 = dist(keypoint1[0], keypoint1[1], keypoint2[0], keypoint2[1]);
    let dist2 = dist(keypoint1[0], keypoint1[1], keypoint3[0], keypoint3[1]);
    let dist3 = dist(keypoint1[0], keypoint1[1], keypoint4[0], keypoint4[1]);
    let dist4 = dist(keypoint1[0], keypoint1[1], keypoint5[0], keypoint5[1]);
    let dist5 = dist(keypoint1[0], keypoint1[1], keypoint6[0], keypoint6[1]);
    let dist6 = dist(keypoint1[0], keypoint1[1], keypoint7[0], keypoint7[1]);
    let dist7 = dist(keypoint1[0], keypoint1[1], keypoint8[0], keypoint8[1]);
    let dist8 = dist(keypoint1[0], keypoint1[1], keypoint9[0], keypoint9[1]);

    // The faster the manual, the faster the video playback
    if (oldHandPos.x != -100) {
      let dd = dist(oldHandPos.x, oldHandPos.y, keypoint1[0], keypoint1[1]);

      // control speed
      if (dd < width / 2 && !vidPause) {
        vid.speed(map(dd, 0, width / 2, 1, 4));
      }
      // print(dd);

      if (dd < 20 && dist1 > dist2 && dist3 > dist4 && dist5 > dist6 && dist7 > dist8) {
        hold = true;
        print("握拳中……");
      }

    }

    oldHandPos.x = keypoint1[0];
    oldHandPos.y = keypoint1[1];
  }

  // reset oldHandPos.x
  if (predictions.length == 0) {
    oldHandPos.x = -100;
  }

  // Pause video if user clenches fist
  if (hold && !vidPause && timer > timerLimit) {
    vid.speed(0);
    vidPause = true;
    timer = 0;
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const hand = predictions[i];
    for (let j = 0; j < hand.landmarks.length; j += 1) {
      const keypoint = hand.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

