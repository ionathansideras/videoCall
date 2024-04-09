import {
    collection,
    doc,
    setDoc,
    addDoc,
    onSnapshot,
} from "firebase/firestore";
import { CreateCallProps } from "../types/types";
// Importing the Firestore instance
import { db } from "../firebaseConfig";

export default function CreateCall({
    createCall,
    pc,
    setJoinCode,
    videoMe,
    videoFriend,
    setOpenToast,
    setOpenPopUp,
}: CreateCallProps) {
    // Function to start a call
    const handleStartCall = async () => {
        if (!pc) return;
        setOpenPopUp(false);

        // Create a new document in the 'calls' collection
        const callDocRef = doc(collection(db, "calls"));
        const offerCandidatesCollectionRef = collection(
            callDocRef,
            "offerCandidates"
        );
        const answerCandidatesCollectionRef = collection(
            callDocRef,
            "answerCandidates"
        );

        // Store the newly created call document's ID in an input field for later use
        setJoinCode(callDocRef.id);

        // ICE candidates event handler for the local (offerer) peer
        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            event.candidate &&
                addDoc(offerCandidatesCollectionRef, event.candidate.toJSON());
        };

        // Create an SDP offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        // Save the offer in the call document
        await setDoc(callDocRef, { offer });

        // Listen for an answer to the offer
        onSnapshot(callDocRef, (snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(
                    data.answer
                );
                videoMe.current?.classList.add("active");
                videoFriend.current?.classList.add("active");
                pc.setRemoteDescription(answerDescription);
            }
        });

        // Listen for remote ICE candidates
        onSnapshot(answerCandidatesCollectionRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });
        setOpenToast(true);
    };

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
