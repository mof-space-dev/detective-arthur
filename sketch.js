let titleImg;
let scene1Img;
let scene2Img;
let scene3Img;
let scene4Img;

// シーン管理
// "TITLE" -> "SUBTITLE" -> "TRANSITION1" -> "SCENE1" -> ... -> "SCENE4" -> "TRANSITION_FIN" -> "FIN"
let gameState = "TITLE";
let stateStartTime = 0;

// 各アニメーション・表示時間（ミリ秒）
const TITLE_DURATION = 4000;    // タイトル画面 (4秒)
const SUBTITLE_DURATION = 3500; // サブタイトル画面 (3.5秒)
const TRANS_DURATION = 800;     // 横スライド遷移時間 (0.8秒)
const SCENE_DURATION = 14000;   // 各シーン合計時間 (JP 7秒 + EN 7秒 = 14秒)

// 言語切り替えタイミング（7秒）
const LANG_CHANGE_TIME = 7000; 

// --- 録画用変数 ---
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

// --- モノローグ＆台詞テキスト定義 ---

// シーン1（事務所の妄想）
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

// シーン2（シャード前）
const scene2TextJP = 
  "……考えに耽りながら夜の街を彷徨ううち、いつの間にかこの巨大なガラスの針の真下に辿り着いていたようだ。\n\n" +
  "ふっ……これが現代のバベルの塔か。\n" +
  "しかし……人はここへ登って、一体何になろうというのだ？\n" +
  "眼下に広がる景色を眺めて、何が得られるというのだ？\n\n" +
  "欲望と金が渦巻くこの街で、真実を知る者は……私一人というわけだ。";

const scene2TextEN = 
  "...Lost in thought as I wandered the night streets, I found myself standing directly beneath this giant needle of glass.\n\n" +
  "Hmph... A modern Tower of Babel, is it?\n" +
  "But why do people climb it? What do they hope to see looking down upon this city?\n\n" +
  "In this place, dripping with greed and money... I alone hold the truth.";

// シーン3（勘違いスポットライト）
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

// シーン4（ドタバタ連行・オチ）
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

  drawGlassOverlay(); // レトロPC/CRT風フィルター処理
  updateState();       // シーン進行制御
  drawRecordingIndicator(); // 録画中インジケーター表示
}

function drawGameContent() {
  let elapsed = millis() - stateStartTime;

  if (gameState === "TITLE") {
    image(titleImg, 0, 0, width, height);

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
    drawSplitScene(scene1Img, scene1TextJP, scene1TextEN);
    pop();

  } else if (gameState === "SCENE1") {
    drawSplitScene(scene1Img, scene1TextJP, scene1TextEN);

  } else if (gameState === "TRANSITION2") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);

    push();
    translate(-width * ease, 0);
    drawSplitScene(scene1Img, scene1TextJP, scene1TextEN);
    pop();

    push();
    translate(width * (1 - ease), 0);
    drawSplitScene(scene2Img, scene2TextJP, scene2TextEN);
    pop();

  } else if (gameState === "SCENE2") {
    drawSplitScene(scene2Img, scene2TextJP, scene2TextEN);

  } else if (gameState === "TRANSITION3") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);

    push();
    translate(-width * ease, 0);
    drawSplitScene(scene2Img, scene2TextJP, scene2TextEN);
    pop();

    push();
    translate(width * (1 - ease), 0);
    drawSplitScene(scene3Img, scene3TextJP, scene3TextEN);
    pop();

  } else if (gameState === "SCENE3") {
    drawSplitScene(scene3Img, scene3TextJP, scene3TextEN);

  } else if (gameState === "TRANSITION4") {
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);

    push();
    translate(-width * ease, 0);
    drawSplitScene(scene3Img, scene3TextJP, scene3TextEN);
    pop();

    push();
    translate(width * (1 - ease), 0);
    drawSplitScene(scene4Img, scene4TextJP, scene4TextEN);
    pop();

  } else if (gameState === "SCENE4") {
    drawSplitScene(scene4Img, scene4TextJP, scene4TextEN);

  } else if (gameState === "TRANSITION_FIN") {
    // Scene 4 -> エンド画面へのスライド遷移
    let progress = constrain(elapsed / TRANS_DURATION, 0, 1);
    let ease = progress * progress * (3 - 2 * progress);

    push();
    translate(-width * ease, 0);
    drawSplitScene(scene4Img, scene4TextJP, scene4TextEN);
    pop();

    push();
    translate(width * (1 - ease), 0);
    drawFinScreen();
    pop();

  } else if (gameState === "FIN") {
    drawFinScreen();
  }
}

// サブタイトル画面の描画関数
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

// 画面上下分割描画用関数（上：画像 / 下：モノローグテキスト）
function drawSplitScene(img, textJP, textEN) {
  let imgRatio = 0.62;
  let imgH = height * imgRatio;
  let textH = height * (1 - imgRatio);

  // 上部：画像表示
  image(img, 0, 0, width, imgH);

  // 下部：黒のテキスト枠エリア
  fill(0);
  noStroke();
  rect(0, imgH, width, textH);

  // 境界線（PC-88風の白ライン）
  stroke(255);
  strokeWeight(2);
  line(0, imgH, width, imgH);

  // 時間判定による日本語 / 英語の自動切替 (7秒)
  let sceneElapsed = millis() - stateStartTime;
  let showEnglish = sceneElapsed >= LANG_CHANGE_TIME;

  let pad = 24;
  noStroke();
  textAlign(LEFT, TOP);

  if (!showEnglish) {
    // 日本語表示 (0〜7秒)
    fill(255);
    textSize(18);
    text(textJP, pad, imgH + pad, width - (pad * 2), textH - (pad * 2));
    
    fill(120);
    textSize(12);
    textAlign(RIGHT, BOTTOM);
    text("[ JP ]", width - pad, height - 12);
  } else {
    // 英語表示 (7秒〜14秒)
    fill(220);
    textSize(16);
    text(textEN, pad, imgH + pad, width - (pad * 2), textH - (pad * 2));

    fill(120);
    textSize(12);
    textAlign(RIGHT, BOTTOM);
    text("[ EN ]", width - pad, height - 12);
  }
}

// エンド画面 (To Be Continued...) 描画
function drawFinScreen() {
  fill(0);
  rect(0, 0, width, height);
  
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("To Be Continued...", width / 2, height / 2);
}

// 状態（シーン）の自動進行制御
function updateState() {
  let elapsed = millis() - stateStartTime;

  if (gameState === "TITLE" && elapsed > TITLE_DURATION) {
    gameState = "SUBTITLE";
    stateStartTime = millis();
  } else if (gameState === "SUBTITLE" && elapsed > SUBTITLE_DURATION) {
    gameState = "TRANSITION1";
    stateStartTime = millis();
  } else if (gameState === "TRANSITION1" && elapsed > TRANS_DURATION) {
    gameState = "SCENE1";
    stateStartTime = millis();
  } else if (gameState === "SCENE1" && elapsed > SCENE_DURATION) {
    gameState = "TRANSITION2";
    stateStartTime = millis();
  } else if (gameState === "TRANSITION2" && elapsed > TRANS_DURATION) {
    gameState = "SCENE2";
    stateStartTime = millis();
  } else if (gameState === "SCENE2" && elapsed > SCENE_DURATION) {
    gameState = "TRANSITION3";
    stateStartTime = millis();
  } else if (gameState === "TRANSITION3" && elapsed > TRANS_DURATION) {
    gameState = "SCENE3";
    stateStartTime = millis();
  } else if (gameState === "SCENE3" && elapsed > SCENE_DURATION) {
    gameState = "TRANSITION4";
    stateStartTime = millis();
  } else if (gameState === "TRANSITION4" && elapsed > TRANS_DURATION) {
    gameState = "SCENE4";
    stateStartTime = millis();
  } else if (gameState === "SCENE4" && elapsed > SCENE_DURATION) {
    // Scene 4 (14秒) 終了後、エンド表示へスライド移動
    gameState = "TRANSITION_FIN";
    stateStartTime = millis();
  } else if (gameState === "TRANSITION_FIN" && elapsed > TRANS_DURATION) {
    gameState = "FIN";
    stateStartTime = millis();
  }
}

// CRT/走査線エフェクト
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

// --- 録画機能ロジック ---
function keyPressed() {
  // 「R」キーで録画トグル
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
  let stream = document.querySelector('canvas').captureStream(30); // 30fps
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
    URL.revokeObjectURL(url);
  };

  mediaRecorder.start();
  isRecording = true;
  console.log("録画を開始しました...");
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    console.log("録画を停止し、ダウンロードします。");
  }
}

// 録画中マーク表示（画面左上）
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