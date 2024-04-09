// Importing necessary hooks from React
import { useRef, useState, useEffect } from "react";
// Importing the Projection component
import Projection from "./components/Projection";
import CreateCall from "./components/CreateCall";
import JoinCall from "./components/JoinCall";
// Importing the useConnectToServer hook
import useConnectToServer from "./hooks/useConnectToServer";
import ConnectionControls from "./components/ConnectionControls";
import { startCamera } from "./helpers/startCamera";
import Snackbar from "@mui/material/Snackbar";

function App() {
    // State variables for join code, peer connection, local and remote streams
    const [pc, setPc] = useState<RTCPeerConnection | null>(null);
    const [joinCode, setJoinCode] = useState("");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [openToast, setOpenToast] = useState(false);
    const [openPopUp, setOpenPopUp] = useState(true);

    // References to various HTML elements
    const videoMe = useRef(null);
    const videoFriend = useRef(null);
    const webcamStart = useRef(null);
    const createCall = useRef<HTMLButtonElement>(null);
    const joinCall = useRef<HTMLButtonElement>(null);

    const popupRef = useRef<HTMLDivElement>(null);
    const coverRef = useRef<HTMLDivElement>(null);

    // Connect to the server
    useConnectToServer({ setPc });

    // Start the camera and set up the local and remote streams
    useEffect(() => {
        startCamera({
            videoMe,
            videoFriend,
            pc,
            setLocalStream,
        });
    }, [webcamStart, videoMe, videoFriend, pc]);

    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpenToast(false);
    };

    // Render the UI
    return (
        <main>
            <Projection videoMe={videoMe} videoFriend={videoFriend} />
            <ConnectionControls localStream={localStream} />
            <Snackbar
                open={openToast}
                autoHideDuration={7000}
                onClose={handleClose}
                message={`Call ID:  ${joinCode}`}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                ContentProps={{
                    style: { backgroundColor: "white", color: "black" },
                }}
            />
            <span
                className={`cover ${openPopUp ? "" : "hidden"}`}
                ref={coverRef}
            ></span>
            <div
                className={`pop-up ${openPopUp ? "" : "hidden"}`}
                ref={popupRef}
            >
                <CreateCall
                    createCall={createCall}
                    pc={pc}
                    setJoinCode={setJoinCode}
                    videoMe={videoMe}
                    videoFriend={videoFriend}
                    setOpenToast={setOpenToast}
                    setOpenPopUp={setOpenPopUp}
                />
                <div className="line">
                    <hr></hr>
                    <p>OR</p>
                    <hr></hr>
                </div>
                <JoinCall
                    joinCall={joinCall}
                    setJoinCode={setJoinCode}
                    pc={pc}
                    joinCode={joinCode}
                    videoMe={videoMe}
                    setOpenPopUp={setOpenPopUp}
                    videoFriend={videoFriend}
                />
            </div>
        </main>
    );
}

// Export the App component
export default App;
