let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let musicListenerAttached = false;
let isMuted = false;
let mobileControlsReady = false;
let orientationGuardReady = false;

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    hideLanding();
    hideEndScreen();
    stopAllSounds();
    pauseOtherTracks("game-music");
    startGameMusic();
    init();
}

function hideLanding() {
    const landing = document.getElementById("landing");
    if (landing) landing.classList.add("hidden");
}

function showLanding() {
    const landing = document.getElementById("landing");
    if (landing) landing.classList.remove("hidden");
    stopAllSounds();
    pauseOtherTracks("bg-music");
    startBackgroundMusic();
}

function showEndScreen(isWin) {
    const endscreen = document.getElementById("endscreen");
    const title = document.getElementById("end-title");
    const text = document.getElementById("end-text");
    if (!endscreen || !title || !text) return;
    if (isWin) {
        title.textContent = "Gewonnen!";
        text.textContent = "Stark! Du hast den Endboss besiegt.";
    } else {
        title.textContent = "Game Over";
        text.textContent = "Du hast verloren. Versuch es nochmal!";
    }
    endscreen.classList.remove("hidden");
}

function hideEndScreen() {
    const endscreen = document.getElementById("endscreen");
    if (endscreen) endscreen.classList.add("hidden");
}

function restartGame() {
    stopCurrentWorld();
    hideEndScreen();
    gameStarted = true;
    level1 = createLevel1();
    stopAllSounds();
    pauseOtherTracks("game-music");
    startGameMusic();
    init();
}

function backToHome() {
    stopCurrentWorld();
    hideEndScreen();
    showLanding();
    gameStarted = false;
    level1 = createLevel1();
}

function stopCurrentWorld() {
    if (!world) return;
    world.stop();
    world = null;
    resetKeyboard();
}

function resetKeyboard() {
    keyboard.left = false;
    keyboard.right = false;
    keyboard.up = false;
    keyboard.down = false;
    keyboard.space = false;
    keyboard.D = false;
}

function setupMobileControls() {
    if (mobileControlsReady) return;
    const buttons = getMobileControlButtons();
    if (buttons.length === 0) return;
    const handlers = createMobileControlHandlers();
    attachMobileControlHandlers(buttons, handlers);
    mobileControlsReady = true;
}

function getMobileControlButtons() {
    const container = document.getElementById("mobile-controls");
    if (!container) return [];
    return Array.from(container.querySelectorAll("[data-action]"));
}

function setMobileKey(action, pressed) {
    if (action === "left") keyboard.left = pressed;
    if (action === "right") keyboard.right = pressed;
    if (action === "jump") keyboard.space = pressed;
    if (action === "throw") keyboard.D = pressed;
}

function createMobileControlHandlers() {
    const startHandler = (event) => {
        event.preventDefault();
        const action = event.currentTarget.dataset.action;
        setMobileKey(action, true);
    };
    const endHandler = (event) => {
        event.preventDefault();
        const action = event.currentTarget.dataset.action;
        setMobileKey(action, false);
    };
    return { startHandler, endHandler };
}

function attachMobileControlHandlers(buttons, handlers) {
    buttons.forEach((button) => {
        button.addEventListener("touchstart", handlers.startHandler, { passive: false });
        button.addEventListener("touchend", handlers.endHandler, { passive: false });
        button.addEventListener("touchcancel", handlers.endHandler, { passive: false });
        button.addEventListener("mousedown", handlers.startHandler);
        button.addEventListener("mouseup", handlers.endHandler);
        button.addEventListener("mouseleave", handlers.endHandler);
        button.addEventListener("contextmenu", (event) => event.preventDefault());
    });
}

function setupOrientationGuard() {
    if (orientationGuardReady) return;
    const overlay = document.getElementById("rotate-overlay");
    if (!overlay) return;
    const isMobileView = () =>
        window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 900;
    const update = () => {
        const portrait = window.matchMedia("(orientation: portrait)").matches;
        overlay.classList.toggle("hidden", !(isMobileView() && portrait));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    orientationGuardReady = true;
}

function openModal(type) {
    setModalContent(type);
    toggleModal(true);
}

function closeModal() {
    toggleModal(false);
}

function toggleModal(show) {
    const modal = document.getElementById("info-modal");
    if (!modal) return;
    modal.classList.toggle("hidden", !show);
}

function setModalContent(type) {
    const title = document.getElementById("modal-title");
    const content = document.getElementById("modal-content");
    if (!title || !content) return;
    const data = getModalData(type);
    title.textContent = data.title;
    content.innerHTML = data.html;
}

function getModalData(type) {
    if (type === "controls") return getControlsData();
    if (type === "story") return getStoryData();
    return getHowToData();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        return;
    }
    document.exitFullscreen();
}

document.addEventListener("keydown", (event) => {
    if (!world) return;
    if (event.key === "ArrowRight") {
        keyboard.right = true;
    }
    if (event.key === "ArrowLeft") {
        keyboard.left = true;
    }
    if (event.key === "ArrowUp") {
        keyboard.up = true;
    }
    if (event.key === "ArrowDown") {
        keyboard.down = true;
    }
    if (event.key === " ") {
        keyboard.space = true;
    }
    if (event.key === "d") {
        keyboard.D = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (!world) return;
    if (event.key === "ArrowRight") {
        keyboard.right = false;
    }                   
    if (event.key === "ArrowLeft") {
        keyboard.left = false;
    }
    if (event.key === "ArrowUp") {
        keyboard.up = false;
    }
    if (event.key === "ArrowDown") {
        keyboard.down = false;
    }
    if (event.key === " ") {
        keyboard.space = false;
    }
    if (event.key === "d") {
        keyboard.D = false;
    }
});

function startLandingWhenReady() {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            canvas = document.getElementById("canvas");
            resizeCanvasToViewport();
            setupMobileControls();
            setupOrientationGuard();
            setupViewportResize();
            setupMuteButtons();
            startBackgroundMusic();
        });
    } else {
        canvas = document.getElementById("canvas");
        resizeCanvasToViewport();
        setupMobileControls();
        setupOrientationGuard();
        setupViewportResize();
        setupMuteButtons();
        startBackgroundMusic();
    }
}

startLandingWhenReady();

function setupViewportResize() {
    window.addEventListener("resize", resizeCanvasToViewport);
    window.addEventListener("orientationchange", resizeCanvasToViewport);
}

function resizeCanvasToViewport() {
    if (!canvas) return;
    const isMobile =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(max-width: 1024px)").matches;
    if (!isMobile) {
        canvas.style.width = "";
        canvas.style.height = "";
        return;
    }
    canvas.width = 720;
    canvas.height = 480;
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
}

function startBackgroundMusic() {
    const bgMusic = getAudio("bg-music");
    if (!bgMusic) return;
    bgMusic.volume = 0.02;
    bgMusic.muted = isMuted;
    playTrack(bgMusic, () => startBackgroundMusic());
}

function startGameMusic() {
    const gameMusic = getAudio("game-music");
    if (!gameMusic) return;
    gameMusic.volume = 0.1;
    gameMusic.muted = isMuted;
    playTrack(gameMusic, () => startGameMusic());
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
    const audio = getAudio(id);
    if (!audio) return;
    if (isMuted) return;
    audio.volume = volume;
    audio.currentTime = 0;
    playTrack(audio, () => playSfx(id, volume));
}

function pauseOtherTracks(activeId) {
    const tracks = ["bg-music", "game-music"];
    tracks.forEach((trackId) => {
        if (trackId === activeId) return;
        const track = getAudio(trackId);
        if (!track) return;
        track.pause();
        track.currentTime = 0;
    });
}

function setBackgroundMusicLevel(volume) {
    const bgMusic = getAudio("bg-music");
    if (!bgMusic) return;
    bgMusic.volume = volume;
}

function stopAllSounds() {
    const tracks = document.querySelectorAll("audio");
    tracks.forEach((track) => {
        track.pause();
        track.currentTime = 0;
    });
}

function toggleMute() {
    isMuted = !isMuted;
    setAllAudioMuted(isMuted);
    if (isMuted) {
        stopAllSounds();
    }
    updateMuteButtons();
}

function setAllAudioMuted(muted) {
    const tracks = document.querySelectorAll("audio");
    tracks.forEach((track) => {
        track.muted = muted;
    });
}

function setupMuteButtons() {
    const buttons = document.querySelectorAll(".mute-toggle");
    if (!buttons.length) return;
    buttons.forEach((button) => {
        button.addEventListener("click", toggleMute);
    });
    updateMuteButtons();
}

function updateMuteButtons() {
    const buttons = document.querySelectorAll(".mute-toggle");
    buttons.forEach((button) => {
        button.textContent = isMuted ? "Sound: Aus" : "Sound: An";
    });
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
