// Importing necessary hooks from React
import { useRef } from "react";
// Importing the Projection component
import Projection from "./components/Projection";
import CreateCall from "./components/CreateCall";
import JoinCall from "./components/JoinCall";
// Importing the useConnectToServer hook
import useConnectToServer from "./hooks/useConnectToServer";
import ConnectionControls from "./components/ConnectionControls";
import { useStartCamera } from "./hooks/useStartCamera";
import { useSelector } from "react-redux";
import { VideoCallState } from "./types/types";

function App() {
    // Get the peer connection from the Redux store
    const openPopUp = useSelector(
        (state: VideoCallState) => state.videoCall.openPopUp
    );
    console.log("openPopUp", openPopUp);

    const videoMe = useRef(null);
    const videoFriend = useRef(null);
    //const webcamStart = useRef(null);
    const createCall = useRef<HTMLButtonElement>(null);
    const joinCall = useRef<HTMLButtonElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const coverRef = useRef<HTMLDivElement>(null);

    // Connect to the server
    useConnectToServer();

    // Start the camera and set up the local and remote streams
    useStartCamera({ videoMe, videoFriend });

    // Render the UI
    return (
        <main>
            <Projection videoMe={videoMe} videoFriend={videoFriend} />
            <ConnectionControls />
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
                    videoMe={videoMe}
                    videoFriend={videoFriend}
                />
                <div className="line">
                    <hr></hr>
                    <p>OR</p>
                    <hr></hr>
                </div>
                <JoinCall
                    joinCall={joinCall}
                    videoMe={videoMe}
                    videoFriend={videoFriend}
                />
            </div>
        </main>
    );
}

// Export the App component
export default App;
