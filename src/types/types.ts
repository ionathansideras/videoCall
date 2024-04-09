type CreateCallProps = {
    createCall: React.RefObject<HTMLElement>; // adjust this based on the actual element type
    pc: RTCPeerConnection | null;
    setJoinCode: (value: string) => void;
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
};

type JoinCallProps = {
    joinCall: React.RefObject<HTMLButtonElement>; // adjust this based on the actual element type
    pc: RTCPeerConnection | null;
    joinCode: string;
    setJoinCode: (value: string) => void;
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
};

type ConnectToServerProps = {
    setPc: (value: RTCPeerConnection) => void;
};

type OpenCameraProps = {
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
    webcamStart: React.RefObject<HTMLElement>;
    pc: RTCPeerConnection | null; // allow pc to be null
    setLocalStream: (value: MediaStream) => void;
};

type ProjectionProps = {
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
    setLocalStream: (value: MediaStream) => void;
};

export type {
    CreateCallProps,
    JoinCallProps,
    ConnectToServerProps,
    OpenCameraProps,
    ProjectionProps,
};
