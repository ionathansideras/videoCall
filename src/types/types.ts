import { RefObject } from "react";

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

type StartCameraProps = {
    videoMe: RefObject<HTMLVideoElement>;
    videoFriend: RefObject<HTMLVideoElement>;
    pc: RTCPeerConnection | null;
    setLocalStream: (stream: MediaStream) => void;
};

type ConnectToServerProps = {
    setPc: (value: RTCPeerConnection) => void;
};

type ProjectionProps = {
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
};

type ConectionControlsProps = {
    localStream: MediaStream | null;
};
export type {
    CreateCallProps,
    JoinCallProps,
    ConnectToServerProps,
    ProjectionProps,
    ConectionControlsProps,
    StartCameraProps,
};
