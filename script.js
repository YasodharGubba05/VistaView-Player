const videoBtn = document.querySelector("#videoBtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");
const totalTimeElem = document.querySelector("#totalTime");
const currentTimeElem = document.querySelector("#currentTime");
const slider = document.querySelector("#slider");


let video = ""
let duration;
let timerObj;
let currentPlayTime = 0;
let isPlaying = false;

const handleInput = () => {
   
    videoInput.click();
}
const acceptInputHandler = (obj) => {
    let selectedVideo;
  
    if (obj.type == "drop") {
        selectedVideo = obj.dataTransfer.files[0]

    } else {
        selectedVideo = obj.target.files[0];

    }
   
    const link = URL.createObjectURL(selectedVideo);
   
    const videoElement = document.createElement("video");
    videoElement.src = link;
    videoElement.setAttribute("class", "video");
  
    if (videoPlayer.children.length > 0) {

      
        videoPlayer.removeChild(videoPlayer.children[0]);
    }
    
    videoPlayer.appendChild(videoElement);
    video = videoElement
    isPlaying = true;
    setPlayPause();
    videoElement.play();
    videoElement.volume = 0.3;
    videoElement.addEventListener("loadedmetadata", function () {
        
        duration = Math.round(videoElement.duration);
        
        let time = timeFormat(duration);
        totalTimeElem.innerText = time;
        slider.setAttribute("max", duration);
        startTimer();

    })
}

videoBtn.addEventListener("click", handleInput);

videoInput.addEventListener("change", acceptInputHandler);



const speedUp = document.querySelector("#speedUp");
const speedDown = document.querySelector("#speedDown");
const volumeUp = document.querySelector("#volumeUp");
const volumeDown = document.querySelector("#volumeDown");
const toast = document.querySelector(".toast");

const speedUpHandler = () => {
  
    const videoElement = document.querySelector("video");
    if (videoElement == null) {
        return;
    }
   
    if (videoElement.playbackRate > 3) {
        return;
    }
    
    const increaseSpeed = videoElement.playbackRate + 0.5;
    videoElement.playbackRate = increaseSpeed;

    showToast(increaseSpeed + "X");

  
}
const speedDownhandler = () => {
    const videoElement = document.querySelector("video");
    if (videoElement == null) {
        return;
    }
    if (videoElement.playbackRate > 0) {
       
        const decreasedSpeed = videoElement.playbackRate - 0.5;
        videoElement.playbackRate = decreasedSpeed;
        console.log("decreased speed", decreasedSpeed)
        showToast(decreasedSpeed + "X");
    }
}

const volumeUpHandler = () => {
   
    const videoElement = document.querySelector("video");
    if (videoElement == null) {
        return;
    }
   
    if (videoElement.volume >= 0.99) {
        return;
    }
    const increasedVolume = videoElement.volume + 0.1
    videoElement.volume = increasedVolume;
   
    const percentage = (increasedVolume * 100) + "%";
    showToast(percentage)
}

const volumeDownHandler = () => {
 
    const videoElement = document.querySelector("video");
    if (videoElement == null) {
        return;
    }
    
    if (videoElement.volume <= 0.1) {
        videoElement.volume = 0;
        return
    }
    const decreaseVolume = videoElement.volume - 0.1;
    videoElement.volume = decreaseVolume
    const percentage = (decreaseVolume * 100) + "%";
    showToast(percentage)
}


function showToast(message) {
   
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none"
    }, 1000);
}



speedUp.addEventListener("click", speedUpHandler);
speedDown.addEventListener("click", speedDownhandler)
volumeUp.addEventListener("click", volumeUpHandler);
volumeDown.addEventListener("click", volumeDownHandler);



const handleFullScreen = () => {
    videoPlayer.requestFullscreen();
}

const fullScreenElem = document.querySelector("#fullScreen");
fullScreenElem.addEventListener("click", handleFullScreen)

slider.addEventListener("change", function (e) {
    let value = e.target.value;
    video.currentTime = value;
})


function forward() {
    currentPlayTime = Math.round(video.currentTime) + 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Forward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentTimeElem.innerText = time;
}

function backward() {
    currentPlayTime = Math.round(video.currentTime) - 5;
    video.currentTime = currentPlayTime;
    slider.setAttribute("value", currentPlayTime);
    showToast("Backward by 5 sec");
    let time = timeFormat(currentPlayTime);
    currentTimeElem.innerText = time;
}


const forwardBtn = document.querySelector("#forwardBtn");
const backwardBtn = document.querySelector("#backBtn");
forwardBtn.addEventListener("click", forward);
backwardBtn.addEventListener("click", backward);

const playPauseContainer = document.querySelector("#playPause");
function setPlayPause() {
    if (isPlaying === true) {
        playPauseContainer.innerHTML = `<i class="fas fa-pause state"></i>`;
        video.play();
    }
    else {
        playPauseContainer.innerHTML = `<i class="fas fa-play state"></i>`;
        video.pause();
    }
}

playPauseContainer.addEventListener("click", function (e) {
    if (video) {
        isPlaying = !isPlaying;
        setPlayPause();
    }
})

const stopBtn = document.querySelector("#stopBtn");
const stopHandler = () => {
    if (video) {
    
        video.remove();
       
        isPlaying = false;
        currentPlayTime = 0;
        slider.value = 0;
        video = "";
        duration = "";
        totalTimeElem.innerText = '--/--';
        currentTimeElem.innerText = '00:00';
        slider.setAttribute("value", 0);
        stopTimer();
        setPlayPause();
    }
}

stopBtn.addEventListener("click", stopHandler)

function timeFormat(timeCount) {
    let time = '';
    const sec = parseInt(timeCount, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds
    time = `${hours}:${minutes}:${seconds}`;
    return time;
}

 
function startTimer() {
    timerObj = setInterval(function () {
        currentPlayTime = Math.round(video.currentTime);
        slider.value = currentPlayTime;
        const time = timeFormat(currentPlayTime);
        currentTimeElem.innerText = time;
        if (currentPlayTime == duration) {
            state = "pause";
            stopTimer();
            setPlayPause();
            video.remove();
            slider.value = 0;
            currentTimeElem.innerText = "00:00:00";
            totalTimeElem.innerText = '--/--/--';
        }
    }, 1000);
}
function stopTimer() {
    clearInterval(timerObj);
}
