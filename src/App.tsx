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
    const [joinCode, setJoinCode] = useState("");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
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
            <Projection
                videoMe={videoMe}
                videoFriend={videoFriend}
                localStream={localStream}
            />
            <OpenCamera
                videoMe={videoMe}
                videoFriend={videoFriend}
                webcamStart={webcamStart}
                pc={pc}
                setLocalStream={setLocalStream}
            />
            <CreateCall
                createCall={createCall}
                pc={pc}
                setJoinCode={setJoinCode}
                videoMe={videoMe}
                videoFriend={videoFriend}
            />
            <JoinCall
                joinCall={joinCall}
                setJoinCode={setJoinCode}
                pc={pc}
                joinCode={joinCode}
                videoMe={videoMe}
                videoFriend={videoFriend}
            />
        </main>
    );
}

// Export the App component
export default App;
