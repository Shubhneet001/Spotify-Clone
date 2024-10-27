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
// let body = document.querySelector(body);
// console.log(screenWidth);

if(screenWidth <= 800){
    hamburger.setAttribute("src", "images/hamburger.svg");
    hamburger.addEventListener('click', function(){
        // body.style.filter = 'opacity(0.5)'
        left_sidebar.style.display = 'flex';
    })
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

// right_sidebar.style.transition = "background ease-in-out 5s";
artists.addEventListener('mouseover', function(event) {
    if (artists.contains(event.target)) {
        const clickedArtist = event.target.closest('#artists > *');
        if (clickedArtist) {
            const artists_array = Array.from(artists.children);
            const artist_index = artists_array.indexOf(clickedArtist);            
            right_sidebar.style.background = `linear-gradient(to bottom, ${artist_random_color[artist_index]}40 10%, #0C332F5C 70%)`;
        }
    }
});

// playbar positioning
const playbar = document.querySelector('.playbar');
const right_style = window.getComputedStyle(right_sidebar);

playbar.style.width = right_style.width;
playbar.style.bottom = '5px';
playbar.style.right = '5px';


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
// play song
const playMusic = (track)=>{
    console.log(track);
    // let audio = new Audio("/Spotify clone/songs/" + track + ".mp3");
    cur_song.src = "/Spotify clone/songs/" + track + ".mp3";
    cur_song.play();
    play.src = "images/pause_button.svg";

    // update current song in the playbar
    let playbar_song_name = document.querySelector(".playing_song");
    playbar_song_name.innerHTML = track;
}


// get list of all the songs
async function main() {

    let song_array = await getSongs();
    console.log(song_array);

    // create list of songs in the library_items div
    let songUl = document.querySelector(".library_items").getElementsByTagName("ul")[0];
    for(s of song_array){
        const song_name = s.split('/').pop().split('.').shift().replaceAll('%20', ' ');
        songUl.innerHTML += `
            <li class="">
                <div class="song_item">
                    <p>${song_name}</p>
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

    // if(cur_song.played){
    //     play.src = "images/pause_button.svg";
    //     play.style.height = "20px"
    // }else{
    //     play.src = "images/pause_button.svg";
    // }

    if(play.src == "images/pause_button.svg") play.style.height = "20px";

    // add event listener to paly, prev, next buttons
    play.addEventListener("click", ()=>{
        if(cur_song.paused){
            cur_song.play();
            play.src = "images/pause_button.svg";
        }else{
            cur_song.pause();
            play.src = "images/play_button.svg";
        }
    })



}
main()  








