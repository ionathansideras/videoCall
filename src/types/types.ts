type CreateCallProps = {
    createCall: React.RefObject<HTMLElement>; // adjust this based on the actual element type
    pc: RTCPeerConnection | null;
    setJoinCode: (value: string) => void;
};

type JoinCallProps = {
    joinCall: React.RefObject<HTMLButtonElement>; // adjust this based on the actual element type
    pc: RTCPeerConnection | null;
    joinCode: string;
    setJoinCode: (value: string) => void;
};

type ConnectToServerProps = {
    setPc: (value: RTCPeerConnection) => void;
};

type OpenCameraProps = {
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
    webcamStart: React.RefObject<HTMLElement>;
    pc: RTCPeerConnection | null; // allow pc to be null
};

type ProjectionProps = {
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
};

export type {
    CreateCallProps,
    JoinCallProps,
    ConnectToServerProps,
    OpenCameraProps,
    ProjectionProps,
};
