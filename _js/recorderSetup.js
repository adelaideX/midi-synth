/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*
	Stripped Back and Modified by Christian Haines 21/6/2016 -- christian.haines@adelaide.edu.au
*/

// Audio Recording :: Setup
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var audioSourceMix = null;
var audioSourceMixToSystem = false;  // turn on if audio needed to pass through recording to system output
var audioRecorder = null;
var audioRecordingToggle = true;
var recIndex = 0;
var oscillator = null;

// Audio Recording :: Save Audio as File
function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
}

// Audio Recording :: Grab Buffer Content Once Recording Complete
function gotBuffers( buffers ) {
    audioRecorder.exportWAV( doneEncoding );
}

// Audio Recording :: Complete Encoding and Download (from gotBuffers)
function doneEncoding( blob ) {
    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;
}

// Audio Recording :: Toggle
function toggleRecording() {
    if (!audioRecordingToggle) {
        // Stop Recording
        audioRecordingToggle = true;
        document.getElementById("recordButton").src = "_img/icon_recordingOff.png"
        document.getElementById("downloadButton").className = "buttonImg download on";
        audioRecorder.stop();
        audioRecorder.getBuffers( gotBuffers );
    } else {
        // Start Recording
        if (!audioRecorder)
            return;
        audioRecordingToggle = false;
        document.getElementById("recordButton").src = "_img/icon_recordingOn.png"
        document.getElementById("downloadButton").className = "buttonImg download off";
 		document.getElementById("downloadLink").href = "#";	       
 		document.getElementById("downloadLink").removeAttribute("download");
        audioRecorder.clear();
        audioRecorder.record();       
    }
}

// Audio Recording :: Initialise Audio Recording System
function initialiseAudioRecordingSystem() {

	// Source Mix to be Recorded (Test Oscillator) 
	// ########################################## 
	// ## REPLACE WITH AUDIO TO BE RECORDED ##
	// ##########################################
	 
	oscillator = audioContext.createOscillator();
	oscillator.type = 'sine';
	oscillator.frequency.value = 200;
	oscillator.start(); 

	// ###############################################
	// ## end of REPLACE WITH AUDIO TO BE RECORDED ##
	// ##############################################
	
	// Assign Audio to be Output & Recorded (audioInput) 
	audioSourceMix = oscillator;

	// Create Input and Record Gain Level
    audioSourceMixGain = audioContext.createGain();
	audioSourceMixGain.gain.value = 0.9;
	audioSourceMix = audioSourceMix.connect(audioSourceMixGain);
	
	// Source Mix sent to System Output
	if(audioSourceMixToSystem) {
		audioSourceMix.connect(audioContext.destination);
	}

	// Source Mix sent to Audio Recorder
    audioRecorder = new Recorder(compressor);
}

// On Window Load :: Initialise Audio Recording System
window.addEventListener('load', initialiseAudioRecordingSystem );
