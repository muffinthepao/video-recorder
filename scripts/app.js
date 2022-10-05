// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.video-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');
const mirror = document.getElementById("mirror")

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

      const clipName = prompt('Enter a name for your video clip?','My unnamed clip');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const video = document.createElement('video');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      video.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(video);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      video.controls = true;
      const blob = new Blob(chunks, { 'type' : 'video/mp4; codecs=avc1.424028, mp4a.40.2' });
      chunks = [];
      const videoURL = window.URL.createObjectURL(blob);
      video.src = videoURL;
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        e.target.closest(".clip").remove();
      }

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    }
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}
