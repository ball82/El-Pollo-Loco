class AudioManager {
    static musicListenerAttached = false;
    static isMuted = false;
    static MUTE_STORAGE_KEY = 'el_pollo_loco_muted';

    /**
     * Initializes the component.
     * @returns {void} - No return value.
     */
    static init() {
        this.isMuted = this.loadMutePreference();
        this.setAllAudioMuted(this.isMuted);
        this.setupMuteButtons();
    }

    /**
     * Starts background music.
     * @returns {void} - No return value.
     */
    static startBackgroundMusic() {
        this.playConfiguredTrack('bg-music', 0.02, () => this.startBackgroundMusic());
    }

    /**
     * Starts game music.
     * @returns {void} - No return value.
     */
    static startGameMusic() {
        this.playConfiguredTrack('game-music', 0.1, () => this.startGameMusic());
    }

    /**
     * Plays configured track.
     *
     * @param {string} id - Identifier of the target element/resource.
     * @param {number} volume - Audio volume in range 0..1.
     * @param {Function} retryFn - Retry callback used after user interaction.
     * @returns {void} - No return value.
     */
    static playConfiguredTrack(id, volume, retryFn) {
        const audio = this.getAudio(id);
        if (!audio) return;
        audio.volume = volume;
        audio.muted = this.isMuted;
        this.playTrack(audio, retryFn);
    }

    /**
     * Returns audio.
     *
     * @param {string} id - Identifier of the target element/resource.
     * @returns {HTMLAudioElement | null} - Matching audio element or null when not found.
     */
    static getAudio(id) {
        return document.getElementById(id);
    }

    /**
     * Plays track.
     *
     * @param {HTMLAudioElement} audio - Audio element to control.
     * @param {Function} retryFn - Retry callback used after user interaction.
     * @returns {void} - No return value.
     */
    static playTrack(audio, retryFn) {
        if (this.isMuted) return;
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => this.runOnFirstInteraction(retryFn));
        }
    }

    /**
     * Plays sfx.
     *
     * @param {string} id - Identifier of the target element/resource.
     * @param {number} volume - Audio volume in range 0..1.
     * @returns {void} - No return value.
     */
    static playSfx(id, volume = 0.3) {
        if (this.isMuted) return;
        const audio = this.getAudio(id);
        if (!audio) return;
        audio.muted = false;
        audio.volume = volume;
        audio.currentTime = 0;
        this.playTrack(audio, () => this.playSfx(id, volume));
    }

    /**
     * Handles pause other tracks.
     *
     * @param {string} activeId - Audio track id that should remain active.
     * @returns {void} - No return value.
     */
    static pauseOtherTracks(activeId) {
        ['bg-music', 'game-music'].forEach((trackId) => {
            if (trackId === activeId) return;
            this.resetTrack(trackId);
        });
    }

    /**
     * Sets background music level.
     *
     * @param {number} volume - Audio volume in range 0..1.
     * @returns {void} - No return value.
     */
    static setBackgroundMusicLevel(volume) {
        const bgMusic = this.getAudio('bg-music');
        if (!bgMusic) return;
        bgMusic.volume = volume;
    }

    /**
     * Stops all sounds.
     * @returns {void} - No return value.
     */
    static stopAllSounds() {
        document.querySelectorAll('audio').forEach((track) => {
            track.pause();
            track.currentTime = 0;
        });
    }

    /**
     * Toggles mute.
     * @returns {void} - No return value.
     */
    static toggleMute() {
        this.isMuted = !this.isMuted;
        this.setAllAudioMuted(this.isMuted);
        if (this.isMuted) this.stopAllSounds();
        this.saveMutePreference();
        this.updateMuteButtons();
    }

    /**
     * Sets all audio muted.
     *
     * @param {boolean} muted - Whether audio should be muted.
     * @returns {void} - No return value.
     */
    static setAllAudioMuted(muted) {
        document.querySelectorAll('audio').forEach((track) => {
            track.muted = muted;
        });
    }

    /**
     * Sets up mute buttons.
     * @returns {void} - No return value.
     */
    static setupMuteButtons() {
        const buttons = document.querySelectorAll('.mute-toggle');
        if (!buttons.length) return;
        buttons.forEach((button) => button.addEventListener('click', () => this.toggleMute()));
        this.updateMuteButtons();
    }

    /**
     * Updates mute buttons.
     * @returns {void} - No return value.
     */
    static updateMuteButtons() {
        document.querySelectorAll('.mute-toggle').forEach((button) => {
            button.textContent = this.isMuted ? 'Sound: Aus' : 'Sound: An';
        });
    }

    /**
     * Loads mute preference.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    static loadMutePreference() {
        try {
            return localStorage.getItem(this.MUTE_STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    /**
     * Handles save mute preference.
     * @returns {void} - No return value.
     */
    static saveMutePreference() {
        try {
            localStorage.setItem(this.MUTE_STORAGE_KEY, String(this.isMuted));
        } catch (error) {
            // ignore storage errors (private mode / blocked storage)
        }
    }

    /**
     * Runs on first interaction.
     *
     * @param {Function} fn - Callback function to execute.
     * @returns {void} - No return value.
     */
    static runOnFirstInteraction(fn) {
        if (this.musicListenerAttached) return;
        const handler = () => this.handleFirstInteraction(fn, handler);
        this.addMusicStartListeners(handler);
        this.musicListenerAttached = true;
    }

    /**
     * Handles first interaction.
     *
     * @param {Function} fn - Callback function to execute.
     * @param {Function} handler - Event handler callback.
     * @returns {void} - No return value.
     */
    static handleFirstInteraction(fn, handler) {
        fn();
        this.removeMusicStartListeners(handler);
        this.musicListenerAttached = false;
    }

    /**
     * Adds music start listeners.
     *
     * @param {Function} handler - Event handler callback.
     * @returns {void} - No return value.
     */
    static addMusicStartListeners(handler) {
        document.addEventListener('click', handler);
        document.addEventListener('keydown', handler);
        document.addEventListener('touchstart', handler);
    }

    /**
     * Removes music start listeners.
     *
     * @param {Function} handler - Event handler callback.
     * @returns {void} - No return value.
     */
    static removeMusicStartListeners(handler) {
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
        document.removeEventListener('touchstart', handler);
    }

    /**
     * Resets track.
     *
     * @param {string} trackId - Audio track element id.
     * @returns {void} - No return value.
     */
    static resetTrack(trackId) {
        const track = this.getAudio(trackId);
        if (!track) return;
        track.pause();
        track.currentTime = 0;
    }
}
