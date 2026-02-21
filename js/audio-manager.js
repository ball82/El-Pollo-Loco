let musicListenerAttached = false;
let isMuted = false;
const MUTE_STORAGE_KEY = "el_pollo_loco_muted";

function initAudio() {
    isMuted = loadMutePreference();
    setAllAudioMuted(isMuted);
    setupMuteButtons();
}

function startBackgroundMusic() {
    playConfiguredTrack("bg-music", 0.02, startBackgroundMusic);
}

function startGameMusic() {
    playConfiguredTrack("game-music", 0.1, startGameMusic);
}

function playConfiguredTrack(id, volume, retryFn) {
    const audio = getAudio(id);
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
    playTrack(audio, retryFn);
}

function getAudio(id) {
    return document.getElementById(id);
}

function playTrack(audio, retryFn) {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => runOnFirstInteraction(retryFn));
    }
}

function playSfx(id, volume = 0.3) {
    if (isMuted) return;
    const audio = getAudio(id);
    if (!audio) return;
    audio.volume = volume;
    audio.currentTime = 0;
    playTrack(audio, () => playSfx(id, volume));
}

function pauseOtherTracks(activeId) {
    ["bg-music", "game-music"].forEach((trackId) => {
        if (trackId === activeId) return;
        resetTrack(trackId);
    });
}

function setBackgroundMusicLevel(volume) {
    const bgMusic = getAudio("bg-music");
    if (!bgMusic) return;
    bgMusic.volume = volume;
}

function stopAllSounds() {
    document.querySelectorAll("audio").forEach((track) => {
        track.pause();
        track.currentTime = 0;
    });
}

function toggleMute() {
    isMuted = !isMuted;
    setAllAudioMuted(isMuted);
    if (isMuted) stopAllSounds();
    saveMutePreference();
    updateMuteButtons();
}

function setAllAudioMuted(muted) {
    document.querySelectorAll("audio").forEach((track) => {
        track.muted = muted;
    });
}

function setupMuteButtons() {
    const buttons = document.querySelectorAll(".mute-toggle");
    if (!buttons.length) return;
    buttons.forEach((button) => button.addEventListener("click", toggleMute));
    updateMuteButtons();
}

function updateMuteButtons() {
    document.querySelectorAll(".mute-toggle").forEach((button) => {
        button.textContent = isMuted ? "Sound: Aus" : "Sound: An";
    });
}

function loadMutePreference() {
    try {
        return localStorage.getItem(MUTE_STORAGE_KEY) === "true";
    } catch (error) {
        return false;
    }
}

function saveMutePreference() {
    try {
        localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
    } catch (error) {
        // ignore storage errors (private mode / blocked storage)
    }
}

function runOnFirstInteraction(fn) {
    if (musicListenerAttached) return;
    const handler = () => handleFirstInteraction(fn, handler);
    addMusicStartListeners(handler);
    musicListenerAttached = true;
}

function handleFirstInteraction(fn, handler) {
    fn();
    removeMusicStartListeners(handler);
    musicListenerAttached = false;
}

function addMusicStartListeners(handler) {
    document.addEventListener("click", handler);
    document.addEventListener("keydown", handler);
    document.addEventListener("touchstart", handler);
}

function removeMusicStartListeners(handler) {
    document.removeEventListener("click", handler);
    document.removeEventListener("keydown", handler);
    document.removeEventListener("touchstart", handler);
}

function resetTrack(trackId) {
    const track = getAudio(trackId);
    if (!track) return;
    track.pause();
    track.currentTime = 0;
}
