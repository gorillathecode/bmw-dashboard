// Paketebene: Kombinationen bestehender BMW-Pakete (Analyse)
// Quelle: TemplatesR1300GS.Rmd / TemplatesS1000RR.Rmd
const PAKET = {
 "R 1300 GS": {
  n: 4581,
  varianten: [
   {name:"GS Trophy", n:2003, pct:43.7},
   {name:"Triple Black", n:1562, pct:34.1},
   {name:"Option 719", n:599, pct:13.1},
   {name:"Base", n:417, pct:9.1}
  ],
  kombis: [
   {name:"GS Trophy + Touring + Comfort + Innovation + Dynamics", n:868, pct:18.9, cum:18.9},
   {name:"Triple Black + Touring + Innovation + Dynamics", n:752, pct:16.4, cum:35.4},
   {name:"Option 719 + Touring + Innovation + Dynamics", n:553, pct:12.1, cum:47.4},
   {name:"Triple Black + Touring + Dynamics", n:465, pct:10.2, cum:57.6},
   {name:"GS Trophy + Touring + Comfort + Dynamics", n:367, pct:8.0, cum:65.6},
   {name:"GS Trophy + Touring + Comfort + Innovation + Enduro Pro + Dynamics", n:267, pct:5.8, cum:71.4},
   {name:"GS Trophy + Enduro Pro + Dynamics", n:244, pct:5.3, cum:76.8},
   {name:"Base + Touring + Comfort + Innovation + Dynamics", n:225, pct:4.9, cum:81.7}
  ],
  kombis_80: 8,
  konfig_80: 52,
  distinkte_konfig: 2029,
  cov_bei_8: 58.6
 },
 "S 1000 RR": {
  n: 2293,
  varianten: [
   {name:"Base", n:1414, pct:61.7},
   {name:"M Package", n:879, pct:38.3}
  ],
  kombis: [
   {name:"Base + Race + Dynamics + Passenger", n:388, pct:16.9, cum:16.9},
   {name:"Base + Dynamics + Passenger", n:353, pct:15.4, cum:32.3},
   {name:"M Package + Dynamics + Passenger", n:326, pct:14.2, cum:46.5},
   {name:"M Package + Race + Dynamics + Passenger", n:293, pct:12.8, cum:59.3},
   {name:"Base + Race + Dynamics", n:223, pct:9.7, cum:69.0},
   {name:"M Package + Race + Dynamics", n:164, pct:7.2, cum:76.2},
   {name:"Base + Sport + Race + Dynamics + Passenger", n:147, pct:6.4, cum:82.6}
  ],
  kombis_80: 7,
  konfig_80: 6,
  distinkte_konfig: 465,
  cov_bei_8: 87.8
 }
};
