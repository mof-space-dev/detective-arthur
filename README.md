# 🔍 The Case Files of Detective Arthur
### Episode 1: "Under the Tower..."

A retro 80s PC-style visual novel / adventure story powered by **p5.js**. Follow Detective Arthur in his grand delusions and comical reality as he investigates the glowing lights of the modern metropolis.

![PC-88 Style](https://img.shields.io/badge/Style-PC--88%20%2F%2016--bit-brightgreen)
![p5.js](https://img.shields.io/badge/Powered%20by-p5.js-ed225d)
![Bilingual](https://img.shields.io/badge/Language-Japanese%20%2F%20English-blue)

---

## 📖 Story Overview

> *"I am Arthur. People call me 'Detective Arthur'—or rather, that's just my grand delusion..."*

Arthur, the head of a struggling detective agency, wanders through the neon-lit London night seeking a chilling, mysterious case. Standing beneath the glowing glass spire of The Shard, multi-colored lights envelop him. Is this the dramatic climax of a grand mystery, or just a hilarious misunderstanding with local security?

---

## ✨ Features

- **80s PC-88 Aesthetic:** Authentic retro game aesthetics featuring pixel art graphics, scanline overlay, and color dithering.
- **Cinematic Transitions:** Dynamic horizontal sliding page-turn animation using custom easing functions.
- **Automatic Bilingual Display:** Text automatically switches between **Japanese** and **English** every 7 seconds, making it accessible to a global audience.
- **Built-in Screen Recording:** Effortlessly record your playback session directly from the browser into a `.webm` video file by pressing the `[R]` key.

---

## 🎮 How to Play / Controls

| Action | Control | Description |
| :--- | :--- | :--- |
| **Start / Progress** | Automatic | The visual novel auto-plays through all 4 scenes smoothly. |
| **Record Video** | `[R]` Key | Press `R` to start recording. Press `R` again to stop and auto-download the `.webm` video. |

---

## 🛠️ Technical Details & Stack

- **Framework:** [p5.js](https://p5js.org/)
- **Graphics:** Pixel art artwork styled with 16-color retro dithering
- **Effects:** Procedural CRT filter, scanlines, and subtle canvas flicker
- **Video Capture:** Native Browser `MediaRecorder API`

---

## 📂 Project Structure

```text
├── index.html          # Web page wrapper
├── sketch.js           # Main p5.js logic, transitions, and recorder
├── title.png           # Title screen asset
├── scene1.png          # Scene 1: Office Delusions
├── scene2.png          # Scene 2: Beneath the Spire
├── scene3.png          # Scene 3: Under the Spotlight
└── scene4.png          # Scene 4: Slapstick Climax

👥 Credits & Collaboration
Concept, Story & Programming: User

AI Collaborator & Technical Co-developer: Gemini

Visual Art Direction: Retro PC-88 pixel aesthetic with AI assistance
