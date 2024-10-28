console.log('Writing JS')

const left_sidebar = document.getElementsByClassName('left')[0];
const right_sidebar = document.getElementsByClassName('right')[0];

const explore_area = document.querySelector('.explore');
explore_area.addEventListener('click', function() {
    explore_area.style.border = "1px solid white";
    explore_area.style.filter = "brightness(1.3)";
    document.addEventListener('click', remove_border);  
});
remove_border = function(event){
    if(explore_area.style.border == "1px solid white" && !explore_area.contains(event.target)){
        explore_area.style.border = "none";
        explore_area.style.filter = "none";
        document.removeEventListener('click', remove_border);
    }
}


const playlist_plus = document.getElementsByClassName('create_folder');
let new_element;

// Add event listener for creating the new playlist element
playlist_plus[0].addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent the click from propagating to the document click listener
    new_element = document.createElement('div');
    new_element.className = 'create_new_playlist flex center';
    new_element.innerHTML = `
        <img src="images/new_playlist_logo.svg" alt="new playlist" class="invert icon">
        <p>Create new Playlist</p>
    `;
    left_sidebar.appendChild(new_element);
    document.addEventListener('click', handleClick); // Add the global click listener to close the element
});

// Function to handle click and remove the new element
function handleClick(event) {
    // Check if the click target is not the new_element and also not a descendant of it
    if (new_element && !new_element.contains(event.target)) {
        new_element.remove(); // Remove the new element
        document.removeEventListener('click', handleClick); // Remove the event listener after closing
    }
}


// Add event listener for create playlist button
// const create_playlist = document.getElementsByClassName('create_playlist_button');
// let create_playlist_dialogue_box;
// const playlist_container = document.getElementsByClassName('playlist');
// const playlist_style = window.getComputedStyle(playlist_container[0]);

// create_playlist[0].addEventListener('click', function(e) {
//     e.stopPropagation();

//     const playlistHeight = parseFloat(playlist_style.height);

//     create_playlist_dialogue_box = document.createElement('div');
//     create_playlist_dialogue_box.className = 'dialogue_box';
//     create_playlist_dialogue_box.style.top = 48 + (playlistHeight*0.5) + 'px';
//     create_playlist_dialogue_box.innerHTML = `
//         <p class="m2">Create a playlist</p>
//         <p class="m2">Log in to create and share playlists</p>
//         <div class="buttons_in_dialogue_box flex">
//             <buton class="not_now dialogue_box_button">Not now</buton>
//             <buton class="dialogue_box_button">Log In</buton>
//         </div>
//     ` 
//     right_sidebar.appendChild(create_playlist_dialogue_box);
//     document.getElementsByClassName('not_now')[0].addEventListener('click', remove_dialogue_box);
// })

// remove_dialogue_box = function(){
//     if(create_playlist_dialogue_box) create_playlist_dialogue_box.remove();
//     document.removeEventListener('click', this)
// }


// if(doc)
let screenWidth = window.innerWidth;
let hamburger = document.getElementsByClassName('spotify_logo')[0];
let body = document.querySelector("body");
const sidebar_style = window.getComputedStyle(left_sidebar);
const playbar = document.querySelector(".palybar");
// console.log(screenWidth);

if(screenWidth <= 800){
    hamburger.setAttribute("src", "images/hamburger.svg");
    hamburger.addEventListener('click', function(){
        left_sidebar.style.left = "0%";
        left_sidebar.style.transition = "all 0.3s";
        // playbar.style.zindex = "1000";
        const sidebar_header = document.createElement('div');
        sidebar_header.className = "side_header flex";
        sidebar_header.innerHTML = `
            <img class="invert" src="images/spotify_logo.svg" alt="spotify logo">
            <img id="close" class="invert" src="images/cross.svg" alt="cross">
        `
        left_sidebar.prepend(sidebar_header);
        const close_sidebar = document.getElementById("close")
        close_sidebar.addEventListener('click', ()=>{
            sidebar_header.remove();
            left_sidebar.style.left = "-100%";
        });
    })

    function removeSidebar(){
        if(sidebar_style.left == "0%"){
            left_sidebar.style.left = "-100%";
            document.removeEventListener('click', removeSidebar);
        }
    }
}






const randomColor = function(){
    const hex = "0123456789ABCDEF";
    let color = "#";
    for(let i=0; i<6; i++){
        color += hex[Math.floor(Math.random()*16)];
    }
    return color;
}
const artist_random_color = [];
for(let i=0; i<5; i++){
    artist_random_color.push(randomColor());
}
// console.log(artist_random_color);


const artists = document.getElementById('artists');

const addAlpha = (color, alpha) => {
    return `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;  
};

// Debounce function to limit rapid firing of mouseover events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Function to handle the gradient update
const updateGradient = (artistIndex) => {
    if (artistIndex === -1) return;
    
    const baseColor = artist_random_color[artistIndex];
    right_sidebar.style.background = `
        linear-gradient(
            to bottom,
            ${addAlpha(baseColor, 0.25)} 10%,
            ${addAlpha('#0C332F', 0.36)} 70%
        )
    `;
};

// Add the mouseover event listener with performance optimizations
artists.addEventListener('mouseover', debounce((event) => {
    // Early return if not hovering over the artists container
    if (!artists.contains(event.target)) return;
    
    const clickedArtist = event.target.closest('#artists > *');
    if (!clickedArtist) return;
    
    const artistIndex = Array.from(artists.children).indexOf(clickedArtist);
    
    // Apply the gradient change with a smooth transition
    right_sidebar.style.transition = 'background 5s ease 2s';
    updateGradient(artistIndex);
}, 50)); // 50ms debounce delay

// Optional: Reset gradient when mouse leaves the artists container
artists.addEventListener('mouseleave', () => {
    right_sidebar.style.background = `linear-gradient(
        to bottom,
        ${addAlpha('#0C332F', 0.36)} 70%
    )`;
});





// playbar positioning
// const playbar = document.querySelector('.playbar');
// const right_style = window.getComputedStyle(right_sidebar);

// playbar.style.width = right_style.width;
// playbar.style.bottom = '5px';
// playbar.style.right = '5px';


// ******* SONGS

// fetch html of song folder, get songs in array 
async function getSongs() {
    let song = await fetch('http://192.168.0.102:3000/Spotify%20clone/songs/')
    let response = await song.text();
    // console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a')
    let song_array = [];
    for (let i = 0; i < as.length; i++) {
        const el = as[i];
        if(el.href.endsWith(".mp3")) song_array.push(el.href);
    }
    return song_array;
}
 
let cur_song = new Audio();                  // current song
let song_array;

// play song
const playMusic = (track)=>{
    // console.log(track);
    // let audio = new Audio("/Spotify clone/songs/" + track + ".mp3");
    cur_song.src = "/Spotify clone/songs/" + track + ".mp3";
    cur_song.play();
    play.src = "images/pause_button.svg";

    // update current song in the playbar
    let playbar_song_name = document.querySelector(".playing_song");
    playbar_song_name.innerHTML = track;
}

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

function convertUrl(url){
    const newUrl = url.split('/').pop().split('.').shift().replaceAll('%20', ' ');
    return newUrl;
}


// get list of all the songs
async function main() {

    song_array = await getSongs();
    // console.log(song_array);



    // create list of songs in the library_items div
    songUl = document.querySelector(".library_items").getElementsByTagName("ul")[0];
    for(s of song_array){
        // const song_name = s.split('/').pop().split('.').shift().replaceAll('%20', ' ');
        songUl.innerHTML += `
            <li class="">
                <div class="song_item">
                    <p>${convertUrl(s)}</p>
                    <p>artist</p>
                </div>
                <img class="library_play_button" src="images/play_button.svg" alt="Play the song">
            </li>
        `
    }

    // add click event listener to play the song
    Array.from(document.querySelector(".library_items").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", ()=>{
            playMusic(e.querySelector(".song_item").firstElementChild.innerHTML.trim());
        });
    })


    // if(play.src == "images/pause_button.svg") play.style.height = "20px";

    // add event listener to play/pause buttons
    play.addEventListener("click", ()=>{
        if(cur_song.paused){
            cur_song.play();
            play.src = "images/pause_button.svg";
        }else{
            cur_song.pause();
            play.src = "images/play_button.svg";
        }
    })


    // adding event listener to volume bar
    let cur_vol;
    let vol_bar = document.querySelector(".volume_bar")
    function volumeChanger(e){
        let vol_percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".vol_dragger").style.left = vol_percent + "%";
        cur_song.volume = vol_percent/100;
        cur_vol = cur_song.volume;
        vol_bar.style.background = `
                                linear-gradient(
                                to right,
                                rgb(64, 163, 64) 0 ${cur_vol*100}%,
                                white ${cur_vol*100}% 100%
                                )
        `
    }
    vol_bar.addEventListener('click', volumeChanger);

    // add event listener to mute button
    let mute = false;
    mute_button.addEventListener('click', ()=>{
        if(!mute){
            cur_song.volume = 0;
            mute_button.src = "images/mute.svg";
            document.querySelector(".vol_dragger").style.left = "0%";
            vol_bar.style.background = "gray";
            vol_bar.removeEventListener('click', volumeChanger);
            vol_bar.style.cursor = "default";
            mute = true;
        }else{
            cur_song.volume = cur_vol;
            mute_button.src = "images/volume.svg";
            document.querySelector(".vol_dragger").style.left = cur_vol*100 + "%";
            vol_bar.style.background = `
                                linear-gradient(
                                to right,
                                rgb(64, 163, 64) 0 ${cur_vol*100}%,
                                white ${cur_vol*100}% 100%
                                )
            `
            vol_bar.addEventListener('click', volumeChanger);
            vol_bar.style.cursor = "pointer";
            mute = false;
        }
    })

    

    // listen for timeupdate function
    cur_song.addEventListener("timeupdate", ()=>{
        let cur_time = Math.floor(cur_song.currentTime);
        let duration = Math.floor(cur_song.duration);
        // console.log(`${cur_time} , ${duration}`);

        cur_song_time.innerHTML = `${formatTime(cur_time)}`
        cur_song_length.innerHTML = `${formatTime(duration)}`

        document.querySelector('.seek_dragger').style.left = (cur_time/duration)*100 + "%";

        document.querySelector(".seek_bar").style.background = `
                                                            linear-gradient(
                                                            to right,
                                                            rgb(64, 163, 64) 0 ${(cur_time/duration)*100}%,
                                                            white ${(cur_time/duration)*100}% 100%
                                                            )
        `
    })

    // add an event listener to seekbar
    document.querySelector(".seek_bar").addEventListener('click', e=>{
        let seekingTime = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".seek_dragger").style.left = seekingTime + "%";
        cur_song.currentTime = (cur_song.duration * seekingTime)/100;
    })

    // add an event lisener to prv/next    
    previous.addEventListener('click', ()=>{
        let ind = song_array.indexOf(cur_song.src);
        if(ind - 1 >= 0) playMusic(convertUrl(song_array[ind-1])) ;
        else next.removeEventListener('click', this);
    })
    
    
    next.addEventListener('click', ()=>{
        let ind = song_array.indexOf(cur_song.src);
        if(ind + 1 < song_array.length) playMusic(convertUrl(song_array[ind+1])) ;
        else next.removeEventListener('click', this);
    })



}
main()  








