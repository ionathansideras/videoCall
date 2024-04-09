import { muteVideo } from "../helpers/muteVideo";
import { muteAudio } from "../helpers/muteAudio";
import { ConectionControlsProps } from "../types/types";

export default function ConectionControls({
    localStream,
}: ConectionControlsProps) {
    return (
        <>
            <button onClick={() => muteAudio(localStream)}>
                Mute/Unmute Audio
            </button>
            <button onClick={() => muteVideo(localStream)}>
                Mute/Unmute Video
            </button>
        </>
    );
}
