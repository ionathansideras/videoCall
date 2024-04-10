// Importing the SVG assets for the microphone and camera icons
import mic1 from "../assets/mic1.svg";
import mic2 from "../assets/mic2.svg";
import camera1 from "../assets/camera1.svg";
import camera2 from "../assets/camera2.svg";
// import switchcamera from "../assets/switch-camera.svg";

// Importing the useState hook from React
import { useState } from "react";

import { useSelector } from "react-redux";

import { VideoCallState } from "../types/types";

// import { setCameraSide } from "../redux/slices/videoCallSlice";

// The ConnectionControls component
export default function ConnectionControls() {
    const { localStream } = useSelector(
        (state: VideoCallState) => state.videoCall
    );

    //const dispatch = useDispatch();
    // State variables for whether the microphone and camera are muted
    const [mikeMuted, setMikeMuted] = useState(false);
    const [cameraMuted, setCameraMuted] = useState(false);

    // Function to mute/unmute the audio in the local stream
    const muteAudio = (localStream: MediaStream | null) => {
        const audioTracks = localStream?.getAudioTracks();
        if (audioTracks && audioTracks.length > 0) {
            // Toggle the enabled state of the first audio track
            audioTracks[0].enabled = !audioTracks[0].enabled;
        }
        // Update the state variable
        setMikeMuted(!mikeMuted);
    };

    // Function to mute/unmute the video in the local stream
    const muteVideo = (localStream: MediaStream | null) => {
        const videoTracks = localStream?.getVideoTracks();
        if (videoTracks && videoTracks.length > 0) {
            // Toggle the enabled state of the first video track
            videoTracks[0].enabled = !videoTracks[0].enabled;
        }
        // Update the state variable
        setCameraMuted(!cameraMuted);
    };

    // const handleChangeCamera = () => {
    //     if (cameraSide === "user") {
    //         dispatch(setCameraSide("environment"));
    //     } else {
    //         dispatch(setCameraSide("user"));
    //     }
    // };

    // async function switchCamera() {
    //     let peerConnections: RTCPeerConnection[] = []; // Array to store all peer connections
    //     // Get the user's media (video and audio)
    //     let stream = await navigator.mediaDevices.getUserMedia({
    //         video: {
    //             facingMode: cameraSide, // Or 'environment'
    //         },
    //         audio: true,
    //     });
    //     // Stop the current video tracks
    //     stream.getVideoTracks().forEach((track) => track.stop());

    //     // Get the new video stream
    //     const newStream = await navigator.mediaDevices.getUserMedia({
    //         video: {
    //             facingMode: cameraSide, // 'user' or 'environment'
    //         },
    //         audio: true,
    //     });

    //     // Get the new video track
    //     const newVideoTrack = newStream.getVideoTracks()[0];

    //     // Replace the video track in all peer connections
    //     peerConnections.forEach((pc) => {
    //         const oldTrack = pc
    //             .getSenders()
    //             .find((s) => s.track && s.track.kind === "video");
    //         if (oldTrack) {
    //             oldTrack.replaceTrack(newVideoTrack);
    //         }
    //     });

    //     // Replace the video track in the local stream
    //     stream = newStream;
    // }

    // useEffect(() => {
    //     switchCamera();
    // }, [cameraSide]);
    // The component's render method
    return (
        <div className="connection-controls">
            {/* Microphone icon, which mutes/unmutes the audio when clicked */}
            <img
                src={!mikeMuted ? mic2 : mic1}
                alt="mic"
                onClick={() => muteAudio(localStream)}
            />
            {/* Camera icon, which mutes/unmutes the video when clicked */}
            <img
                src={!cameraMuted ? camera2 : camera1}
                alt="camera"
                onClick={() => muteVideo(localStream)}
            />
            {/* Switch camera icon, which switches between front and back cameras */}
            {/* <img
                src={switchcamera}
                alt="switch-camera"
                onClick={handleChangeCamera}
            /> */}
        </div>
    );
}
