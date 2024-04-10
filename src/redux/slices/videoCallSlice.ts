// src/features/videoCall/videoCallSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitialStateType } from "../../types/types";

// Define the initial state using that type
const initialState: InitialStateType = {
    pc: null,
    joinCode: "",
    localStream: null,
    openPopUp: true,
    cameraMicAccess: false,
};

export const videoCallSlice = createSlice({
    name: "videoCall",
    initialState,
    reducers: {
        setPc: (state, action: PayloadAction<RTCPeerConnection | null>) => {
            state.pc = action.payload;
        },
        setJoinCode: (state, action: PayloadAction<string>) => {
            state.joinCode = action.payload;
        },
        setLocalStream: (state, action: PayloadAction<MediaStream | null>) => {
            state.localStream = action.payload;
        },
        setOpenPopUp: (state, action: PayloadAction<boolean>) => {
            state.openPopUp = action.payload;
        },
        setCameraMicAccess: (state, action: PayloadAction<boolean>) => {
            state.cameraMicAccess = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setPc,
    setJoinCode,
    setLocalStream,
    setOpenPopUp,
    setCameraMicAccess,
} = videoCallSlice.actions;

export default videoCallSlice.reducer;
