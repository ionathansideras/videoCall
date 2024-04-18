// Import Firestore functions
import {
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    onSnapshot,
} from "firebase/firestore";

// Import Firestore instance
import { db } from "../firebaseConfig";

// Import types and helper functions
import { JoinCallProps } from "../types/types";
import { errorToast } from "../helpers/toasts";

import { useDispatch, useSelector } from "react-redux";
import { setJoinCode, setOpenPopUp } from "../redux/store";
import { VideoCallState } from "../types/types";

// Define JoinCall component
export default function JoinCall({
    joinCall,
    videoMe,
    videoFriend,
}: JoinCallProps) {
    // Get the peer connection and camera/mic access from the Redux store
    const { pc, cameraMicAccess, joinCode } = useSelector(
        (state: VideoCallState) => state.videoCall
    );

    const dispatch = useDispatch();
    // Function to handle joining a call
    const handleJoinCall = async (e: React.FormEvent) => {
        e.preventDefault();
        // Check if PeerConnection and camera/microphone access are available
        if (!pc || !cameraMicAccess) {
            errorToast("Allow camera and microphone access to join the call.");
            return;
        }

        // Check if join code is provided
        if (!joinCode) return;

        // Get Firestore document reference for the call and answer candidates
        const callId = joinCode;
        const callDocRef = doc(db, "calls", callId);
        const answerCandidatesCollectionRef = collection(
            callDocRef,
            "answerCandidates"
        );

        // Handle ICE candidate event
        pc.onicecandidate = async (event: RTCPeerConnectionIceEvent) => {
            // Add ICE candidate to Firestore
            event.candidate &&
                addDoc(answerCandidatesCollectionRef, event.candidate.toJSON());
        };

        // Fetch call document from Firestore
        const callDocSnap = await getDoc(callDocRef);
        if (callDocSnap.exists()) {
            const callData = callDocSnap.data();

            // Check if the call has already been answered
            if (callData.answer) {
                errorToast("This ID is expired or already in use.");
                return; // Prevent further execution if the call is answered
            }

            // Set remote description from offer
            const offerDescription = callData.offer;
            await pc.setRemoteDescription(
                new RTCSessionDescription(offerDescription)
            );

            // Create answer and set local description
            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            // Update Firestore document with answer
            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };
            await updateDoc(callDocRef, { answer });

            // Listen for remote ICE candidates and add them to the PeerConnection
            onSnapshot(
                collection(callDocRef, "offerCandidates"),
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const data = change.doc.data();
                            pc.addIceCandidate(new RTCIceCandidate(data));

                            // Add 'active' class to video elements if not already present
                            if (
                                !videoMe.current?.classList.contains(
                                    "active"
                                ) &&
                                !videoFriend.current?.classList.contains(
                                    "active"
                                )
                            ) {
                                videoMe.current?.classList.add("active");
                                videoFriend.current?.classList.add("active");
                            }
                        }
                    });
                }
            );

            // Close the popup
            dispatch(setOpenPopUp(false));
        } else {
            // Handle case where call ID is not found
            errorToast("Call ID not found or its expired.");
        }
    };

    // Render the component
    return (
        <form className="join" onSubmit={handleJoinCall}>
            <h2>Join a call</h2>
            <input
                type="text"
                value={joinCode}
                onChange={(e) => dispatch(setJoinCode(e.target.value))}
                placeholder="Enter the call ID here"
            />
            <button ref={joinCall}>Join</button>
        </form>
    );
}
