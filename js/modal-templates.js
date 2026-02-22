class ModalTemplates {
    static getHowToData() {
        return {
            title: 'So funktioniert das Spiel',
            html: '<ul><li>Bewege Pepe mit den Pfeiltasten.</li><li>Springen mit Leertaste.</li><li>Sammle Münzen und Flaschen.</li><li>Weiche Gegnern aus und erreiche den Endboss.</li></ul>'
        };
    }

    static getControlsData() {
        return {
            title: 'Tastenbelegung',
            html: '<ul><li>Pfeil rechts/links: Laufen</li><li>Leertaste: Springen</li><li>D: Flasche werfen</li></ul>'
        };
    }

    static getStoryData() {
        return {
            title: 'Story',
            html: '<p>Pepe ist auf dem Weg nach Hause und muss sich durch die Wüste kämpfen. Hilf ihm, die fiesen Hühner zu besiegen!</p>'
        };
    }

    static getByType(type) {
        if (type === 'controls') return this.getControlsData();
        if (type === 'story') return this.getStoryData();
        return this.getHowToData();
    }
}
