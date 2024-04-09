import { RefObject } from "react";
import { Dispatch, SetStateAction } from "react";
import { MutableRefObject } from "react";

type CreateCallProps = {
    createCall: RefObject<HTMLButtonElement>;
    pc: RTCPeerConnection | null;
    setJoinCode: Dispatch<SetStateAction<string>>;
    videoMe: MutableRefObject<HTMLVideoElement | null>;
    videoFriend: MutableRefObject<HTMLVideoElement | null>;
    setOpenToast: Dispatch<SetStateAction<boolean>>;
    setOpenPopUp: Dispatch<SetStateAction<boolean>>;
};

type JoinCallProps = {
    joinCall: React.RefObject<HTMLButtonElement>; // adjust this based on the actual element type
    pc: RTCPeerConnection | null;
    joinCode: string;
    setJoinCode: (value: string) => void;
    videoMe: React.RefObject<HTMLVideoElement>;
    videoFriend: React.RefObject<HTMLVideoElement>;
    setOpenPopUp: React.Dispatch<React.SetStateAction<boolean>>;
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

type ConnectionControlsProps = {
    localStream: MediaStream | null;
};
export type {
    CreateCallProps,
    JoinCallProps,
    ConnectToServerProps,
    ProjectionProps,
    ConnectionControlsProps,
    StartCameraProps,
};
