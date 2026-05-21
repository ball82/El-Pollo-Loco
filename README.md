# El Pollo Loco

Ein browser-basiertes 2D Jump-and-Run-Spiel, entwickelt mit Vanilla JavaScript und dem HTML5 Canvas.

## Spielprinzip

Steuere Pepe durch eine Wüstenlandschaft, besiege Hühner und sammle Münzen und Flaschen ein – bis du den Endboss erreichst und bezwingst.

## Steuerung

| Taste | Aktion |
|-------|--------|
| `←` / `→` | Laufen |
| `Leertaste` | Springen |
| `D` | Flasche werfen |

Auf mobilen Geräten stehen Touch-Buttons auf dem Bildschirm zur Verfügung.

## Features

- Animierter Spielcharakter mit Lauf-, Sprung-, Treffer- und Idle-Animationen
- Gegner: normale Hühner, kleine Hühner und ein Endboss
- Sammelobjekte: Münzen und Flaschen
- Statusleisten für Gesundheit, Münzen und Flaschen
- Hintergrundmusik und Soundeffekte mit Stummschalter
- Vollbildmodus
- Responsive Layout mit Landscape-Hinweis auf Mobilgeräten
- Game-Over- und Gewinn-Bildschirm

## Projektstruktur

```
pollo loco/
├── index.html
├── style.css
├── styles/
│   └── responsive.css
├── js/
│   ├── audio-manager.js
│   ├── game.js
│   └── game/
│       ├── game-app.class.js
│       ├── game-input.controller.js
│       ├── game-ui.controller.js
│       └── game-viewport.controller.js
├── models/
│   ├── drawable-object.class.js
│   ├── movable-object.class.js
│   ├── character.class.js
│   ├── chicken.class.js
│   ├── small-chicken.class.js
│   ├── endboss.class.js
│   ├── bottle.class.js
│   ├── coin.class.js
│   ├── cloud.class.js
│   ├── status-bar.class.js
│   ├── world.class.js
│   └── ...
├── levels/
│   └── level1.js
└── audio/
```

## Lokaler Start

Da das Spiel Ressourcen per relativem Pfad lädt, wird ein lokaler Webserver benötigt. Mit der VS Code Extension **Live Server** reicht ein Klick auf *Go Live* – oder alternativ:

```bash
npx serve .
```

Danach die angezeigte URL im Browser öffnen.

## Technologien

- HTML5 Canvas
- Vanilla JavaScript (ES6-Klassen)
- CSS3

## Autor

Entwickelt als Frontend-Dev-Übung.
