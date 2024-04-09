import { useRef, useState } from "react";
import {
    collection,
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    onSnapshot,
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

        videoFriend.current.srcObject = remoteStream;
        videoMe.current.srcObject = localStream;
    };

    const handleStartCall = async () => {
        // Create a new document in the 'calls' collection
        const callDoc = firestore.collection("calls").doc();
        // Create references for the 'offerCandidates' and 'answerCandidates' subcollections
        const offerCandidatesCollection = callDoc.collection("offerCandidates");
        const answerCandidatesCollection =
            callDoc.collection("answerCandidates");

        // Store the newly created call document's ID in an input field for later use
        callInput.current.value = callDoc.id;

        // ICE candidates event handler for the local (offerer) peer
        pc.onicecandidate = (event) => {
            event.candidate &&
                offerCandidatesCollection.add(event.candidate.toJSON());
        };

        // Create an SDP offer
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        // Save the offer in the call document
        await callDoc.set({ offer });

        callDoc.onSnapshot((snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(
                    data.answer
                );
                pc.setRemoteDescription(answerDescription);
            }
        });

        // Listen for remote ICE candidates
        answerCandidatesCollection.onSnapshot((snapshot) => {
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
        const callDoc = firestore.collection("calls").doc(callId);
        const answerCandidatesCollection =
            callDoc.collection("answerCandidates");

        pc.onicecandidate = async (event) => {
            event.candidate &&
                answerCandidatesCollection.add(event.candidate.toJSON());
        };

        // Fetching document data
        const callData = (await callDoc.get()).data();

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

        await callDoc.update({ answer });

        offerCandidates.onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    };

    return (
        <main>
            <div className="mirror-video-container">
                <video
                    ref={videoMe}
                    className="mirror-video"
                    autoPlay
                    playsInline
                ></video>
                <video
                    ref={videoFriend}
                    className="mirror-video"
                    autoPlay
                    playsInline
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
