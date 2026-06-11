from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

produkte = [
    {
        'name': 'HORI Stelzlager',
        'shop': 'casando.de',
        'hoehe': '32 - 45 mm',
        'belastbarkeit': 'ca. 2.000 kg/m2',
        'fuge': '3,5 mm (fix)',
        'gefaelle': '0 - 5 % = 0 - 3 Grad',
        'oben': 'ca. 100 mm',
        'unten': 'ca. 160 mm',
        'preis': 2.89,
        'lieferung': '12.06. - 15.06.',
        'selbstnivellierend': 'NEIN (manuell)',
    },
    {
        'name': 'ceratrends EasyPro',
        'shop': 'ceratrends.com',
        'hoehe': '28 - 36 mm',
        'belastbarkeit': 'ca. 2.000 kg/m2',
        'fuge': '2 mm oder 4 mm',
        'gefaelle': '0 - 5 % = 0 - 3 Grad',
        'oben': 'k. A.',
        'unten': 'k. A.',
        'preis': 3.29,
        'lieferung': '16.06. - 17.06.',
        'selbstnivellierend': 'JA (automatisch)',
    },
    {
        'name': 'Eterno Ivica SE0',
        'shop': 'markenfliesen24.de',
        'hoehe': '28 - 38 mm',
        'belastbarkeit': 'k. A.',
        'fuge': '2 mm oder 3 mm',
        'gefaelle': '0 - 5 % = 0 - 3 Grad',
        'oben': '110 mm',
        'unten': '205 mm',
        'preis': 3.56,
        'lieferung': '1 - 3 Tage',
        'selbstnivellierend': 'JA (automatisch)',
    },
]

stueckzahl = 180
reserve_stueck = 18  # 10%
gesamt_stueck = 198

BLAU = colors.HexColor('#1a3a5c')
HELLBLAU = colors.HexColor('#dce8f5')
GRAU = colors.HexColor('#f5f5f5')
DUNKELGRAU = colors.HexColor('#333333')
GRUEN = colors.HexColor('#1a7a3c')
HELLGRUEN = colors.HexColor('#e8f5ec')
ROT = colors.HexColor('#b22222')

doc = SimpleDocTemplate(
    'Stelzlager_Vergleich.pdf',
    pagesize=A4,
    rightMargin=1.5*cm,
    leftMargin=1.5*cm,
    topMargin=2*cm,
    bottomMargin=2*cm
)

def ps(name, **kwargs):
    return ParagraphStyle(name, **kwargs)

story = []

# --- TITEL ---
story.append(Paragraph('Stelzlager Vergleich', ps('T', fontSize=18, textColor=BLAU, fontName='Helvetica-Bold', alignment=TA_CENTER, spaceAfter=3)))
story.append(Paragraph('Selbstnivellierende Stelzlager  |  40 m2 Terrasse  |  Stand: 10.06.2025', ps('U', fontSize=9, textColor=DUNKELGRAU, alignment=TA_CENTER, spaceAfter=2)))
story.append(HRFlowable(width='100%', thickness=2, color=BLAU, spaceAfter=14))

# --- TECHNISCHE DATEN ---
story.append(Paragraph('1.  Technische Spezifikationen', ps('S', fontSize=12, textColor=BLAU, fontName='Helvetica-Bold', spaceBefore=4, spaceAfter=7)))

header = [
    Paragraph('Eigenschaft', ps('h', fontSize=8.5, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_LEFT)),
    Paragraph('HORI\ncasando.de', ps('h', fontSize=8.5, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_CENTER)),
    Paragraph('EasyPro\nceratrends.com', ps('h', fontSize=8.5, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_CENTER)),
    Paragraph('Eterno Ivica SE0\nmarkenfliesen24.de', ps('h', fontSize=8.5, textColor=colors.white, fontName='Helvetica-Bold', alignment=TA_CENTER)),
]

def row(label, v1, v2, v3):
    s = ps('c', fontSize=8.5, textColor=DUNKELGRAU, alignment=TA_CENTER)
    sl = ps('cl', fontSize=8.5, textColor=DUNKELGRAU, fontName='Helvetica-Bold')
    return [Paragraph(label, sl), Paragraph(v1, s), Paragraph(v2, s), Paragraph(v3, s)]

tech = [
    header,
    row('Hoehenausgleich', '32 - 45 mm', '28 - 36 mm', '28 - 38 mm'),
    row('Selbstnivellierend', 'NEIN (manuell)', 'JA (automatisch)', 'JA (automatisch)'),
    row('Gefalleausgleich', '0 - 5 % = 0 - 3 Grad', '0 - 5 % = 0 - 3 Grad', '0 - 5 % = 0 - 3 Grad'),
    row('Fugenbreite', '3,5 mm (fix)', '2 mm oder 4 mm', '2 mm oder 3 mm'),
    row('Belastbarkeit', 'ca. 2.000 kg/m2', 'ca. 2.000 kg/m2', 'k. A.'),
    row('Auflagef. oben', 'ca. 100 mm', 'k. A.', '110 mm'),
    row('Auflagef. unten (Fuss)', 'ca. 160 mm', 'k. A.', '205 mm'),
    row('Lieferzeit', '12.06. - 15.06.', '16.06. - 17.06.', '1 - 3 Tage'),
    row('Preis / Stuck', '2,89 EUR', '3,29 EUR', '3,56 EUR'),
]

cw = [4.5*cm, 4.3*cm, 4.3*cm, 4.6*cm]
tt = Table(tech, colWidths=cw, repeatRows=1)
ts_tech = [
    ('BACKGROUND', (0,0), (-1,0), BLAU),
    ('BACKGROUND', (0,1), (0,-1), HELLBLAU),
    ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ('BACKGROUND', (1,2), (-1,2), colors.HexColor('#fde8e8')),
    ('TEXTCOLOR', (1,2), (1,2), ROT),
    ('TEXTCOLOR', (2,2), (3,2), GRUEN),
    ('FONTNAME', (1,2), (3,2), 'Helvetica-Bold'),
    ('BACKGROUND', (1,4), (-1,4), GRAU),
    ('BACKGROUND', (1,6), (-1,6), GRAU),
    ('BACKGROUND', (1,8), (-1,8), GRAU),
    ('BACKGROUND', (0,9), (-1,9), colors.HexColor('#fffbe6')),
    ('FONTNAME', (0,9), (-1,9), 'Helvetica-Bold'),
    ('FONTSIZE', (0,9), (-1,9), 9),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cccccc')),
    ('ALIGN', (1,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 7),
    ('RIGHTPADDING', (0,0), (-1,-1), 7),
]
tt.setStyle(TableStyle(ts_tech))
story.append(tt)
story.append(Spacer(1, 16))

# --- KOSTENBERECHNUNG ---
story.append(Paragraph('2.  Kostenberechnung pro Produkt', ps('S2', fontSize=12, textColor=BLAU, fontName='Helvetica-Bold', spaceBefore=4, spaceAfter=4)))
story.append(Paragraph(
    'Grundbedarf: 180 Stuck  |  10 % Reserve: 18 Stuck  |  Gesamt: 198 Stuck',
    ps('Info', fontSize=9, textColor=DUNKELGRAU, fontName='Helvetica-Oblique', spaceAfter=10)
))

for p in produkte:
    k180 = stueckzahl * p['preis']
    kres = reserve_stueck * p['preis']
    kges = gesamt_stueck * p['preis']

    kopf = [
        Paragraph(p['name'] + '   |   ' + p['shop'], ps('kh', fontSize=9.5, textColor=colors.white, fontName='Helvetica-Bold')),
        '', '', ''
    ]
    col_h = [
        Paragraph('Position', ps('ch', fontSize=8, textColor=BLAU, fontName='Helvetica-Bold')),
        Paragraph('Stuck', ps('ch', fontSize=8, textColor=BLAU, fontName='Helvetica-Bold', alignment=TA_CENTER)),
        Paragraph('Preis / Stuck', ps('ch', fontSize=8, textColor=BLAU, fontName='Helvetica-Bold', alignment=TA_CENTER)),
        Paragraph('Betrag', ps('ch', fontSize=8, textColor=BLAU, fontName='Helvetica-Bold', alignment=TA_RIGHT)),
    ]
    r1 = [
        Paragraph('Grundbedarf', ps('r', fontSize=9, textColor=DUNKELGRAU)),
        Paragraph('180', ps('rc', fontSize=9, textColor=DUNKELGRAU, alignment=TA_CENTER)),
        Paragraph('2,89 EUR' if p['preis'] == 2.89 else ('3,29 EUR' if p['preis'] == 3.29 else '3,56 EUR'), ps('rc', fontSize=9, textColor=DUNKELGRAU, alignment=TA_CENTER)),
        Paragraph(f'{k180:.2f} EUR', ps('rr', fontSize=9, textColor=DUNKELGRAU, alignment=TA_RIGHT)),
    ]
    r2 = [
        Paragraph('10 % Reserve (18 Stuck)', ps('r', fontSize=9, textColor=DUNKELGRAU)),
        Paragraph('18', ps('rc', fontSize=9, textColor=DUNKELGRAU, alignment=TA_CENTER)),
        Paragraph('2,89 EUR' if p['preis'] == 2.89 else ('3,29 EUR' if p['preis'] == 3.29 else '3,56 EUR'), ps('rc', fontSize=9, textColor=colors.HexColor('#888888'), alignment=TA_CENTER)),
        Paragraph(f'{kres:.2f} EUR', ps('rr', fontSize=9, textColor=colors.HexColor('#888888'), alignment=TA_RIGHT)),
    ]
    r3 = [
        Paragraph('<b>GESAMT (198 Stuck)</b>', ps('rg', fontSize=10, fontName='Helvetica-Bold', textColor=DUNKELGRAU)),
        Paragraph('<b>198</b>', ps('rgc', fontSize=10, fontName='Helvetica-Bold', textColor=DUNKELGRAU, alignment=TA_CENTER)),
        Paragraph(f'<b>{p["preis"]:.2f} EUR</b>', ps('rgc2', fontSize=10, fontName='Helvetica-Bold', textColor=DUNKELGRAU, alignment=TA_CENTER)),
        Paragraph(f'<b>{kges:.2f} EUR</b>', ps('rgr', fontSize=12, fontName='Helvetica-Bold', textColor=GRUEN, alignment=TA_RIGHT)),
    ]

    calc_data = [kopf, col_h, r1, r2, r3]
    cw2 = [6.5*cm, 2.3*cm, 3.5*cm, 5.4*cm]
    ct = Table(calc_data, colWidths=cw2)
    ct.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), BLAU),
        ('SPAN', (0,0), (-1,0)),
        ('BACKGROUND', (0,1), (-1,1), HELLBLAU),
        ('BACKGROUND', (0,2), (-1,2), colors.white),
        ('BACKGROUND', (0,3), (-1,3), GRAU),
        ('BACKGROUND', (0,4), (-1,4), HELLGRUEN),
        ('LINEABOVE', (0,4), (-1,4), 1.5, GRUEN),
        ('GRID', (0,1), (-1,-1), 0.4, colors.HexColor('#cccccc')),
        ('BOX', (0,0), (-1,-1), 1, BLAU),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(ct)
    story.append(Spacer(1, 10))

# --- ZUSAMMENFASSUNG ---
story.append(HRFlowable(width='100%', thickness=1.5, color=BLAU, spaceBefore=6, spaceAfter=8))
story.append(Paragraph('3.  Gesamtuebersicht & Rangliste (198 Stuck inkl. 10 % Reserve)', ps('S3', fontSize=12, textColor=BLAU, fontName='Helvetica-Bold', spaceBefore=4, spaceAfter=8)))

sortiert = sorted(produkte, key=lambda x: x['preis'])
rang_farben = [HELLGRUEN, GRAU, colors.HexColor('#fde8e8')]
rang_label = ['1. Guenstigster', '2. Mittelfeld', '3. Teuerster']

sum_header = [
    Paragraph('Rang', ps('sh', fontSize=9, fontName='Helvetica-Bold', textColor=colors.white, alignment=TA_CENTER)),
    Paragraph('Produkt', ps('sh', fontSize=9, fontName='Helvetica-Bold', textColor=colors.white)),
    Paragraph('Preis/Stk.', ps('sh', fontSize=9, fontName='Helvetica-Bold', textColor=colors.white, alignment=TA_CENTER)),
    Paragraph('Gesamt 198 Stk.', ps('sh', fontSize=9, fontName='Helvetica-Bold', textColor=colors.white, alignment=TA_RIGHT)),
    Paragraph('Selbstnivellierend', ps('sh', fontSize=9, fontName='Helvetica-Bold', textColor=colors.white, alignment=TA_CENTER)),
]
sum_data = [sum_header]
for i, p in enumerate(sortiert):
    g = gesamt_stueck * p['preis']
    sniv_col = GRUEN if p['selbstnivellierend'].startswith('JA') else ROT
    sum_data.append([
        Paragraph(rang_label[i], ps(f'rl{i}', fontSize=8.5, fontName='Helvetica-Bold', alignment=TA_CENTER)),
        Paragraph(f'<b>{p["name"]}</b>', ps(f'pl{i}', fontSize=9, fontName='Helvetica-Bold')),
        Paragraph(f'{p["preis"]:.2f} EUR', ps(f'pr{i}', fontSize=9, alignment=TA_CENTER)),
        Paragraph(f'<b>{g:.2f} EUR</b>', ps(f'gt{i}', fontSize=10, fontName='Helvetica-Bold', alignment=TA_RIGHT)),
        Paragraph(p['selbstnivellierend'], ps(f'sn{i}', fontSize=8.5, textColor=sniv_col, fontName='Helvetica-Bold', alignment=TA_CENTER)),
    ])

scw = [3.0*cm, 4.8*cm, 2.8*cm, 4.2*cm, 3.8*cm]
st = Table(sum_data, colWidths=scw)
sts = [
    ('BACKGROUND', (0,0), (-1,0), BLAU),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cccccc')),
    ('BOX', (0,0), (-1,-1), 1.5, BLAU),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 7),
    ('RIGHTPADDING', (0,0), (-1,-1), 7),
]
for i in range(3):
    sts.append(('BACKGROUND', (0, i+1), (-1, i+1), rang_farben[i]))
st.setStyle(TableStyle(sts))
story.append(st)

story.append(Spacer(1, 14))
story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#aaaaaa'), spaceAfter=5))
story.append(Paragraph(
    'Hinweis: Alle Produkte decken maximal 5 % Gefaelle aus. '
    'HORI nivelliert NICHT automatisch - manuelles Ausrichten jedes Stelzlagers erforderlich. '
    'Preisstand: 10.06.2025. Alle Angaben ohne Gewahr.',
    ps('foot', fontSize=7.5, textColor=colors.HexColor('#666666'), fontName='Helvetica-Oblique')
))

doc.build(story)
print('PDF erfolgreich erstellt: Stelzlager_Vergleich.pdf')
