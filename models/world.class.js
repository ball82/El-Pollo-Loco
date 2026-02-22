class World extends WorldCollectables {
    
    /**
     * Checks game end.
     * @returns {void} - No return value.
     */
    checkGameEnd() {
        if (this.isGameOver) return;
        if (this.handleLossCondition()) return;
        this.handleWinCondition();
    }

    /**
     * Handles loss condition.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    handleLossCondition() {
        if (!this.character.isDead()) return false;
        this.endGame(false);
        return true;
    }

    /**
     * Handles win condition.
     * @returns {void} - No return value.
     */
    handleWinCondition() {
        if (!this.isEndbossDefeated()) return;
        const endboss = this.getEndboss();
        if (this.isEndbossDeathAnimationRunning(endboss)) return;
        this.removeEndboss(endboss);
        this.endGame(true);
    }

    /**
     * Returns endboss.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    getEndboss() {
        return this.enemies.find((enemy) => enemy instanceof Endboss);
    }

    /**
     * Checks whether endboss death animation running is true.
     *
     * @param {Endboss} endboss - Endboss instance.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isEndbossDeathAnimationRunning(endboss) {
        const deadStartedAt = endboss?.deadStartedAt || 0;
        const deadDuration = endboss?.getDeadAnimationDuration?.() || 0;
        return deadStartedAt && Date.now() - deadStartedAt < deadDuration;
    }

    /**
     * Removes endboss.
     *
     * @param {Endboss} endboss - Endboss instance.
     * @returns {void} - No return value.
     */
    removeEndboss(endboss) {
        if (!endboss) return;
        const index = this.enemies.indexOf(endboss);
        if (index !== -1) this.enemies.splice(index, 1);
    }

    /**
     * Checks whether endboss defeated is true.
     * @returns {boolean} - True if the condition is met; otherwise false.
     */
    isEndbossDefeated() {
        const endboss = this.enemies.find((enemy) => enemy instanceof Endboss);
        return !endboss || endboss.isDead;
    }

    /**
     * Handles end game.
     *
     * @param {boolean} isWin - Whether the game ended with a win.
     * @returns {void} - No return value.
     */
    endGame(isWin) {
        this.isGameOver = true;
        this.stop();
        this.stopGameAudio();
        this.playEndSound(isWin);
        if (typeof showEndScreen === 'function') showEndScreen(isWin);
    }

    /**
     * Stops game audio.
     * @returns {void} - No return value.
     */
    stopGameAudio() {
        AudioManager.stopAllSounds();
    }

    /**
     * Plays end sound.
     *
     * @param {boolean} isWin - Whether the game ended with a win.
     * @returns {void} - No return value.
     */
    playEndSound(isWin) {
        AudioManager.playSfx(isWin ? 'win' : 'game-over', 0.45);
    }

    /**
     * Stops the process.
     * @returns {void} - No return value.
     */
    stop() {
        this.isStopped = true;
        this.stopMainInterval();
        this.stopAnimationFrame();
        this.stopThrowableObjects();
    }

    /**
     * Stops main interval.
     * @returns {void} - No return value.
     */
    stopMainInterval() {
        if (!this.mainInterval) return;
        clearInterval(this.mainInterval);
        this.mainInterval = null;
    }

    /**
     * Stops animation frame.
     * @returns {void} - No return value.
     */
    stopAnimationFrame() {
        if (!this.animationFrameId) return;
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }

    /**
     * Stops throwable objects.
     * @returns {void} - No return value.
     */
    stopThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            if (typeof bottle.stop === 'function') bottle.stop();
        });
        this.bottles.forEach((bottle) => {
            if (typeof bottle.stop === 'function') bottle.stop();
        });
    }
}
