# Template Planner — Mock-up zu Aufgabe D

Entscheidungsunterstützungs-Tool für die Sortimentsplanung bei BMW Motorrad.
Supply Chain Analytics, SoSe 2026, TU Berlin — Gruppe 201.

## Starten

Kein Build, kein npm.

```bash
cd bmw-dashboard
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen. Beenden mit `Strg + C`.

Alternativ: Ordner in VS Code öffnen, Extension **Live Server** installieren,
Rechtsklick auf `index.html` → *Open with Live Server*.

## Hosting

Für die Präsentation genügt der lokale Server oben — er ist im Hörsaal
robuster als eine Internetverbindung.

Im gleichen Netzwerk für die Gruppe freigeben:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
hostname -I    # zeigt die IP, andere rufen http://<IP>:8000 auf
```

**Kein öffentliches Hosting.** Netlify, Vercel und GitHub Pages erzeugen
öffentlich erreichbare URLs. Das widerspricht der NDA-Vorgabe der
Aufgabenstellung („Teilen Sie keine Inhalte der Fallstudie online").
Das Repository bleibt privat.

## KI-Nutzung

Bei der Entwicklung dieses Dashboards wurden generative KI-Werkzeuge
eingesetzt (Code, Struktur, Formulierungen). Die Kennzeichnung erfolgt gemäß
dem Leitfaden des Fachgebiets Logistik im APA-Stil in der Abgabe.

Veröffentlicht sind ausschließlich aggregierte Kennzahlen. Der Rohdatensatz
ist nicht Teil dieses Repositories und darf es nicht werden.

## Aufbau

| Datei | Inhalt |
|---|---|
| `index.html` | Struktur, fünf Ansichten |
| `styles.css` | Gestaltung |
| `app.js` | Interaktion: Regler, Kurve, Modellauswahl |
| `data.js` | Abdeckungskurve, Templatebedarf je Modell, Märkte |
| `grunddaten.js` | Kennzahlen des Rohdatensatzes, Datenqualität |
| `externals.js` | Korrelationen Modell/Option × Ländermerkmale |
| `leo.js` | Paketebene: Kombinationen bestehender BMW-Pakete |

Alle Zahlen stammen aus der Analyse — keine Platzhalter.

## Die fünf Ansichten

**00 Grunddaten** — Der Rohdatensatz in Kennzahlen: 987.970 Zeilen, 44.992
Fahrzeuge, 52 Modelle, 18 Märkte. Dazu die drei Datenqualitätsbefunde
(2.111 Duplikate, 18,7 % Verwaltungscodes, 59 % fehlende Processing Types)
und der Kernbefund: 77 % der Fahrzeuge teilen ihre Konfiguration.

**01 Portfolio** — Der Regler ist der Kern des Tools. Er bildet den
Zielkonflikt ab: mehr Templates = mehr Nachfrageabdeckung, aber mehr
Komplexität. Die Empfehlung unter der Kurve ändert sich mit der
Reglerstellung und interpretiert die Zahl.

**02 Modell-Detail** — Zeigt, *warum* ein Template vorgeschlagen wird.
Drei Bausteine:

- *Zwei Ebenen der Variantenvielfalt* — Paketebene gegen
  Konfigurationsebene, für R 1300 GS und S 1000 RR. Bei der GS klaffen die
  Ebenen um Faktor 6,5 auseinander, bei der RR sind sie deckungsgleich.
- *Ländermerkmale* — Korrelationen des Marktanteils, für 31 der 52 Modelle.
- *Trichter und Template-Karten* — 70 Katalogoptionen → 23 echte
  Kundenentscheidungen, je Template eine Handlungsempfehlung.

**03 Märkte** — Nachfrageverteilung je Markt mit den Top-5-Modellen, plus
die Plausibilitätsprüfung der externen Daten (Sitzheizung × Temperatur
= −0,80).

**04 Planungsprozess** — Wie die Templates in einen wiederkehrenden Zyklus
kommen (quartalsweise / halbjährlich / alle 3 Jahre), und wer mit welcher
Ansicht arbeitet.

## Datenherkunft und Methodik

Aus `SCA_SS26_Gruppe201_CaseStudy_Templates.Rmd`:

- 44.658 Fahrzeuge, 48 Modelle (Modelle mit < 30 Fahrzeugen ausgeschlossen)
- Abdeckungskurve: Greedy-Set-Cover je Modell, Toleranz ± 4 Optionen
- S 1000 R: Apriori (Support ≥ 0,15 / Confidence ≥ 0,75 / Lift > 1,3)

Paketebene aus `TemplatesR1300GS.Rmd` / `TemplatesS1000RR.Rmd`.

Externe Faktoren: 13 Ländermerkmale je Markt, verknüpft über die Market ID.
**Gefiltert:** nur Modelle in ≥ 10 Märkten und Optionen mit ≥ 3 % Support,
ohne Verwaltungscodes. Ohne diesen Filter entstehen Artefakte — ein Modell,
das nur in Deutschland verkauft wird, korreliert zwangsläufig mit
„Bevölkerung".

Wenn sich die Analyse ändert, müssen die `*.js`-Datendateien neu erzeugt
werden.

## Grenzen des Mock-ups

Bewusste Entscheidung laut Aufgabenstellung: *„Es kann, muss aber nicht
technisch voll funktionsfähig sein."*

- Daten sind fest eingebaut, nicht live aus einer Datenbank
- Template-Inhalte liegen nur für die S 1000 R vor. Bei den übrigen Modellen
  zeigt das Tool die Kennzahlen und weist offen darauf hin, dass die Blöcke
  noch nicht benannt sind — statt Ergebnisse zu erfinden.
- Paketebene nur für R 1300 GS und S 1000 RR
- Ländermerkmale nur für 31 der 52 Modelle (siehe Filterregel oben)

## Vertraulichkeit

Der Rohdatensatz ist **nicht** Teil dieses Projekts und darf es nicht
werden (NDA). Enthalten sind ausschließlich aggregierte Kennzahlen.
Das Repository muss privat bleiben.