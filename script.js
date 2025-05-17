const songs = [
  {
    title: "Classroom of the EliteAMVHeathens (Lyrics)",
    src: "music1.mp3",
    cover: "cover1.jpg",
  },
  {
    title: "Камин (Lyrics) - Emin And Jony",
    src: "music2.mp3",
    cover: "cover2.jpg",
  },
  {
    title: "Shiloh Dynasty - Novocaine (Lyrics)",
    src: "music3.mp3",
    cover: "cover3.jpg",
  },
  {
    title: "Powfu - death bed (coffee for your head) (Lyrics) ft. beabadoobee",
    src: "music4.mp3",
    cover: "cover4.jpg",
  },
  {
    title: "sapientdream - Past Lives (Lyrics)",
    src: "music5.mp3",
    cover: "cover5.jpg",
  },
];

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const stopBtn = document.getElementById("stop-btn");
const downloadBtn = document.getElementById("download-btn");
const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speed-value");
const progressSlider = document.getElementById("progress");
const timeDisplay = document.getElementById("time-display");
const songTitle = document.getElementById("song-title");
const coverImg = document.getElementById("cover-img");
const playlistList = document.getElementById("playlist-list");

let currentIndex = 0;
let isPlaying = false;

// Initialize playlist UI
function loadPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.dataset.index = index;

    const img = document.createElement("img");
    img.src = song.cover;
    img.alt = song.title;

    li.prepend(img);
    playlistList.appendChild(li);

    li.addEventListener("click", () => {
      if (currentIndex !== index) {
        loadSong(index);
        playAudio();
      }
    });
  });
}

// Load song info and source
function loadSong(index) {
  currentIndex = index;
  const song = songs[index];
  audio.src = song.src;
  songTitle.textContent = song.title;
  coverImg.src = song.cover;
  downloadBtn.href = song.src;

  updateActiveSong();
  resetProgress();
}

// Update highlight in playlist
function updateActiveSong() {
  const lis = playlistList.querySelectorAll("li");
  lis.forEach(li => li.classList.remove("active"));
  lis[currentIndex].classList.add("active");
}

// Play controls
function playAudio() {
  audio.play();
  isPlaying = true;
  playBtn.style.display = "none";
  pauseBtn.style.display = "inline-block";
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
  playBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";
}

function stopAudio() {
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
  playBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";
  resetProgress();
}

function resetProgress() {
  progressSlider.value = 0;
  updateTimeDisplay();
}

function updateTimeDisplay() {
  const current = formatTime(audio.currentTime);
  const duration = formatTime(audio.duration);
  timeDisplay.textContent = `${current} / ${duration}`;
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Event Listeners
playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);
stopBtn.addEventListener("click", stopAudio);

speedSlider.addEventListener("input", () => {
  audio.playbackRate = speedSlider.value;
  speedValue.textContent = speedSlider.value;
});

audio.addEventListener("timeupdate", () => {
  if (!progressSlider.dragging) {
    const percent = (audio.currentTime / audio.duration) * 100 || 0;
    progressSlider.value = percent;
    updateTimeDisplay();
  }
});

progressSlider.addEventListener("input", () => {
  progressSlider.dragging = true;
});

progressSlider.addEventListener("change", () => {
  const time = (progressSlider.value / 100) * audio.duration;
  audio.currentTime = time;
  progressSlider.dragging = false;
});

audio.addEventListener("ended", () => {
  // Auto-play next song or loop
  let nextIndex = currentIndex + 1;
  if (nextIndex >= songs.length) nextIndex = 0;
  loadSong(nextIndex);
  playAudio();
});

// Initialize
loadPlaylist();
loadSong();