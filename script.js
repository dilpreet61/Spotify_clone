console.log("Let's start javascript");

//initialize the variables
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder = folder;
    let songs = [];

    // ✅ fetch songs.json instead of directory listing
    let response = await fetch(`/songs/${folder}/songs.json`);
    let data = await response.json();
    songs = data.songs.map(song => `/songs/${folder}/${song}`);

    songsul = document.querySelector(".songslist ul");
    playmusic(songs[0].split("songs/")[1].replaceAll("_", " ").split(".")[0], true);
    console.log("songs: " + songs)
    songsul.innerHTML = "";

    for (const element of songs) {
        let songname = element.split("songs/")[1].replaceAll("_", " ").split(".")[0];
        let newli = `<li class="m2 songlis">
                        <img class="invert music" src="./svgs/music.svg" alt="">
                        <div class="info">
                            <div>${songname.split("/")[1]}</div>
                            <div> : by Dilpreet</div>
                        </div>
                        <div class="playnow">
                            <div class="play1">
                                <img src="./svgs/play.svg" alt="">
                            </div>
                        </div>
                    </li>`;
        songsul.innerHTML += newli;
    }

    // Add event listeners for each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", Element => {
            e.querySelector(".play1 img").src = "./svgs/pause.svg"
            playmusic(`${folder}/` + e.querySelector(".info").firstElementChild.innerText)
        })
    })

    return songs;
}

const playmusic = (track, pause = false) => {
    // let audio=new Audio("/songs/"+track)
    currentSong.src = `/songs/${track}.mp3`
    if (!pause) {
        currentSong.play();
        play.src = "./svgs/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums() {
    console.log("display album start")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    console.log("anchors:", anchors)

    let cardcontainer = document.querySelector(".cardcontainer");
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0];

            //get meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)

            cardcontainer.innerHTML += `<div data-folder="${folder}" class="card  m2 p2">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" version="1.1" id="Capa_1"
                    viewBox="0 0 60 60" xml:space="preserve">
                    <path
                        d="M45.477,27.395l-24-15C20.727,12.191,20.366,12.1,20,12.1c-0.166,0-0.333,0.027-0.493,0.082   C19.197,12.271,19,12.619,19,13v30c0,0.381,0.197,0.729,0.507,0.918C19.664,43.973,19.832,44,20,44c0.366,0,0.727-0.191,0.977-0.496   l24-15C45.993,28.317,46.001,27.683,45.477,27.395z" />
                    <path
                        d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30   S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z" />
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`${item.currentTarget.dataset.folder}`)
        })
    })
}

async function main() {
    //get the list of all songs
    songs = await getsongs("waheguru")

    //play first song
    // var audio=new Audio(songs[0]);
    // audio.play()

    //Attach event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./svgs/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "./svgs/play1.svg";
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //Add event listener to previous and next
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-2).join("/"));
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1].split("/").slice(-2).join("/"))
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-2).join("/"));
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1].split("/").slice(-2).join("/"))
        }
    })

    //Add an event to volume seekbar
    document.querySelector(".range input").addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    //load the playlist whenever card is clicked
    await displayAlbums();

    //Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = .10;
            document.querySelector(".range input").value = 10;
        }
    })
}

main()
