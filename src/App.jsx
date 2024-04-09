import { useRef, useState } from "react";
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    getDoc,
    addDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

function App() {
    const [joinCode, setJoinCode] = useState("");
    const servers = {
        iceServers: [
            {
                urls: [
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    };
    const videoMe = useRef(null);
    const videoFriend = useRef(null);
    const webcamStart = useRef(null);
    const createCall = useRef(null);
    const joinCall = useRef(null);
    const hangupCall = useRef(null);
    const callInput = useRef(null);

    let pc = new RTCPeerConnection(servers);
    let localStream = null;
    let remoteStream = null;

    const handleStartCamera = async () => {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        remoteStream = new MediaStream();

        // Mute the microphone
        localStream
            .getAudioTracks()
            .forEach((track) => (track.enabled = false));

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        videoMe.current.srcObject = localStream;
        videoFriend.current.srcObject = remoteStream;
    };

    const handleStartCall = async () => {
        // Create a new document in the 'calls' collection
        const callDocRef = doc(collection(db, "calls"));
        // Create references for the 'offerCandidates' and 'answerCandidates' subcollections
        const offerCandidatesCollection = collection(
            callDocRef,
            "offerCandidates"
        );
        const answerCandidatesCollection = collection(
            callDocRef,
            "answerCandidates"
        );

        // Store the newly created call document's ID in an input field for later use
        callInput.current.value = callDocRef.id;

        // ICE candidates event handler for the local (offerer) peer
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                // Add each new ICE candidate to the 'offerCandidates' collection
                addDoc(offerCandidatesCollection, event.candidate.toJSON());
            }
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

        // Listen for changes to the call document, specifically looking for an answer
        onSnapshot(callDocRef, (snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(
                    data.answer
                );
                pc.setRemoteDescription(answerDescription);
            }
        });

        // Listen for ICE candidates added to the 'answerCandidates' collection
        onSnapshot(answerCandidatesCollection, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });
    };

    const handleJoinCall = async () => {
        const callId = callInput.current.value;

        // Correctly reference the document using the Firestore modular SDK
        const callDocRef = doc(db, "calls", callId);

        // To get a reference to a subcollection of offerCandidates
        const offerCandidatesCollection = collection(
            db,
            `calls/${callId}/offerCandidates`
        );

        pc.onicecandidate = async (event) => {
            if (event.candidate) {
                await addDoc(
                    offerCandidatesCollection,
                    event.candidate.toJSON()
                );
            }
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

            // Update the document with the answer
            await updateDoc(callDocRef, { answer });

            // Listening to changes in the offerCandidates collection
            onSnapshot(offerCandidatesCollection, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const candidate = new RTCIceCandidate(
                            change.doc.data()
                        );
                        pc.addIceCandidate(candidate);
                    }
                });
            });
        } else {
            console.log("No such document!");
        }
    };

    return (
        <main>
            <div className="mirror-video-container">
                <video ref={videoMe} className="mirror-video" autoPlay></video>
                <video
                    ref={videoFriend}
                    className="mirror-video"
                    autoPlay
                ></video>
            </div>
            <button ref={webcamStart} onClick={handleStartCamera}>
                start webcam
            </button>
            <h2>create a new call</h2>
            <button ref={createCall} onClick={handleStartCall}>
                create call
            </button>
            <h3>join a call</h3>
            <input
                ref={callInput}
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
            />
            <button ref={joinCall} onClick={handleJoinCall}>
                join call
            </button>
            <h4>hangup a call</h4>
            <button ref={hangupCall}>hangup call</button>
        </main>
    );
}

export default App;
