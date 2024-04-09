import { ConnectionControlsProps } from "../types/types";
import mic1 from "../assets/mic1.svg";
import mic2 from "../assets/mic2.svg";
import camera1 from "../assets/camera1.svg";
import camera2 from "../assets/camera2.svg";
import { useState } from "react";

export default function ConnectionControls({
    localStream,
}: ConnectionControlsProps) {
    const [mikeMuted, setMikeMuted] = useState(false);
    const [cameraMuted, setCameraMuted] = useState(false);

    const muteAudio = (localStream: MediaStream | null) => {
        const audioTracks = localStream?.getAudioTracks();
        if (audioTracks && audioTracks.length > 0) {
            audioTracks[0].enabled = !audioTracks[0].enabled;
        }
        setMikeMuted(!mikeMuted);
    };

    const muteVideo = (localStream: MediaStream | null) => {
        const videoTracks = localStream?.getVideoTracks();
        if (videoTracks && videoTracks.length > 0) {
            videoTracks[0].enabled = !videoTracks[0].enabled;
        }
        setCameraMuted(!cameraMuted);
    };
    return (
        <div className="connection-controls">
            <img
                src={!mikeMuted ? mic2 : mic1}
                alt="mic"
                onClick={() => muteAudio(localStream)}
            />
            <img
                src={!cameraMuted ? camera2 : camera1}
                alt="camera"
                onClick={() => muteVideo(localStream)}
            />
        </div>
    );
}
