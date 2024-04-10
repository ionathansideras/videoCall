import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPc } from "../redux/store";

export default function useConnectToServer() {
    const dispatch = useDispatch();

    useEffect(() => {
        // STUN server configuration
        const servers = {
            iceServers: [
                {
                    urls: [
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                    ],
                },
            ],
            iceCandidatePoolSize: 10, // Number of ICE candidates to gather before sending to the other peer
        };

        // On component mount, initialize the peer connection
        dispatch(setPc(new RTCPeerConnection(servers)));
    }, [setPc]);
}
