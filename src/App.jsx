import { useRef, useState, useEffect } from "react";
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
    const [pc, setPc] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

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

    useEffect(() => {
        setPc(new RTCPeerConnection(servers));
    }, []);

    const handleStartCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        setLocalStream(stream);

        const remote = new MediaStream();
        setRemoteStream(remote);

        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remote.addTrack(track);
            });
        };

        videoFriend.current.srcObject = remote;
        videoMe.current.srcObject = stream;
    };

    const handleStartCall = async () => {
        if (!pc) return;

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
        callInput.current.value = callDocRef.id;

        // ICE candidates event handler for the local (offerer) peer
        pc.onicecandidate = (event) => {
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

        onSnapshot(callDocRef, (snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(
                    data.answer
                );
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
    };

    const handleJoinCall = async () => {
        if (!pc) return;

        const callId = callInput.current.value;
        const callDocRef = doc(db, "calls", callId);
        const answerCandidatesCollectionRef = collection(
            callDocRef,
            "answerCandidates"
        );

        pc.onicecandidate = async (event) => {
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
        <main>
            <div className="mirror-video-container">
                <video
                    ref={videoMe}
                    className="mirror-video"
                    autoPlay
                    playsInline
                    muted
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
