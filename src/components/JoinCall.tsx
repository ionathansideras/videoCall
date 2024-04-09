import {
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    onSnapshot,
} from "firebase/firestore";
// Importing the Firestore instance
import { db } from "../firebaseConfig";
import { JoinCallProps } from "../types/types";

export default function JoinCall({
    joinCall,
    pc,
    joinCode,
    setJoinCode,
}: JoinCallProps) {
    // Function to join a call
    const handleJoinCall = async () => {
        if (!pc) return;

        const callId = joinCode;
        console.log(callId);
        const callDocRef = doc(db, "calls", callId);
        const answerCandidatesCollectionRef = collection(
            callDocRef,
            "answerCandidates"
        );

        pc.onicecandidate = async (event: RTCPeerConnectionIceEvent) => {
            event.candidate &&
                addDoc(answerCandidatesCollectionRef, event.candidate.toJSON());
        };

        // Fetching document data
        const callDocSnap = await getDoc(callDocRef);
        if (callDocSnap.exists()) {
            const callData = callDocSnap.data();

            const offerDescription = callData.offer;
            await pc.setRemoteDescription(
                new RTCSessionDescription(offerDescription)
            );

            const answerDescription = await pc.createAnswer();
            await pc.setLocalDescription(answerDescription);

            const answer = {
                type: answerDescription.type,
                sdp: answerDescription.sdp,
            };

            await updateDoc(callDocRef, { answer });

            // Listen for remote ICE candidates
            onSnapshot(
                collection(callDocRef, "offerCandidates"),
                (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const data = change.doc.data();
                            pc.addIceCandidate(new RTCIceCandidate(data));
                        }
                    });
                }
            );
        } else {
            console.log("No such document!");
        }
    };
    return (
        <>
            <h3>join a call</h3>
            <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
            />
            <button ref={joinCall} onClick={handleJoinCall}>
                join call
            </button>
        </>
    );
}
