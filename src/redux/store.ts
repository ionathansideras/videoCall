// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import videoCallReducer from "./slices/videoCallSlice";
import {
    setPc,
    setJoinCode,
    setLocalStream,
    setOpenPopUp,
    setCameraMicAccess,
    setCameraSide,
} from "./slices/videoCallSlice";

const store = configureStore({
    reducer: {
        videoCall: videoCallReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serialization checks completely
        }),
});

export {
    store,
    setPc,
    setJoinCode,
    setLocalStream,
    setOpenPopUp,
    setCameraMicAccess,
    setCameraSide,
};
