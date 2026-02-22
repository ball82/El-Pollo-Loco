const gameApp = new GameApp();
gameApp.startLandingWhenReady();

/**
 * Starts game.
 * @returns {void} - No return value.
 */
function startGame() {
    gameApp.startGame();
}

/**
 * Handles restart game.
 * @returns {void} - No return value.
 */
function restartGame() {
    gameApp.restartGame();
}

/**
 * Handles back to home.
 * @returns {void} - No return value.
 */
function backToHome() {
    gameApp.backToHome();
}

/**
 * Opens modal.
 *
 * @param {string} type - Type key that controls behavior/content.
 * @returns {void} - No return value.
 */
function openModal(type) {
    gameApp.openModal(type);
}

/**
 * Closes modal.
 * @returns {void} - No return value.
 */
function closeModal() {
    gameApp.closeModal();
}

/**
 * Toggles fullscreen.
 * @returns {void} - No return value.
 */
function toggleFullscreen() {
    gameApp.toggleFullscreen();
}

/**
 * Shows end screen.
 *
 * @param {boolean} isWin - Whether the game ended with a win.
 * @returns {void} - No return value.
 */
function showEndScreen(isWin) {
    gameApp.showEndScreen(isWin);
}
