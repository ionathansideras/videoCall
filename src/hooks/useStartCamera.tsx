import { useEffect } from "react";
import { StartCameraProps } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { setLocalStream, setCameraMicAccess } from "../redux/store";
import { VideoCallState } from "../types/types";

// Custom hook to start the camera and set up the local and remote streams
export const useStartCamera = ({ videoMe, videoFriend }: StartCameraProps) => {
    const dispatch = useDispatch();
    const { pc, cameraSide } = useSelector(
        (state: VideoCallState) => state.videoCall
    );

    useEffect(() => {
        const startCamera = async () => {
            try {
                const supports =
                    navigator.mediaDevices.getSupportedConstraints();
                if (!supports["facingMode"]) {
                    alert("This browser does not support facingMode!");
                }

                // Get the user's media (video and audio)
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: cameraSide, // Or 'environment'
                    },
                    audio: true,
                });

                // Create a new MediaStream for the remote video
                const remote = new MediaStream();

                // Set the local stream in the state
                dispatch(setLocalStream(stream));

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
                dispatch(setCameraMicAccess(true));
            } catch (error) {
                console.error("Error adding tracks to peer connection ", error);
                dispatch(setCameraMicAccess(false));
            }
        };

        startCamera();
    }, [dispatch, pc, videoMe, videoFriend]);
};
