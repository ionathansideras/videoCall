import { ProjectionProps } from "../types/types";
export default function Projection({ videoMe, videoFriend }: ProjectionProps) {
    return (
        <div className="projection">
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
