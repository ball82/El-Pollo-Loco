let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    hideLanding();
    hideEndScreen();
    init();
}

function hideLanding() {
    const landing = document.getElementById("landing");
    if (landing) landing.classList.add("hidden");
}

function showLanding() {
    const landing = document.getElementById("landing");
    if (landing) landing.classList.remove("hidden");
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
    init();
}

function backToHome() {
    stopCurrentWorld();
    hideEndScreen();
    showLanding();
    gameStarted = false;
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
        world.character.jump();
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
        });
    } else {
        canvas = document.getElementById("canvas");
    }
}

startLandingWhenReady();
