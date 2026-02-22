class World extends WorldCollectables {
    
    checkGameEnd() {
        if (this.isGameOver) return;
        if (this.handleLossCondition()) return;
        this.handleWinCondition();
    }

    handleLossCondition() {
        if (!this.character.isDead()) return false;
        this.endGame(false);
        return true;
    }

    handleWinCondition() {
        if (!this.isEndbossDefeated()) return;
        const endboss = this.getEndboss();
        if (this.isEndbossDeathAnimationRunning(endboss)) return;
        this.removeEndboss(endboss);
        this.endGame(true);
    }

    getEndboss() {
        return this.enemies.find((enemy) => enemy instanceof Endboss);
    }

    isEndbossDeathAnimationRunning(endboss) {
        const deadStartedAt = endboss?.deadStartedAt || 0;
        const deadDuration = endboss?.getDeadAnimationDuration?.() || 0;
        return deadStartedAt && Date.now() - deadStartedAt < deadDuration;
    }

    removeEndboss(endboss) {
        if (!endboss) return;
        const index = this.enemies.indexOf(endboss);
        if (index !== -1) this.enemies.splice(index, 1);
    }

    isEndbossDefeated() {
        const endboss = this.enemies.find((enemy) => enemy instanceof Endboss);
        return !endboss || endboss.isDead;
    }

    endGame(isWin) {
        this.isGameOver = true;
        this.stop();
        this.stopGameAudio();
        this.playEndSound(isWin);
        if (typeof showEndScreen === 'function') showEndScreen(isWin);
    }

    stopGameAudio() {
        if (typeof stopAllSounds === 'function') stopAllSounds();
    }

    playEndSound(isWin) {
        if (typeof playSfx !== 'function') return;
        playSfx(isWin ? 'win' : 'game-over', 0.45);
    }

    stop() {
        this.isStopped = true;
        this.stopMainInterval();
        this.stopAnimationFrame();
        this.stopThrowableObjects();
    }

    stopMainInterval() {
        if (!this.mainInterval) return;
        clearInterval(this.mainInterval);
        this.mainInterval = null;
    }

    stopAnimationFrame() {
        if (!this.animationFrameId) return;
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }

    stopThrowableObjects() {
        this.throwableObjects.forEach((bottle) => {
            if (typeof bottle.stop === 'function') bottle.stop();
        });
        this.bottles.forEach((bottle) => {
            if (typeof bottle.stop === 'function') bottle.stop();
        });
    }
}
