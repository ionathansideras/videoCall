import { OpenCameraProps } from "../types/types";

export default function OpenCamera({
    webcamStart,
    videoMe,
    videoFriend,
    pc,
    setLocalStream,
}: OpenCameraProps) {
    // Function to start the camera and set up the local and remote streams
    const handleStartCamera = async () => {
        // Get the user's media (video and audio)
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        // Create a new MediaStream for the remote video
        const remote = new MediaStream();

        // Set the local stream in the state
        setLocalStream(stream);

        // Add each track from the local stream to the peer connection
        stream.getTracks().forEach((track) => {
            if (pc) {
                pc.addTrack(track, stream);
            }
        });

        // When a track is added to the peer connection, add it to the remote stream
        if (pc) {
            pc.ontrack = (event) => {
                event.streams[0].getTracks().forEach((track) => {
                    remote.addTrack(track);
                });
            };
        }

        // Set the source of the video elements to the local and remote streams
        if (videoFriend.current) {
            videoFriend.current.srcObject = remote;
        }
        if (videoMe.current) {
            videoMe.current.srcObject = stream;
        }
    };

    return (
        <button
            ref={webcamStart as React.LegacyRef<HTMLButtonElement> | undefined}
            onClick={handleStartCamera}
        >
            start webcam
        </button>
    );
}
