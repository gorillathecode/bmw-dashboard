# Template Planner — Mock-up zu Aufgabe D

Entscheidungsunterstützungs-Tool für die Sortimentsplanung bei BMW Motorrad.
Supply Chain Analytics, SoSe 2026, TU Berlin — Gruppe 201.

## Starten

Kein Build, kein Server, kein npm.

**Variante 1 — einfach:** `index.html` doppelklicken. Öffnet im Browser.

**Variante 2 — in VS Code:**
1. Ordner in VS Code öffnen (`File → Open Folder`)
2. Extension **Live Server** installieren (Ritwick Dey)
3. Rechtsklick auf `index.html` → *Open with Live Server*

Änderungen an CSS/JS werden dann sofort im Browser übernommen.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Struktur, vier Ansichten |
| `styles.css` | Gestaltung |
| `app.js` | Interaktion: Regler, Kurve, Modellauswahl |
| `data.js` | **Kennzahlen aus der Analyse** — keine Platzhalter |

## Die vier Ansichten

**01 Portfolio** — Der Regler ist der Kern des Tools. Er bildet den
Zielkonflikt ab: mehr Templates = mehr Nachfrageabdeckung, aber auch mehr
Komplexität. Die Empfehlung unter der Kurve ändert sich mit der Reglerstellung
und erklärt, was die Zahl bedeutet.

**02 Modell-Detail** — Zeigt, *warum* ein Template vorgeschlagen wird. Der
Trichter macht die Datenaufbereitung sichtbar (70 Katalogoptionen → 23 echte
Kundenentscheidungen). Jedes Template trägt eine Handlungsempfehlung, nicht nur
eine Zahl.

Nur die **S 1000 R** ist qualitativ ausgewertet. Für die übrigen 47 Modelle
liegt die Cover-Analyse vor (Kopfzahlen), aber keine benannten Options-Blöcke.
Das Mock-up zeigt das ehrlich an, statt Ergebnisse zu erfinden.

**03 Märkte** — Nachfrageverteilung je Markt. Der gestrichelte Bereich unten
ist die Andockstelle für die externen Daten (Topografie, Kaufkraft, Klima).

**04 Planungsprozess** — Wie die Templates in einen wiederkehrenden Zyklus
kommen, und wer mit welcher Ansicht arbeitet.

## Datenherkunft

Alle Zahlen stammen aus `SCA_SS26_Gruppe201_CaseStudy_Templates.Rmd`:

- 44.658 Fahrzeuge, 48 Modelle (Modelle mit < 30 Fahrzeugen ausgeschlossen)
- Abdeckungskurve: Greedy-Set-Cover je Modell, Toleranz ± 4 Optionen
- S 1000 R: Apriori (Support ≥ 0,15 / Confidence ≥ 0,75 / Lift > 1,3)

Wenn sich die Analyse ändert, muss `data.js` neu erzeugt werden.

## Grenzen des Mock-ups

Bewusste Entscheidung laut Aufgabenstellung: *„Es kann, muss aber nicht
technisch voll funktionsfähig sein."*

- Daten sind fest eingebaut, nicht live aus der Datenbank
- Ansicht 02 hat nur für die S 1000 R Template-Inhalte
- Die externen Daten sind vorgesehen, aber noch nicht angebunden
