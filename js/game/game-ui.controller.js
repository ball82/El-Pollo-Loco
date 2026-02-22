/**
 * Handles UI state transitions for overlays, modal and fullscreen.
 */
class GameUiController {
    /**
     * Hides the landing overlay.
     * @returns {void} - No return value.
     */
    hideLanding() {
        this.toggleClassById('landing', 'hidden', true);
    }

    /**
     * Shows the landing overlay.
     * @returns {void} - No return value.
     */
    showLanding() {
        this.toggleClassById('landing', 'hidden', false);
    }

    /**
     * Shows end screen with win/loss-specific text.
     *
     * @param {boolean} isWin - Whether the game ended in a win.
     * @returns {void} - No return value.
     */
    showEndScreen(isWin) {
        const endscreen = document.getElementById('endscreen');
        const title = document.getElementById('end-title');
        const text = document.getElementById('end-text');
        if (!endscreen || !title || !text) return;
        const content = this.getEndScreenContent(isWin);
        title.textContent = content.title;
        text.textContent = content.text;
        endscreen.classList.remove('hidden');
    }

    /**
     * Returns localized title/text for the end screen.
     *
     * @param {boolean} isWin - Whether the game ended in a win.
     * @returns {{title: string, text: string}} - End screen content object.
     */
    getEndScreenContent(isWin) {
        if (isWin) return {
            title: 'Gewonnen!',
            text: 'Stark! Du hast den Endboss besiegt.'
        };
        return { title: 'Game Over', text: 'Du hast verloren. Versuch es nochmal!' };
    }

    /**
     * Hides the end screen overlay.
     * @returns {void} - No return value.
     */
    hideEndScreen() {
        this.toggleClassById('endscreen', 'hidden', true);
    }

    /**
     * Opens modal and fills it with template content.
     *
     * @param {string} type - Content type key.
     * @returns {void} - No return value.
     */
    openModal(type) {
        this.setModalContent(type);
        this.toggleModal(true);
    }

    /**
     * Closes the modal overlay.
     * @returns {void} - No return value.
     */
    closeModal() {
        this.toggleModal(false);
    }

    /**
     * Toggles modal visibility.
     *
     * @param {boolean} show - Whether modal should be visible.
     * @returns {void} - No return value.
     */
    toggleModal(show) {
        this.toggleClassById('info-modal', 'hidden', !show);
    }

    /**
     * Sets modal title and HTML content from template registry.
     *
     * @param {string} type - Content type key.
     * @returns {void} - No return value.
     */
    setModalContent(type) {
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');
        if (!title || !content) return;
        const data = ModalTemplates.getByType(type);
        title.textContent = data.title;
        content.innerHTML = data.html;
    }

    /**
     * Toggles browser fullscreen mode.
     * @returns {void} - No return value.
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            return;
        }
        document.exitFullscreen();
    }

    /**
     * Toggles a CSS class for the given element id.
     *
     * @param {string} id - Target element id.
     * @param {string} className - CSS class to toggle.
     * @param {boolean} enabled - Whether class should be present.
     * @returns {void} - No return value.
     */
    toggleClassById(id, className, enabled) {
        const element = document.getElementById(id);
        if (!element) return;
        element.classList.toggle(className, enabled);
    }
}
