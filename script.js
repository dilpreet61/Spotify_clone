let currentSong = new Audio();
let songs = [];
let currentFolder = "";
let currentIndex = 0;

// Function to load songs from a folder
async function loadSongs(folder, listId) {
    currentFolder = folder;
    try {
        let response = await fetch(`songs/${folder}/songs.json`);
        let data = await response.json();
        songs = data.songs;

        let ul = document.getElementById(listId);
        ul.innerHTML = ""; // clear old list

        songs.forEach((song, index) => {
            let li = document.createElement("li");
            li.classList.add("song-item");
            li.innerHTML = `
                <span>${song.replace(".mp3", "")}</span>
                <button class="play-btn">▶</button>
            `;

            li.querySelector(".play-btn").addEventListener("click", () => {
                playMusic(index);
            });

            ul.appendChild(li);
        });
    } catch (err) {
        console.error(`Error loading songs from ${folder}:`, err);
    }
}

// Function to play song by index
function playMusic(index) {
    if (index < 0 || index >= songs.length) return;

    currentIndex = index;
    currentSong.src = `songs/${currentFolder}/${songs[index]}`;
    currentSong.play();

    // Update play button icon
    document.querySelectorAll(".play-btn").forEach((btn, i) => {
        btn.textContent = i === index ? "⏸" : "▶";
    });

    // Show song name
    document.getElementById("currentSongName").innerText = songs[index].replace(".mp3", "");
}

// Play/Pause toggle button
document.getElementById("masterPlay").addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        document.getElementById("masterPlay").textContent = "⏸";
    } else {
        currentSong.pause();
        document.getElementById("masterPlay").textContent = "▶";
    }
});

// Next button
document.getElementById("next").addEventListener("click", () => {
    playMusic((currentIndex + 1) % songs.length);
});

// Previous button
document.getElementById("prev").addEventListener("click", () => {
    playMusic((currentIndex - 1 + songs.length) % songs.length);
});

// Seekbar update
currentSong.addEventListener("timeupdate", () => {
    let progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.getElementById("seekbar").value = progress || 0;

    // update timer
    document.getElementById("timer").innerText =
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
});

// Seekbar change (manual seeking)
document.getElementById("seekbar").addEventListener("input", (e) => {
    currentSong.currentTime = (e.target.value / 100) * currentSong.duration;
});

// Format time as mm:ss
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

// Load both playlists when page loads
window.onload = () => {
    loadSongs("waheguru", "waheguruList");
    loadSongs("playlist", "playlistList");
};
