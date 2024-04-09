const muteAudio = (localStream: MediaStream | null) => {
    const audioTracks = localStream?.getAudioTracks();
    if (audioTracks && audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
    }
};

export { muteAudio };
