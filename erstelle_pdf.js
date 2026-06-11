const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ size: 'A4', margin: 40 });
doc.pipe(fs.createWriteStream('Stelzlager_Vergleich.pdf'));

const BLAU = '#1a3a5c';
const HELLBLAU = '#dce8f5';
const GRAU = '#f0f0f0';
const HELLGRUEN = '#e8f5ec';
const GRUEN = '#1a7a3c';
const ROT = '#b22222';
const GELB = '#fffbe6';
const DUNKELGRAU = '#333333';
const ORANGE_BG = '#fff3e0';
const WHITE = '#ffffff';

const W = 515;
const LEFT = 40;
const STUECK = 180;
const AUFSCHLAG = 0.10;

const produkte = [
  {
    name: 'HORI Stelzlager',
    shop: 'casando.de',
    hoehe: '32 - 45 mm',
    belastbarkeit: 'ca. 2.000 kg/m²',
    fuge: '3,5 mm (fix)',
    gefaelle: '0-5 % = 0-3°',
    oben: 'ca. 100 mm',
    unten: 'ca. 160 mm',
    preis: 2.89,
    lieferung: '12.06. - 15.06.',
  },
  {
    name: 'ceratrends EasyPro',
    shop: 'ceratrends.com',
    hoehe: '28 - 36 mm',
    belastbarkeit: 'ca. 2.000 kg/m²',
    fuge: '2 mm oder 4 mm',
    gefaelle: '0-5 % = 0-3°',
    oben: 'k. A.',
    unten: 'k. A.',
    preis: 3.29,
    lieferung: '16.06. - 17.06.',
  },
  {
    name: 'Eterno Ivica SE0',
    shop: 'markenfliesen24.de',
    hoehe: '28 - 38 mm',
    belastbarkeit: 'k. A.',
    fuge: '2 mm oder 3 mm',
    gefaelle: '0-5 % = 0-3°',
    oben: '110 mm',
    unten: '205 mm',
    preis: 3.56,
    lieferung: '1 - 3 Tage',
  },
];

function rect(x, y, w, h, color) {
  doc.save().rect(x, y, w, h).fill(color).restore();
}

function txt(text, x, y, w, opts = {}) {
  const { color = DUNKELGRAU, bold = false, size = 9, align = 'left', italic = false } = opts;
  let font = 'Helvetica';
  if (bold) font = 'Helvetica-Bold';
  if (italic) font = 'Helvetica-Oblique';
  doc.save().font(font).fontSize(size).fillColor(color).text(text, x, y, { width: w, align }).restore();
}

// ============================
// TITEL
// ============================
rect(LEFT, 40, W, 48, BLAU);
txt('Stelzlager Vergleich', LEFT, 52, W, { color: WHITE, bold: true, size: 18, align: 'center' });
txt('Selbstnivellierende Stelzlager  |  40 m²  |  Stand: 10.06.2025', LEFT, 76, W, { color: '#aaccee', size: 9, align: 'center' });

let y = 104;

// ============================
// 1. TECHNISCHE DATEN
// ============================
txt('1.  Technische Spezifikationen', LEFT, y, W, { color: BLAU, bold: true, size: 12 });
y += 16;

const cols = [162, 111, 121, 121];
const colX = [LEFT, LEFT + cols[0], LEFT + cols[0] + cols[1], LEFT + cols[0] + cols[1] + cols[2]];
const rowH = 21;

// Header
rect(LEFT, y, W, rowH, BLAU);
['Eigenschaft', 'HORI  (casando.de)', 'EasyPro  (ceratrends)', 'Eterno Ivica SE0'].forEach((h, i) => {
  txt(h, colX[i] + 5, y + 7, cols[i] - 10, { color: WHITE, bold: true, size: 8, align: i === 0 ? 'left' : 'center' });
});
y += rowH;

// Technische Daten (OHNE Selbstnivellierend)
const techRows = [
  ['Hoehenausgleich',       '32 - 45 mm',       '28 - 36 mm',       '28 - 38 mm'],
  ['Gefalleausgleich',      '0-5 % = 0-3°',     '0-5 % = 0-3°',     '0-5 % = 0-3°'],
  ['Fugenbreite',           '3,5 mm (fix)',      '2 mm oder 4 mm',   '2 mm oder 3 mm'],
  ['Belastbarkeit',         'ca. 2.000 kg/m²',  'ca. 2.000 kg/m²',  'k. A.'],
  ['Auflagef. oben (Kopf)', 'ca. 100 mm',        'k. A.',             '110 mm'],
  ['Auflagef. unten (Fuss)','ca. 160 mm',        'k. A.',             '205 mm'],
  ['Lieferzeit',            '12.06.-15.06.',     '16.06.-17.06.',    '1 - 3 Tage'],
  ['Preis / Stueck',        '2,89 EUR',          '3,29 EUR',         '3,56 EUR'],
];

techRows.forEach((row, ri) => {
  const rowBg = ri % 2 === 0 ? WHITE : GRAU;
  rect(LEFT, y, W, rowH, rowBg);
  rect(LEFT, y, cols[0], rowH, HELLBLAU);
  if (ri === 7) { // Preis-Zeile
    rect(LEFT, y, W, rowH, GELB);
    rect(LEFT, y, cols[0], rowH, HELLBLAU);
  }
  row.forEach((val, ci) => {
    txt(val, colX[ci] + 5, y + 7, cols[ci] - 10, {
      bold: ci === 0 || ri === 7,
      size: ri === 7 ? 9.5 : 8.5,
      align: ci === 0 ? 'left' : 'center',
    });
  });
  doc.save().moveTo(LEFT, y + rowH).lineTo(LEFT + W, y + rowH).lineWidth(0.4).strokeColor('#cccccc').stroke().restore();
  y += rowH;
});
doc.save().rect(LEFT, y - rowH * techRows.length - rowH, W, rowH * (techRows.length + 1)).lineWidth(1).strokeColor(BLAU).stroke().restore();
y += 18;

// ============================
// 2. KOSTENBERECHNUNG
// ============================
txt('2.  Kostenberechnung', LEFT, y, W, { color: BLAU, bold: true, size: 12 });
y += 14;
txt(
  `Berechnung: 180 Stueck  x  Einzelpreis  +  10 % Preisaufschlag`,
  LEFT, y, W, { italic: true, size: 9 }
);
y += 14;

const cw2 = [220, 80, 110, 105];
const cx2 = [LEFT, LEFT + 220, LEFT + 300, LEFT + 410];

produkte.forEach(p => {
  const preisAuf = p.preis * (1 + AUFSCHLAG);
  const basisGes = STUECK * p.preis;
  const aufGes   = STUECK * p.preis * AUFSCHLAG;
  const totalGes = STUECK * preisAuf;

  const fmt = n => n.toFixed(2).replace('.', ',') + ' EUR';
  const fmtU = n => n.toFixed(2).replace('.', ',');

  // Produktkopf
  rect(LEFT, y, W, 22, BLAU);
  txt(`${p.name}   |   ${p.shop}`, LEFT + 10, y + 6, W - 20, { color: WHITE, bold: true, size: 10 });
  y += 22;

  // Spalten-Header
  rect(LEFT, y, W, 19, HELLBLAU);
  ['Position', 'Stueck', 'Preis / Stueck', 'Betrag'].forEach((h, i) => {
    txt(h, cx2[i] + 5, y + 5, cw2[i] - 10, { color: BLAU, bold: true, size: 8, align: i === 0 ? 'left' : 'right' });
  });
  y += 19;

  // Zeile 1: Grundpreis
  rect(LEFT, y, W, 21, WHITE);
  txt('180 Stueck x Einzelpreis', cx2[0] + 5, y + 6, cw2[0] - 10, { size: 9 });
  txt('180',               cx2[1] + 5, y + 6, cw2[1] - 10, { size: 9, align: 'right' });
  txt(fmt(p.preis),        cx2[2] + 5, y + 6, cw2[2] - 10, { size: 9, align: 'right' });
  txt(fmt(basisGes),       cx2[3] + 5, y + 6, cw2[3] - 10, { size: 9, align: 'right' });
  doc.save().moveTo(LEFT, y + 21).lineTo(LEFT + W, y + 21).lineWidth(0.4).strokeColor('#cccccc').stroke().restore();
  y += 21;

  // Zeile 2: 10% Aufschlag
  rect(LEFT, y, W, 21, GRAU);
  txt('+ 10 % Preisaufschlag', cx2[0] + 5, y + 6, cw2[0] - 10, { size: 9 });
  txt('',                     cx2[1] + 5, y + 6, cw2[1] - 10, { size: 9, align: 'right' });
  txt(`+ ${fmtU(p.preis * AUFSCHLAG)} EUR`, cx2[2] + 5, y + 6, cw2[2] - 10, { size: 9, align: 'right', color: '#666666' });
  txt(`+ ${fmt(aufGes)}`,    cx2[3] + 5, y + 6, cw2[3] - 10, { size: 9, align: 'right', color: '#666666' });
  doc.save().moveTo(LEFT, y + 21).lineTo(LEFT + W, y + 21).lineWidth(0.4).strokeColor('#cccccc').stroke().restore();
  y += 21;

  // Gesamt-Zeile
  rect(LEFT, y, W, 24, HELLGRUEN);
  doc.save().moveTo(LEFT, y).lineTo(LEFT + W, y).lineWidth(1.5).strokeColor(GRUEN).stroke().restore();
  txt('GESAMT (180 Stueck)', cx2[0] + 5, y + 7, cw2[0] - 10, { bold: true, size: 10 });
  txt('180',                 cx2[1] + 5, y + 7, cw2[1] - 10, { bold: true, size: 10, align: 'right' });
  txt(fmt(preisAuf) + ' *', cx2[2] + 5, y + 7, cw2[2] - 10, { bold: true, size: 9, align: 'right' });
  txt(fmt(totalGes),         cx2[3] + 4, y + 6, cw2[3] - 8, { bold: true, size: 12, color: GRUEN, align: 'right' });
  y += 24;

  doc.save().rect(LEFT, y - 21 * 2 - 24 - 19 - 22, W, 21 * 2 + 24 + 19 + 22).lineWidth(1).strokeColor(BLAU).stroke().restore();
  y += 10;
});

txt('* Preis pro Stueck inkl. 10 % Aufschlag', LEFT, y, W, { italic: true, size: 7.5, color: '#888888' });
y += 16;

// ============================
// 3. ZUSATZPOSTEN: BAUTENSCHUTZMATTE
// ============================
txt('3.  Zusaetzliche Materialien', LEFT, y, W, { color: BLAU, bold: true, size: 12 });
y += 14;

rect(LEFT, y, W, 22, BLAU);
txt('Bautenschutzmatte', LEFT + 10, y + 6, W - 20, { color: WHITE, bold: true, size: 10 });
y += 22;

rect(LEFT, y, W, 19, HELLBLAU);
['Material', 'Menge', 'Preis (Spanne)', 'Betrag'].forEach((h, i) => {
  txt(h, cx2[i] + 5, y + 5, cw2[i] - 10, { color: BLAU, bold: true, size: 8, align: i === 0 ? 'left' : 'right' });
});
y += 19;

rect(LEFT, y, W, 24, WHITE);
txt('Bautenschutzmatte (Untergrund)', cx2[0] + 5, y + 7, cw2[0] - 10, { size: 9 });
txt('ca. 18-20 m', cx2[1] + 5, y + 7, cw2[1] - 10, { size: 9, align: 'right' });
txt('55 - 70 EUR', cx2[2] + 5, y + 7, cw2[2] - 10, { size: 9, align: 'right' });
txt('55,00 - 70,00 EUR', cx2[3] + 5, y + 7, cw2[3] - 10, { size: 9, align: 'right' });
doc.save().moveTo(LEFT, y + 24).lineTo(LEFT + W, y + 24).lineWidth(0.4).strokeColor('#cccccc').stroke().restore();
y += 24;

doc.save().rect(LEFT, y - 24 - 19 - 22, W, 24 + 19 + 22).lineWidth(1).strokeColor(BLAU).stroke().restore();
y += 14;

// ============================
// 4. GESAMTRANGLISTE
// ============================
doc.save().moveTo(LEFT, y).lineTo(LEFT + W, y).lineWidth(1.5).strokeColor(BLAU).stroke().restore();
y += 10;
txt('4.  Gesamtuebersicht & Rangliste  (180 Stueck + 10 % Preisaufschlag)', LEFT, y, W, { color: BLAU, bold: true, size: 12 });
y += 14;

const sortiert = [...produkte].sort((a, b) => a.preis - b.preis);
const rangFarben = [HELLGRUEN, GRAU, '#fde8e8'];
const rangLabel = ['1.  Guenstigster', '2.  Mittelfeld', '3.  Teuerster'];

const scw = [120, 150, 80, 105, 60];
const scx = [LEFT, LEFT + 120, LEFT + 270, LEFT + 350, LEFT + 455];

rect(LEFT, y, W, 22, BLAU);
['Rang', 'Produkt', 'Preis/Stk.', 'Gesamt 180 Stk.', 'Aufschl.'].forEach((h, i) => {
  txt(h, scx[i] + 5, y + 7, scw[i] - 10, { color: WHITE, bold: true, size: 8.5, align: i < 2 ? 'left' : 'right' });
});
y += 22;

sortiert.forEach((p, i) => {
  const totalGes = STUECK * p.preis * (1 + AUFSCHLAG);
  const g = totalGes.toFixed(2).replace('.', ',') + ' EUR';
  const prS = p.preis.toFixed(2).replace('.', ',') + ' EUR';
  rect(LEFT, y, W, 26, rangFarben[i]);
  txt(rangLabel[i],    scx[0] + 5, y + 8, scw[0] - 10, { bold: true, size: 8.5 });
  txt(p.name,          scx[1] + 5, y + 8, scw[1] - 10, { bold: true, size: 9 });
  txt(prS,             scx[2] + 5, y + 8, scw[2] - 10, { size: 9, align: 'right' });
  txt(g,               scx[3] + 5, y + 7, scw[3] - 10, { bold: true, size: 10, color: GRUEN, align: 'right' });
  txt('+ 10 %',        scx[4] + 5, y + 8, scw[4] - 10, { bold: true, size: 8.5, color: ORANGE_BG.startsWith('#fff') ? '#b36b00' : ROT, align: 'right' });
  doc.save().moveTo(LEFT, y + 26).lineTo(LEFT + W, y + 26).lineWidth(0.4).strokeColor('#cccccc').stroke().restore();
  y += 26;
});
doc.save().rect(LEFT, y - 26 * 3 - 22, W, 26 * 3 + 22).lineWidth(1).strokeColor(BLAU).stroke().restore();

// Bautenschutzmatte in Zusammenfassung
y += 8;
rect(LEFT, y, W, 24, '#fff8e1');
doc.save().moveTo(LEFT, y).lineTo(LEFT + W, y).lineWidth(0.8).strokeColor('#f0a500').stroke().restore();
txt('+ Bautenschutzmatte (ca. 18-20 m)', scx[0] + 5, y + 7, 320, { size: 9, bold: true });
txt('55,00 - 70,00 EUR', scx[3] + 5, y + 7, scw[3] - 10, { size: 9, bold: true, color: '#b36b00', align: 'right' });
doc.save().rect(LEFT, y, W, 24).lineWidth(1).strokeColor('#f0a500').stroke().restore();
y += 24;

// Fusszeile
y += 12;
doc.save().moveTo(LEFT, y).lineTo(LEFT + W, y).lineWidth(0.5).strokeColor('#aaaaaa').stroke().restore();
y += 5;
txt(
  'Hinweis: Alle Produkte gleichen Gefaelle bis 5 % automatisch aus. ' +
  'Preisstand: 10.06.2025. Alle Angaben ohne Gewaehr.',
  LEFT, y, W, { italic: true, size: 7.5, color: '#666666' }
);

doc.end();
console.log('PDF erfolgreich erstellt: Stelzlager_Vergleich.pdf');
