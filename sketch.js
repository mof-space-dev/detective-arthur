let titleImg;
let scene1Img;
let scene2Img;
let scene3Img;
let scene4Img;

// --- BGM用変数 ---
let titleBgm;
let arthurBgm; // ★ arthur に修正
let endrollsBgm;         
let tobeContinuedBgm;    
let isAudioStarted = false;
let hasEndrollsStarted = false; 

// シーン管理
let gameState = "TITLE";
let stateStartTime = 0;

// 各アニメーション・表示時間（ミリ秒）
const TITLE_DURATION = 8000;    
const SUBTITLE_DURATION = 3500; 
const TRANS_DURATION = 800;     
const SCENE_DURATION = 14000;   

const LANG_CHANGE_TIME = 7000; 

// --- 録画用変数 ---
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

// --- テキスト定義 ---
const scene1TextJP = 
  "私はアーサー。世間では『名探偵アーサー』と呼ばれている……\n" +
  "と言いたいところだが、それは私の妄想で、現実は冴えない探偵事務所の所長だ。\n\n" +
  "最近の依頼といえば、浮気調査か盗聴器の捜索ばかり。\n" +
  "このままでは今月の家賃すら危うい。\n\n" +
  "ああ……誰か私に、身も心も凍るような\n" +
  "シリアスでミステリアスな大事件を運んできてはくれないだろうか。";

const scene1TextEN = 
  "I am Arthur. People call me \"Detective Arthur\"—or rather, that's just my grand delusion. In reality, I'm merely the head of a struggling detective agency.\n\n" +
  "My recent cases consist entirely of infidelity checks and searching for hidden bugs. At this rate, paying this month's rent is out of the question.\n\n" +
  "Ah... if only someone would bring me a truly grave, chilling, and mysterious case...";

// ★ 調整した改行を反映
const scene2TextJP = 
  "……考えに耽りながら夜の街を彷徨ううち……\n" +
  "いつの間にかこの巨大なガラスの針の真下に辿り着いていたようだ。\n" +
  "ふっ……これが現代のバベルの塔か。\n" +
  "しかし……人はここへ登って、一体何になろうというのだ？\n" +
  "眼下に広がる景色を眺めて、何が得られるというのだ？\n\n" +
  "欲望と金が渦巻くこの街で、真実を知る者は……私一人というわけだ。\n";

const scene2TextEN = 
  "...Lost in thought as I wandered the night streets, I found myself standing directly beneath this giant needle of glass.\n\n" +
  "Hmph... A modern Tower of Babel, is it?\n" +
  "But why do people climb it? What do they hope to see looking down upon this city?\n\n" +
  "In this place, dripping with greed and money... I alone hold the truth.";

const scene3TextJP = 
  "……おっと？夜の静寂（しじま）を切り裂き、私を照らし出す幾重ものスポットライト……。\n" +
  "どうしたというのだろうか。何か事件が起きたのか？\n" +
  "最高にシリアスで、ミステリアスな事件が——。\n\n" +
  "ふっ、探偵アーサー、ここに在り。\n" +
  "どうやら私という存在を求める声が、早くもこの街に満ちているらしい。\n" +
  "私の心の奥底から、熱い興奮が込み上げてくるのを感じるよ。";

const scene3TextEN = 
  "...Oh? Piercing the silence of the night, multiple spotlights envelop me...\n" +
  "What could be happening? Has a case unfolded?\n" +
  "A supremely serious and mysterious case—?\n\n" +
  "Hmph. Detective Arthur is here.\n" +
  "It seems the city is already crying out for my presence.\n" +
  "Deep within my heart, I feel a surge of intense excitement.";

const scene4TextJP = 
  "「おい、何やってんだこんな時間に！\n" +
  "そもそもここ立ち入り禁止ですよ！喫煙ダメ！なんだその格好……ホームズ気取りか？\n" +
  "はいはい、ちょっと事務室まで来てください！」\n\n" +
  "「む、無礼者！放せ！私は名探偵アーサーだぞ……うわ待て、引っ張るな！パイプが落ちる！！」\n\n" +
  "「話は事務室で聞こう」";

const scene4TextEN = 
  "\"Hey, what are you doing at this hour?!\n" +
  "This area is strictly OFF-LIMITS! No smoking! What's with that getup... pretending to be Sherlock Holmes?!\n" +
  "Alright, come with us to the office!\"\n\n" +
  "\"I-Impertinent fools! Unhand me! I am Detective Arthur... Whoa, wait, don't pull! My pipe!!\"\n\n" +
  "\"Save it. You can talk at the station.\"";


function preload() {
  titleImg = loadImage('title.png');
  scene1Img = loadImage('scene1.png');
  scene2Img = loadImage('scene2.png');
  scene3Img = loadImage('scene3.png');
  scene4Img = loadImage('scene4.png');

  soundFormats('wav', 'mp3');
  titleBgm = loadSound('title.wav');
  arthurBgm = loadSound('arthur.wav'); // ★ arthur.wav に変更
  endrollsBgm = loadSound('endrolls.wav');         
  tobeContinuedBgm = loadSound('tobe_continued.wav'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  stateStartTime = millis();
}

function draw() {
  background(0);

  push();
  drawGameContent();
  pop();

  drawGlassOverlay(); 
  updateState();      
  drawRecordingIndicator(); 
  
  if (gameState === "FIN") {
    drawTitleButton();
  }
}

function drawGameContent() {
  let elapsed = millis() - stateStartTime;

  if (gameState === "TITLE") {
    image(titleImg, 0, 0, width, height);
    
    if (!isAudioStarted) {
      push();
      fill(255, 255, 255, 180);
      noStroke();
      textAlign(CENTER, BOTTOM);
      textSize(14);
      text("- Click anywhere to start -", width / 2, height - 30);
      pop();
    }
  } else if (gameState === "SUBTITLE") {
    drawSubtitleScreen();
  } else if (gameState === "TRANSITION1") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);
    push();
    translate(-width * ease, 0);
    drawSubtitleScreen();
    pop();
    push();
    translate(width * (1 - ease), 0);
    drawSplitScene(scene1Img, scene1TextJP, scene1TextEN, 0);
    pop();
  } else if (gameState === "SCENE1") {
    drawSplitScene(scene1Img, scene1TextJP, scene1TextEN, elapsed);
  } else if (gameState === "TRANSITION2") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);
    push();
    translate(-width * ease, 0);
    drawSplitScene(scene1Img, scene1TextJP, scene1TextEN, SCENE_DURATION);
    pop();
    push();
    translate(width * (1 - ease), 0);
    drawSplitScene(scene2Img, scene2TextJP, scene2TextEN, 0);
    pop();
  } else if (gameState === "SCENE2") {
    drawSplitScene(scene2Img, scene2TextJP, scene2TextEN, elapsed);
  } else if (gameState === "TRANSITION3") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);
    push();
    translate(-width * ease, 0);
    drawSplitScene(scene2Img, scene2TextJP, scene2TextEN, SCENE_DURATION);
    pop();
    push();
    translate(width * (1 - ease), 0);
    drawSplitScene(scene3Img, scene3TextJP, scene3TextEN, 0);
    pop();
  } else if (gameState === "SCENE3") {
    drawSplitScene(scene3Img, scene3TextJP, scene3TextEN, elapsed);
  } else if (gameState === "TRANSITION4") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);
    push();
    translate(-width * ease, 0);
    drawSplitScene(scene3Img, scene3TextJP, scene3TextEN, SCENE_DURATION);
    pop();
    push();
    translate(width * (1 - ease), 0);
    drawSplitScene(scene4Img, scene4TextJP, scene4TextEN, 0);
    pop();
  } else if (gameState === "SCENE4") {
    drawSplitScene(scene4Img, scene4TextJP, scene4TextEN, elapsed);

    if (elapsed >= 500 && !hasEndrollsStarted && endrollsBgm && isAudioStarted) {
      endrollsBgm.play();
      hasEndrollsStarted = true;
    }

  } else if (gameState === "TRANSITION_FIN") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);
    push();
    translate(-width * ease, 0);
    drawSplitScene(scene4Img, scene4TextJP, scene4TextEN, SCENE_DURATION);
    pop();
    push();
    translate(width * (1 - ease), 0);
    drawFinScreen();
    pop();
  } else if (gameState === "FIN") {
    drawFinScreen();
  }
}

function drawSubtitleScreen() {
  fill(0);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("第１話「タワーの下で…」", width / 2, height / 2 - 20);
  fill(180);
  textSize(18);
  text("— Under the Tower... —", width / 2, height / 2 + 25);
}

function drawSplitScene(img, textJP, textEN, customElapsed) {
  let imgRatio = 0.62;
  let imgH = height * imgRatio;
  let textH = height * (1 - imgRatio);

  image(img, 0, 0, width, imgH);

  fill(0);
  noStroke();
  rect(0, imgH, width, textH);

  stroke(255);
  strokeWeight(2);
  line(0, imgH, width, imgH);

  let showEnglish = customElapsed >= LANG_CHANGE_TIME;

  let baseScale = min(width / 700, height / 600);
  baseScale = constrain(baseScale, 0.4, 1.2); 
  let pad = constrain(width * 0.02, 10, 20);

  noStroke();
  textAlign(LEFT, TOP);

  if (!showEnglish) {
    fill(255);
    let jpSize = constrain(14 * baseScale, 10, 16);
    textSize(jpSize);
    text(textJP, pad, imgH + pad, width - (pad * 2), textH - (pad * 2));
    
    fill(120);
    let tagSize = constrain(11 * baseScale, 9, 13);
    textSize(tagSize);
    textAlign(RIGHT, BOTTOM);
    text("[ JP ]", width - pad, height - 6);
  } else {
    fill(220);
    let enSize = constrain(13 * baseScale, 9, 15);
    textSize(enSize);
    text(textEN, pad, imgH + pad, width - (pad * 2), textH - (pad * 2));

    fill(120);
    let tagSize = constrain(11 * baseScale, 9, 13);
    textSize(tagSize);
    textAlign(RIGHT, BOTTOM);
    text("[ EN ]", width - pad, height - 6);
  }
}

function drawFinScreen() {
  fill(0);
  rect(0, 0, width, height);

  textSize(15);
  textAlign(CENTER, CENTER);
  
  let centerX = width / 2;
  let yPos = height / 2 - 45;

  push();
  let words = ["— ", "Thank ", "you ", "for ", "watching", " —"];
  let colors = [
    color(160, 160, 160), 
    color(255, 170, 190), 
    color(255, 230, 120), 
    color(180, 180, 180), 
    color(255, 170, 190), 
    color(160, 160, 160)  
  ];

  let totalW = 0;
  for (let i = 0; i < words.length; i++) {
    totalW += textWidth(words[i]);
  }
  
  let startX = centerX - totalW / 2;
  let currentX = startX;

  for (let i = 0; i < words.length; i++) {
    fill(colors[i]);
    textAlign(LEFT, CENTER);
    text(words[i], currentX, yPos);
    currentX += textWidth(words[i]);
  }
  pop();

  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("To Be Continued...", width / 2, height / 2 + 10);
}

function setGameState(newState) {
  gameState = newState;
  stateStartTime = millis();

  if (gameState === "SUBTITLE") {
    if (titleBgm && titleBgm.isPlaying()) {
      titleBgm.stop();
    }
  }

  // ★ arthurBgm の再生
  if (gameState === "SCENE1") {
    if (arthurBgm && !arthurBgm.isPlaying() && isAudioStarted) {
      arthurBgm.loop();
    }
  }
  
  // ★ arthurBgm の停止
  if (gameState === "TRANSITION4") {
    if (arthurBgm && arthurBgm.isPlaying()) {
      arthurBgm.stop();
    }
    hasEndrollsStarted = false;
  }

  if (gameState === "TRANSITION_FIN") {
    if (endrollsBgm && endrollsBgm.isPlaying()) {
      endrollsBgm.fadeOut(1.5); 
      setTimeout(() => {
        if (endrollsBgm.isPlaying()) {
          endrollsBgm.stop();
        }
      }, 1500);
    }

    if (tobeContinuedBgm && !tobeContinuedBgm.isPlaying() && isAudioStarted) {
      tobeContinuedBgm.setLoop(true); 
      tobeContinuedBgm.play();
    }
  }

  if (gameState === "FIN") {
    if (endrollsBgm && endrollsBgm.isPlaying()) {
      endrollsBgm.stop();
    }
  }
}

function updateState() {
  let elapsed = millis() - stateStartTime;

  if (gameState === "TITLE") {
    if (!isAudioStarted) {
      stateStartTime = millis(); 
      return;
    }
    if (elapsed > TITLE_DURATION) {
      setGameState("SUBTITLE");
    }
  } else if (gameState === "SUBTITLE" && elapsed > SUBTITLE_DURATION) {
    setGameState("TRANSITION1");
  } else if (gameState === "TRANSITION1" && elapsed > TRANS_DURATION) {
    setGameState("SCENE1");
  } else if (gameState === "SCENE1" && elapsed > SCENE_DURATION) {
    setGameState("TRANSITION2");
  } else if (gameState === "TRANSITION2" && elapsed > TRANS_DURATION) {
    setGameState("SCENE2");
  } else if (gameState === "SCENE2" && elapsed > SCENE_DURATION) {
    setGameState("TRANSITION3");
  } else if (gameState === "TRANSITION3" && elapsed > TRANS_DURATION) {
    setGameState("SCENE3");
  } else if (gameState === "SCENE3" && elapsed > SCENE_DURATION) {
    setGameState("TRANSITION4");
  } else if (gameState === "TRANSITION4" && elapsed > TRANS_DURATION) {
    setGameState("SCENE4");
  } else if (gameState === "SCENE4" && elapsed > SCENE_DURATION) {
    setGameState("TRANSITION_FIN");
  } else if (gameState === "TRANSITION_FIN" && elapsed > TRANS_DURATION) {
    setGameState("FIN"); 
  }
}

function drawGlassOverlay() {
  if (random(100) < 8) {
    fill(0, random(10, 25));
    rect(0, 0, width, height);
  }
  stroke(0, 60);
  strokeWeight(1);
  for (let y = 0; y < height; y += 3) {
    line(0, y, width, y);
  }
  stroke(255, random(10, 25));
  for (let i = 0; i < 500; i++) {
    point(random(width), random(height));
  }
  if (random(100) < 12) {
    let lineY = random(height);
    stroke(255, random(30, 80));
    line(0, lineY, width, lineY);
  }
}

function drawTitleButton() {
  let btnW = 140;
  let btnH = 40;
  let btnX = width / 2 - btnW / 2;
  let btnY = height / 2 + 80; 

  push();
  stroke(255, 180);
  strokeWeight(2);
  fill(0, 200);
  rect(btnX, btnY, btnW, btnH, 6);

  noStroke();
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("TITLEへ戻る", btnX + btnW / 2, btnY + btnH / 2);
  pop();
}

function mousePressed() {
  userStartAudio();

  if (gameState === "FIN") {
    let btnW = 140;
    let btnH = 40;
    let btnX = width / 2 - btnW / 2;
    let btnY = height / 2 + 80;

    if (mouseX >= btnX && mouseX <= btnX + btnW && mouseY >= btnY && mouseY <= btnY + btnH) {
      if (tobeContinuedBgm && tobeContinuedBgm.isPlaying()) {
        tobeContinuedBgm.stop();
      }

      isAudioStarted = false;
      hasEndrollsStarted = false;
      setGameState("TITLE");
      return;
    }
  }

  if (!isAudioStarted && gameState === "TITLE") {
    isAudioStarted = true;
    stateStartTime = millis(); 
    if (titleBgm && titleBgm.isLoaded()) {
      titleBgm.play();
    }
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }
}

function startRecording() {
  recordedChunks = [];
  let stream = document.querySelector('canvas').captureStream(30);
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

  mediaRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = function () {
    let blob = new Blob(recordedChunks, { type: 'video/webm' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'detective_arthur_ep1.webm';
    a.click();
  };

  mediaRecorder.start();
  isRecording = true;
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
  }
}

function drawRecordingIndicator() {
  if (isRecording) {
    push();
    noStroke();
    fill(255, 0, 0);
    ellipse(20, 20, 12, 12);
    fill(255);
    textSize(12);
    textAlign(LEFT, CENTER);
    text("REC", 32, 20);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
