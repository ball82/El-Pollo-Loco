class ModalTemplates {
    /**
     * Returns how to data.
     * @returns {{title: string, html: string}} - The resulting value.
     */
    static getHowToData() {
        return {
            title: 'So funktioniert das Spiel',
            html: '<ul><li>Bewege Pepe mit den Pfeiltasten.</li><li>Springen mit Leertaste.</li><li>Sammle Münzen und Flaschen.</li><li>Weiche Gegnern aus und erreiche den Endboss.</li></ul>'
        };
    }

    /**
     * Returns controls data.
     * @returns {{title: string, html: string}} - The resulting value.
     */
    static getControlsData() {
        return {
            title: 'Tastenbelegung',
            html: '<ul><li>Pfeil rechts/links: Laufen</li><li>Leertaste: Springen</li><li>D: Flasche werfen</li></ul>'
        };
    }

    /**
     * Returns story data.
     * @returns {{title: string, html: string}} - The resulting value.
     */
    static getStoryData() {
        return {
            title: 'Story',
            html: '<p>Pepe ist auf dem Weg nach Hause und muss sich durch die Wüste kämpfen. Hilf ihm, die fiesen Hühner zu besiegen!</p>'
        };
    }

    /**
     * Returns impressum data.
     * @returns {{title: string, html: string}} - The resulting value.
     */
    static getImpressumData() {
        return {
            title: 'Impressum',
            html: '<p>Hinweis: Diese Seite ist ein Portfolio-Projekt mit Musterangaben.</p><p>Angaben gemaess § 5 TMG (Muster):</p><address>Max Musterdev<br>Musterstrasse 42<br>12345 Musterstadt<br>Deutschland</address><p>E-Mail: <a href="mailto:kontakt@max-musterdev-portfolio.de">kontakt@max-musterdev-portfolio.de</a></p><p>Verantwortlich fuer den Inhalt nach § 18 Abs. 2 MStV: Max Musterdev, Anschrift wie oben.</p>'
        };
    }

    /**
     * Returns by type.
     *
     * @param {string} type - Type key that controls behavior/content.
     * @returns {{title: string, html: string}} - The resulting value.
     */
    static getByType(type) {
        if (type === 'controls') return this.getControlsData();
        if (type === 'story') return this.getStoryData();
        if (type === 'impressum') return this.getImpressumData();
        return this.getHowToData();
    }
}
