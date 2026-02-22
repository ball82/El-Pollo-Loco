class AudioManager {
    static musicListenerAttached = false;
    static isMuted = false;
    static MUTE_STORAGE_KEY = 'el_pollo_loco_muted';

    static init() {
        this.isMuted = this.loadMutePreference();
        this.setAllAudioMuted(this.isMuted);
        this.setupMuteButtons();
    }

    static startBackgroundMusic() {
        this.playConfiguredTrack('bg-music', 0.02, () => this.startBackgroundMusic());
    }

    static startGameMusic() {
        this.playConfiguredTrack('game-music', 0.1, () => this.startGameMusic());
    }

    static playConfiguredTrack(id, volume, retryFn) {
        const audio = this.getAudio(id);
        if (!audio) return;
        audio.volume = volume;
        audio.muted = this.isMuted;
        this.playTrack(audio, retryFn);
    }

    static getAudio(id) {
        return document.getElementById(id);
    }

    static playTrack(audio, retryFn) {
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => this.runOnFirstInteraction(retryFn));
        }
    }

    static playSfx(id, volume = 0.3) {
        if (this.isMuted) return;
        const audio = this.getAudio(id);
        if (!audio) return;
        audio.volume = volume;
        audio.currentTime = 0;
        this.playTrack(audio, () => this.playSfx(id, volume));
    }

    static pauseOtherTracks(activeId) {
        ['bg-music', 'game-music'].forEach((trackId) => {
            if (trackId === activeId) return;
            this.resetTrack(trackId);
        });
    }

    static setBackgroundMusicLevel(volume) {
        const bgMusic = this.getAudio('bg-music');
        if (!bgMusic) return;
        bgMusic.volume = volume;
    }

    static stopAllSounds() {
        document.querySelectorAll('audio').forEach((track) => {
            track.pause();
            track.currentTime = 0;
        });
    }

    static toggleMute() {
        this.isMuted = !this.isMuted;
        this.setAllAudioMuted(this.isMuted);
        if (this.isMuted) this.stopAllSounds();
        this.saveMutePreference();
        this.updateMuteButtons();
    }

    static setAllAudioMuted(muted) {
        document.querySelectorAll('audio').forEach((track) => {
            track.muted = muted;
        });
    }

    static setupMuteButtons() {
        const buttons = document.querySelectorAll('.mute-toggle');
        if (!buttons.length) return;
        buttons.forEach((button) => button.addEventListener('click', () => this.toggleMute()));
        this.updateMuteButtons();
    }

    static updateMuteButtons() {
        document.querySelectorAll('.mute-toggle').forEach((button) => {
            button.textContent = this.isMuted ? 'Sound: Aus' : 'Sound: An';
        });
    }

    static loadMutePreference() {
        try {
            return localStorage.getItem(this.MUTE_STORAGE_KEY) === 'true';
        } catch (error) {
            return false;
        }
    }

    static saveMutePreference() {
        try {
            localStorage.setItem(this.MUTE_STORAGE_KEY, String(this.isMuted));
        } catch (error) {
            // ignore storage errors (private mode / blocked storage)
        }
    }

    static runOnFirstInteraction(fn) {
        if (this.musicListenerAttached) return;
        const handler = () => this.handleFirstInteraction(fn, handler);
        this.addMusicStartListeners(handler);
        this.musicListenerAttached = true;
    }

    static handleFirstInteraction(fn, handler) {
        fn();
        this.removeMusicStartListeners(handler);
        this.musicListenerAttached = false;
    }

    static addMusicStartListeners(handler) {
        document.addEventListener('click', handler);
        document.addEventListener('keydown', handler);
        document.addEventListener('touchstart', handler);
    }

    static removeMusicStartListeners(handler) {
        document.removeEventListener('click', handler);
        document.removeEventListener('keydown', handler);
        document.removeEventListener('touchstart', handler);
    }

    static resetTrack(trackId) {
        const track = this.getAudio(trackId);
        if (!track) return;
        track.pause();
        track.currentTime = 0;
    }
}
