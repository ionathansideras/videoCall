const muteVideo = (localStream: MediaStream | null) => {
    const videoTracks = localStream?.getVideoTracks();
    if (videoTracks && videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
    }
};

export { muteVideo };
