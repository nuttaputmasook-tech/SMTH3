
const scenes = document.querySelectorAll(".scene");
const progress = document.querySelector("#progress");
const yesButton = document.querySelector("#yes");
const thinkButton = document.querySelector("#think");
const response = document.querySelector("#response");

let currentScene = 0;
let rejectCount = 0;
let yesScale = 1;
let audioContext = null;
let musicPlaying = false;
let melodyTimer = null;
let yesSize = 1;
let thinkMoveCount = 0;

function showScene(index) {
  scenes.forEach((scene, i) => {
    scene.classList.toggle("active", i === index);
  });

  currentScene = index;

  if (progress) {
    progress.style.width =
      `${((index + 1) / scenes.length) * 100}%`;
  }
}

document.querySelectorAll(".next").forEach(button => {
  button.addEventListener("click", () => {
    if (currentScene < scenes.length - 1) {
      showScene(currentScene + 1);
    }
  });
});


document.querySelector("#restart")?.addEventListener("click", () => {
  rejectCount = 0;
  yesScale = 1;

thinkMoveCount = 0;
thinkButton.style.left = "";
thinkButton.style.top = "";
thinkButton.style.position = "";
thinkButton.style.zIndex = "";

 
  yesButton.style.removeProperty("transform");
  yesButton.style.removeProperty("width");
  yesButton.style.removeProperty("height");
  yesButton.style.removeProperty("min-height");
  yesButton.style.removeProperty("font-size");
  yesButton.style.removeProperty("padding");
  yesButton.style.removeProperty("z-index");

  
  yesButton.disabled = false;
  thinkButton.disabled = false;
  thinkButton.style.removeProperty("opacity");
  thinkButton.style.removeProperty("transform");

  
  response.textContent = "";
  response.classList.remove("show");

  showScene(0);
});



yesButton?.addEventListener("click", () => {
  response.textContent =
    "เย้! 💖 ขอบคุณนะคะเบบี๋ ชั้นจะทำให้ดีที่สุดเท่าที่ชั้นจะทำได้เลยยย..";
  response.classList.add("show");

  thinkButton.disabled = true;
  yesButton.disabled = true;
});




thinkButton?.addEventListener("click", () => {
  rejectCount++;

  if (rejectCount <= 3) {
    yesScale += 0.5;
    yesButton.style.transform = `scale(${yesScale})`;

    thinkMoveCount++;

    const positions = [
      { x: 230, y: -100 },
      { x: -230, y: 100 },
      { x: 0, y: 180 }
    ];

    const pos = positions[thinkMoveCount - 1];

    thinkButton.style.position = "relative";
    thinkButton.style.left = `${pos.x}px`;
    thinkButton.style.top = `${pos.y}px`;
    thinkButton.style.zIndex = "100";

    response.textContent = [
      "ไม่ลองคิดดูอีกนิดเหรอคะพี่ฝ้าย 🥺💗",
      "ลองคิดอีกทีน้าาาาาาาา ✨",
      "ให้โอกาสเค้าหน่อยได้ม้ายยยยยยยยยยยยยยยย💖"
    ][rejectCount - 1];

    response.classList.add("show");

  } else {
    
    yesScale = 1;
    yesButton.style.transform = "scale(1)";
    yesButton.style.width = "";
    yesButton.style.height = "";
    yesButton.style.minHeight = "";

    
    thinkButton.style.left = "";
    thinkButton.style.top = "";
    thinkButton.style.position = "";
    thinkButton.style.zIndex = "";

    thinkMoveCount = 0;

    response.textContent =
      "ไม่เป็นไรนะพี่ฝ้าย 💗 ขอบคุณที่บอกความรู้สึกกันตรง😭😢 ๆ";
    response.classList.add("show");

    thinkButton.disabled = true;
    yesButton.disabled = true;
  }
});




const canvas = document.querySelector("#stars");
const ctx = canvas?.getContext("2d");
let stars = [];

function resizeCanvas() {
  if (!canvas || !ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  stars = Array.from({ length: 130 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.8 + 0.3,
    alpha: Math.random(),
    speed: Math.random() * 0.015 + 0.003
  }));
}

function drawStars() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(star => {
    star.alpha += star.speed;

    if (star.alpha > 1 || star.alpha < 0.15) {
      star.speed *= -1;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawStars();

document.querySelector("#music")?.addEventListener("click", async () => {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      alert("เบราว์เซอร์นี้ไม่รองรับเพลงประกอบค่ะ");
      return;
    }

    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  musicPlaying = !musicPlaying;

  const musicButton = document.querySelector("#music");

  if (musicPlaying) {
    musicButton.textContent = "🔇 ปิดเพลง";
    playMelody();
  } else {
    musicButton.textContent = "🎵 เปิดเพลง";
    clearTimeout(melodyTimer);
  }
});

function playMelody() {
  if (!musicPlaying || !audioContext) return;

  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46];
  let noteIndex = 0;

  function playNote() {
    if (!musicPlaying || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = notes[noteIndex % notes.length];

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.04
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.35
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.36);

    noteIndex++;
    melodyTimer = setTimeout(playNote, 400);
  }

  playNote();
}

