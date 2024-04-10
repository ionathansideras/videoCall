// Import Firestore functions
import {
    collection,
    doc,
    setDoc,
    addDoc,
    onSnapshot,
} from "firebase/firestore";
import { CreateCallProps } from "../types/types";
// Import Firestore instance
import { db } from "../firebaseConfig";
// Import toast functions
import { errorToast, accessCodeToast } from "../helpers/toasts";

import { useDispatch, useSelector } from "react-redux";
import { setJoinCode, setOpenPopUp } from "../redux/store";
import { VideoCallState } from "../types/types";

// Define CreateCall component
export default function CreateCall({
    createCall,
    videoMe,
    videoFriend,
}: CreateCallProps) {
    const dispatch = useDispatch();
    // Get the peer connection and camera/mic access from the Redux store
    const { pc, cameraMicAccess } = useSelector(
        (state: VideoCallState) => state.videoCall
    );

    // Define function to start a call
    const handleStartCall = async () => {
        // If no peer connection or no camera/mic access, return
        if (!pc || !cameraMicAccess) {
            errorToast("Allow camera and microphone access to start the call.");
            return;
        }
        // Close the popup
        dispatch(setOpenPopUp(false));

        // Create a new document in the 'calls' collection
        const callDocRef = doc(collection(db, "calls"));
        // Create references to the offer and answer candidates collections
        const offerCandidatesCollectionRef = collection(
            callDocRef,
            "offerCandidates"
        );
        const answerCandidatesCollectionRef = collection(
            callDocRef,
            "answerCandidates"
        );

        // Store the call document's ID
        dispatch(setJoinCode(callDocRef.id));

        // Handle ICE candidates for the local peer
        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            // If there's a candidate, add it to the offer candidates collection
            event.candidate &&
                addDoc(offerCandidatesCollectionRef, event.candidate.toJSON());
        };

        // Create an SDP offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        // Define the offer
        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        // Save the offer in the call document
        await setDoc(callDocRef, { offer });

        // Listen for an answer to the offer
        onSnapshot(callDocRef, (snapshot) => {
            const data = snapshot.data();
            // If there's an answer and no current remote description, set the remote description
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(
                    data.answer
                );
                // Add 'active' class to the video elements
                videoMe.current?.classList.add("active");
                videoFriend.current?.classList.add("active");
                pc.setRemoteDescription(answerDescription);
            }
        });

        // Listen for remote ICE candidates
        onSnapshot(answerCandidatesCollectionRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                // If a new document was added, add the candidate to the peer connection
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });

        // Show a toast with the call ID
        accessCodeToast(callDocRef.id);
    };

    // Render the component
    return (
        <div className="create">
            <h2>Create a new call</h2>
            <button
                ref={
                    createCall as React.LegacyRef<HTMLButtonElement> | undefined
                }
                onClick={handleStartCall}
            >
                Create
            </button>
        </div>
    );
}
