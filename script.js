// This code was borrowed from stackoverflow & vimutv.com.

let hasHash = false;
$(document).ready(function () {
    const hashTagVideoID = getQueryParam("v");
    if (hashTagVideoID) {
        videoID = hashTagVideoID.split("#").pop();
        hasHash = true
    }
});

function getQueryParam(param) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] == param) {
            return pair[1];
        }
    }
    return null;
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(function() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    return tag
}(), firstScriptTag);

let video;
function onYouTubeIframeAPIReady() {
    console.log('ready');
    const playerVars = {
        'list': playlistID,
        //'autoplay': 1,
        'mute': 1, // required for autoplay
        'controls': 1,
        'autohide': 0,
        'index': rand(0, 100),
        'showinfo': 1
    };
    const events = {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
    };
    if (videoID != '') {
        video = new YT.Player('video', {
            height: '100%',
            width: '100%',
            videoId: videoID,
            playerVars: playerVars,
            events: events
        });
    } else {
        video = new YT.Player('video', {
            height: '100%',
            width: '100%',
            playerVars: playerVars,
            events: events
        });
    }
}

function onPlayerReady(event) {
    const totalVideos = event.target.getPlaylist().length;
    const startIndex = rand(0,totalVideos);
    console.log(`onPlayerReady ${startIndex} of ${totalVideos}`);
    event.target.setShuffle(true);
    event.target.playVideoAt(startIndex);
    event.target.setLoop(true);
}

function onPlayerStateChange(event) {
    console.log("player state change", event.data);
    // https://developers.google.com/youtube/iframe_api_reference
}

function onPlayerError(event) {
    console.log("onPlayerError" + event.data)
    //playlist error
    if (event.data == 2) {
        setTimeout(playlistError, 1000);
    } else {
        setTimeout(playNext, 1000);
    }
}

function playlistError() {}

function playNext() {
    video.nextVideo();
}
