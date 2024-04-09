import { ProjectionProps } from "../types/types";
import { handleMuteVideo } from "../helpers/muteVideo";
import { handleMuteAudio } from "../helpers/muteAudio";

export default function Projection({
    videoMe,
    videoFriend,
    localStream,
}: ProjectionProps) {
    return (
        <div className="projection">
            <button onClick={() => handleMuteAudio(localStream)}>
                Mute/Unmute Audio
            </button>
            <button onClick={() => handleMuteVideo(localStream)}>
                Mute/Unmute Video
            </button>
            <video
                ref={videoMe}
                className={`mirror-video`}
                autoPlay
                playsInline
                id="mirror-video-me"
                muted
            ></video>
            <video
                ref={videoFriend}
                className="mirror-video"
                autoPlay
                playsInline
                id="mirror-video-friend"
            ></video>
        </div>
    );
}
