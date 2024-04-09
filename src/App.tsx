// Importing necessary hooks from React
import { useRef, useState } from "react";
// Importing the Projection component
import Projection from "./components/Projection";
import OpenCamera from "./components/OpenCamera";
import CreateCall from "./components/CreateCall";
import JoinCall from "./components/JoinCall";
// Importing the useConnectToServer hook
import useConnectToServer from "./hooks/useConnectToServer";

function App() {
    // State variables for join code, peer connection, local and remote streams
    const [pc, setPc] = useState<RTCPeerConnection | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [joinCode, setJoinCode] = useState("");

    // References to various HTML elements
    const videoMe = useRef(null);
    const videoFriend = useRef(null);
    const webcamStart = useRef(null);
    const createCall = useRef<HTMLButtonElement>(null);
    const joinCall = useRef<HTMLButtonElement>(null);

    // Connect to the server
    useConnectToServer({ setPc });

    // Render the UI
    return (
        <main>
            <Projection videoMe={videoMe} videoFriend={videoFriend} />
            <OpenCamera
                videoMe={videoMe}
                videoFriend={videoFriend}
                webcamStart={webcamStart}
                setLocalStream={setLocalStream}
                setRemoteStream={setRemoteStream}
                pc={pc}
            />
            <CreateCall
                createCall={createCall}
                pc={pc}
                setJoinCode={setJoinCode}
            />
            <JoinCall
                joinCall={joinCall}
                setJoinCode={setJoinCode}
                pc={pc}
                joinCode={joinCode}
            />
        </main>
    );
}

// Export the App component
export default App;
