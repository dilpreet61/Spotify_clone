let currentSong = new Audio();
let songs = [];
let currentIndex = 0;

// Format time mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;
    return `${mins}:${secs}`;
}

// Fetch songs from songs.json
async function getSongs() {
    let response = await fetch("songs/playlist/songs.json");
    let data = await response.json();
    songs = data.songs.map(song => `songs/playlist/${song}`);

    let songsul = document.querySelector(".songslist ul");
    songsul.innerHTML = "";

    for (let [index, song] of songs.entries()) {
        let songName = song.split("/").pop().replaceAll("_", " ").replace(".mp3", "");
        songsul.innerHTML += `
            <li data-index="${index}">
                <div class="info"><div>${songName}</div></div>
                <div class="play1"><img src="./svgs/play1.svg" alt="play"></div>
            </li>
        `;
    }

    // Add click event for each li
    document.querySelectorAll(".songslist ul li").forEach(li => {
        li.addEventListener("click", () => {
            let index = parseInt(li.getAttribute("data-index"));
            playSong(index);
        });
    });
}

// Play selected song
function playSong(index) {
    currentIndex = index;
    currentSong.src = songs[index];
    currentSong.play();

    updatePlayIcons();

    document.querySelector(".songinfo").innerText = songs[index].split("/").pop().replaceAll("_", " ").replace(".mp3", "");
    document.querySelector("#play").src = "./svgs/pause.svg";
}

// Update play icons in list
function updatePlayIcons() {
    document.querySelectorAll(".songslist ul li").forEach((li, i) => {
        let img = li.querySelector(".play1 img");
        if (i === currentIndex && !currentSong.paused) {
            img.src = "./svgs/pause.svg";
        } else {
            img.src = "./svgs/play1.svg";
        }
    });
}

// Toggle play/pause
function togglePlay() {
    if (currentSong.paused) {
        currentSong.play();
        document.querySelector("#play").src = "./svgs/pause.svg";
    } else {
        currentSong.pause();
        document.querySelector("#play").src = "./svgs/play1.svg";
    }
    updatePlayIcons();
}

// Next song
function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong(currentIndex);
}

// Previous song
function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(currentIndex);
}

// Seek bar update
function setupSeekBar() {
    let seekbar = document.querySelector(".seekbar");
    let circle = document.querySelector(".circle");

    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            let progress = (currentSong.currentTime / currentSong.duration) * 100;
            circle.style.left = progress + "%";
        }

        document.querySelector(".songtime").innerText =
            `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
    });

    seekbar.addEventListener("click", e => {
        let percent = (e.offsetX / seekbar.offsetWidth);
        currentSong.currentTime = percent * currentSong.duration;
    });
}

// Auto play next
currentSong.addEventListener("ended", () => {
    nextSong();
});

// Main
async function main() {
    await getSongs();
    setupSeekBar();

    document.querySelector("#play").addEventListener("click", togglePlay);
    document.querySelector("#next").addEventListener("click", nextSong);
    document.querySelector("#previous").addEventListener("click", prevSong);
}

main();
