# SBB Lost & Found - Echtzeit-Verlustmeldung

**Prototyp zur Verbesserung des SBB-Fundbüro-Prozesses**

---

## Das Problem

- **1.2M+** verlorene Gegenstände pro Jahr im Schweizer ÖV
- **~25%** Wiederfindungsrate (geschätzt)
- **24-48h** Reaktionszeit bis zur Bearbeitung

**Kernproblem:** Die Zeit zwischen Verlust und Meldung ist zu lang. Bis der Passagier das Fundbüro kontaktiert, ist der Zug längst weitergefahren.

---

## Die Lösung

Echtzeit-Kommunikation zwischen Passagier und Zugpersonal:

| Schritt | Aktion | Zeit |
|---------|--------|------|
| 1 | Passagier meldet Verlust in der App | < 1 Min |
| 2 | Personal erhält Push-Nachricht mit Position | < 30 Sek |
| 3 | Personal sucht bei nächster Gelegenheit | Während Fahrt |
| 4 | Passagier erhält Status-Update | < 30 Min |

**Erwartete Wirkung:** Wiederfindungsrate von ~25% auf >70%

---

## Demo

### Live Demo
- **Passagier-App:** [frontend-orangecat.vercel.app](https://frontend-orangecat.vercel.app)
- **Mitarbeiter-App:** [frontend-orangecat.vercel.app/staff](https://frontend-orangecat.vercel.app/staff)
- **Konzept-Übersicht:** [frontend-orangecat.vercel.app/demo](https://frontend-orangecat.vercel.app/demo)

### Demo-Ablauf
1. Öffnen Sie beide Ansichten nebeneinander
2. **Passagier-App:** Klicken Sie "Lost & Found" bei einer Reise
3. Wählen Sie Kategorie und beschreiben Sie den Gegenstand
4. **Mitarbeiter-App:** Beobachten Sie die eingehende Meldung in Echtzeit
5. Personal kann "Gefunden" oder "Nicht gefunden" melden

---

## Lokale Entwicklung

```bash
# Frontend starten
cd frontend
npm install
npm run dev
# Öffnen: http://localhost:3000
```

### Verfügbare Seiten
| Pfad | Beschreibung |
|------|-------------|
| `/` | Passagier-App (SBB Mobile Integration) |
| `/staff` | Mitarbeiter-Interface (Lokführer, Zugbegleiter, Kontrolleure) |
| `/demo` | Konzept-Erklärung und Demo-Links |

---

## Technologie

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Design:** SBB Corporate Design (Farben, Typografie)
- **Backend:** Node.js, PostgreSQL, Redis (Optional)
- **Real-time:** WebSocket für Live-Updates

---

## Projekt-Struktur

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Passagier-App
│   ├── staff/page.tsx     # Mitarbeiter-Interface
│   └── demo/page.tsx      # Konzept-Erklärung
├── components/
│   ├── passenger/         # Passagier-Komponenten
│   ├── staff/             # Mitarbeiter-Komponenten
│   └── ui/                # Shared UI
└── lib/
    ├── types.ts           # TypeScript Typen
    ├── labels.ts          # Deutsche UI-Texte
    └── mock-data.ts       # Demo-Daten
```

---

## Kontakt

Bei Fragen zum Prototyp oder Konzept bitte Kontakt aufnehmen.

---

*Entwickelt als Vorschlag zur Verbesserung des SBB-Kundenerlebnisses*
