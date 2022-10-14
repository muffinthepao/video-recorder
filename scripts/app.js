// set up basic variables for app
const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const combine = document.querySelector('.combine')
const combinedVideo = document.querySelector('.combined-video')
const soundClips = document.querySelector('.video-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
const mirror = document.getElementById("mirror")
let clips = []

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

// let audioCtx;
// const canvasCtx = canvas.getContext("2d");

//main block for doing the video/audio recording
//if there are mediaDevices and broswer supports their use, proceed
if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  //what type of media do i want to utilize?
  const constraints = { video: true, audio: true };
  let chunks = [];

  let onSuccess = function(stream) {
    const mediaRecorder = new MediaRecorder(stream);

    // video mirror
    mirror.srcObject = stream;
    mirror.play();

    //start recording
    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    //stop recording
    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }

    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");


      const clipContainer = document.createElement('article');
      const video = document.createElement('video');
      const aTag = document.createElement('a')

      clipContainer.classList.add('clip');
      video.setAttribute('controls', '');


      clipContainer.appendChild(video);
      soundClips.appendChild(clipContainer);

      video.controls = true;
      const blob = new Blob(chunks, { 'type' : 'video/mp4' });
      chunks = [];
      const videoURL = window.URL.createObjectURL(blob);
      video.src = videoURL;
      console.log("recorder stopped");    

    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
      clips.push(e.data)
    }

    combine.onclick = function() {
        console.log("combine")

        if (clips.length === 0) {
            alert('Nothing to combine')
        } else {
            ConcatenateBlobs(clips, 'video/mp4', function(resultingBlob) {
                const video = document.createElement('video');
                video.setAttribute('controls', '');
                video.src = URL.createObjectURL(resultingBlob);
                combinedVideo.appendChild(video);
            });


        }
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}
