import { RefObject } from "react";
import { MutableRefObject } from "react";

type CreateCallProps = {
    createCall: RefObject<HTMLButtonElement>;
    videoMe: MutableRefObject<HTMLVideoElement | null>;
    videoFriend: MutableRefObject<HTMLVideoElement | null>;
};

type JoinCallProps = {
    joinCall: React.RefObject<HTMLButtonElement>; // adjust this based on the actual element type
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
};

type StartCameraProps = {
    videoMe: RefObject<HTMLVideoElement>;
    videoFriend: RefObject<HTMLVideoElement>;
};

type ConnectToServerProps = {
    setPc: (value: RTCPeerConnection) => void;
};

type ProjectionProps = {
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
};

type ConnectionControlsProps = {
    localStream: MediaStream | null;
};

// Define a type for the slice state
type VideoCallState = {
    videoCall: {
        pc: RTCPeerConnection | null;
        joinCode: string;
        localStream: MediaStream | null;
        openPopUp: boolean;
        cameraMicAccess: boolean;
        cameraSide: "user" | "environment";
    };
};

type InitialStateType = {
    pc: RTCPeerConnection | null;
    joinCode: string;
    localStream: MediaStream | null;
    openPopUp: boolean;
    cameraMicAccess: boolean;
    cameraSide: "user" | "environment";
};

export type {
    CreateCallProps,
    JoinCallProps,
    ConnectToServerProps,
    ProjectionProps,
    ConnectionControlsProps,
    StartCameraProps,
    VideoCallState,
    InitialStateType,
};
