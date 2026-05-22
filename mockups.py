from fpdf import FPDF
from fpdf.enums import RenderStyle

FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

BG      = (245, 245, 250)
PH_BG   = (255, 255, 255)
HEADER  = (60,  60, 100)
ACCENT  = (108, 92, 231)
ACCENT2 = (220, 80, 140)
CARD    = (237, 237, 247)
TEXT    = (30,  30,  50)
MUTED   = (140, 140, 160)
WHITE   = (255, 255, 255)
GREEN   = (0,  184, 148)
ORANGE  = (220, 170, 60)
RED     = (220, 80,  80)

PW, PH_SIZE = 90, 175
R = 8
NOTCH_W, NOTCH_H = 24, 5


class PDF(FPDF):

    def rounded_rect(self, x, y, w, h, r, style="F"):
        m = {"F": RenderStyle.F, "D": RenderStyle.D, "FD": RenderStyle.DF, "DF": RenderStyle.DF}
        self._draw_rounded_rect(x, y, w, h, m.get(style, RenderStyle.F), True, r)

    def setup_fonts(self):
        self.add_font("DV", "",  FONT_R)
        self.add_font("DV", "B", FONT_B)

    def f(self, size, bold=False):
        self.set_font("DV", "B" if bold else "", size)

    # ── primitives ────────────────────────────────────────────────────────────

    def phone(self, x, y):
        self.set_fill_color(*PH_BG)
        self.set_draw_color(180, 180, 200)
        self.set_line_width(0.5)
        self.rounded_rect(x, y, PW, PH_SIZE, R, "FD")
        self.set_fill_color(50, 50, 60)
        self.rounded_rect(x + (PW - NOTCH_W) / 2, y, NOTCH_W, NOTCH_H, 2, "F")

    def statusbar(self, x, y):
        self.set_fill_color(*HEADER)
        self.rect(x, y + NOTCH_H, PW, 6, "F")
        self.f(4)
        self.set_text_color(*WHITE)
        self.set_xy(x + 2, y + NOTCH_H + 1)
        self.cell(PW - 4, 4, "9:41           Heritage           .....", align="C")

    def titlebar(self, x, y, title, back=False):
        ty = y + NOTCH_H + 6
        self.set_fill_color(*ACCENT)
        self.rect(x, ty, PW, 10, "F")
        self.f(7, bold=True)
        self.set_text_color(*WHITE)
        if back:
            self.set_xy(x + 2, ty + 2)
            self.cell(8, 6, "<")
        self.set_xy(x + 2, ty + 2)
        self.cell(PW - 4, 6, title, align="C")

    def navbar(self, x, y, tabs):
        by = y + PH_SIZE - 14
        self.set_fill_color(*HEADER)
        self.rect(x, by, PW, 14, "F")
        w = PW / len(tabs)
        for i, (ic, lb) in enumerate(tabs):
            cx = x + i * w
            self.f(5, bold=True)
            self.set_text_color(*WHITE)
            self.set_xy(cx, by + 1)
            self.cell(w, 5, ic, align="C")
            self.f(3.5)
            self.set_xy(cx, by + 6)
            self.cell(w, 4, lb, align="C")

    def inp(self, x, y, ph, w=None):
        w = w or PW - 10
        self.set_fill_color(*CARD)
        self.rounded_rect(x, y, w, 8, 2, "F")
        self.f(4.5)
        self.set_text_color(*MUTED)
        self.set_xy(x + 2, y + 1.5)
        self.cell(w - 4, 5, ph)

    def btn(self, x, y, label, color=None, w=None, tc=None):
        color = color or ACCENT
        tc = tc or WHITE
        w = w or PW - 10
        self.set_fill_color(*color)
        self.rounded_rect(x, y, w, 9, 2, "F")
        self.f(5.5, bold=True)
        self.set_text_color(*tc)
        self.set_xy(x, y + 1.5)
        self.cell(w, 6, label, align="C")

    def card(self, x, y, w, h, color=None):
        self.set_fill_color(*(color or CARD))
        self.rounded_rect(x, y, w, h, 2, "F")

    def cover(self, x, y, w, h, color):
        self.set_fill_color(*color)
        self.rounded_rect(x, y, w, h, 2, "F")

    def txt(self, x, y, text, size=5, bold=False, color=None, align="L", w=None):
        self.f(size, bold)
        self.set_text_color(*(color or TEXT))
        self.set_xy(x, y)
        self.cell(w or 80, size + 1, text, align=align)

    def chip(self, x, y, text, active=False, w=20):
        self.set_fill_color(*(ACCENT if active else CARD))
        self.rounded_rect(x, y, w, 6, 2, "F")
        self.f(4)
        self.set_text_color(*(WHITE if active else MUTED))
        self.set_xy(x, y + 1)
        self.cell(w, 4, text, align="C")

    def dots(self, x, y, total, active):
        for i in range(total):
            self.set_fill_color(*(ACCENT if i == active else CARD))
            self.ellipse(x + i * 7, y, 4, 4, "F")

    def badge(self, x, y, text, color):
        self.set_fill_color(*color)
        self.rounded_rect(x, y, 14, 5, 1, "F")
        self.f(3.5)
        self.set_text_color(*WHITE)
        self.set_xy(x, y + 0.8)
        self.cell(14, 3.5, text, align="C")

    def page_bg(self, title, subtitle):
        self.set_fill_color(*BG)
        self.rect(0, 0, 297, 210, "F")
        self.f(16, bold=True)
        self.set_text_color(*ACCENT)
        self.set_xy(10, 8)
        self.cell(0, 8, title)
        self.f(8)
        self.set_text_color(*MUTED)
        self.set_xy(10, 17)
        self.cell(0, 5, subtitle)

    def cap(self, px, num, text):
        self.f(6, bold=True)
        self.set_text_color(*MUTED)
        self.set_xy(px, 198)
        self.cell(PW, 5, f"[{num}]  {text}", align="C")

    # ─────────────────────────────────────────────────────────────────────────
    # ECRANS
    # ─────────────────────────────────────────────────────────────────────────

    # 1. SPLASH
    def splash(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*ACCENT)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.set_fill_color(*WHITE)
        self.ellipse(x + PW/2 - 16, y + 50, 32, 32, "F")
        self.f(18, bold=True)
        self.set_text_color(*ACCENT)
        self.set_xy(x + PW/2 - 16, y + 54)
        self.cell(32, 22, "H", align="C")
        self.f(11, bold=True)
        self.set_text_color(*WHITE)
        self.set_xy(x, y + 92)
        self.cell(PW, 8, "Heritage", align="C")
        self.f(5)
        self.set_xy(x, y + 101)
        self.cell(PW, 5, "Vos histoires vous attendent", align="C")
        self.set_fill_color(80, 60, 160)
        self.rounded_rect(x + PW/2 - 18, y + 148, 36, 3, 1, "F")
        self.set_fill_color(*WHITE)
        self.rounded_rect(x + PW/2 - 18, y + 148, 22, 3, 1, "F")

    # 2. ONBOARDING slide 0-2
    def onboarding(self, x, y, slide):
        self.phone(x, y)
        self.set_fill_color(250, 248, 255)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.f(4.5)
        self.set_text_color(*MUTED)
        self.set_xy(x + PW - 18, y + NOTCH_H + 3)
        self.cell(14, 4, "Passer >")
        colors = [ACCENT, GREEN, ACCENT2]
        labels_il = ["Livres", "Votes", "Ecriture"]
        self.cover(x + 15, y + 20, 60, 44, colors[slide])
        self.f(7, bold=True)
        self.set_text_color(*WHITE)
        self.set_xy(x + 15, y + 35)
        self.cell(60, 14, labels_il[slide], align="C")
        self.dots(x + PW/2 - 10, y + 71, 3, slide)
        titles = ["Decouvrez des histoires", "Votez & commentez", "Creez & partagez"]
        descs = [
            ["Recits de tous genres,", "a lire ou et quand tu veux."],
            ["Likez, votez, commentez,", "echangez avec les auteurs."],
            ["Publiez, gerez vos dossiers", "et vos Cercles prives."],
        ]
        self.f(7.5, bold=True)
        self.set_text_color(*TEXT)
        self.set_xy(x + 5, y + 79)
        self.cell(PW - 10, 7, titles[slide], align="C")
        self.f(5)
        self.set_text_color(*MUTED)
        for i, line in enumerate(descs[slide]):
            self.set_xy(x + 5, y + 88 + i * 7)
            self.cell(PW - 10, 6, line, align="C")
        lbl = "Commencer" if slide == 2 else "Suivant >"
        self.btn(x + 5, y + PH_SIZE - 28, lbl)

    # 3. CONNEXION  (POST /api/auth/login  →  LoginRequest: email, password)
    def connexion(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.f(9, bold=True)
        self.set_text_color(*ACCENT)
        self.set_xy(x, y + 22)
        self.cell(PW, 8, "Heritage", align="C")
        self.f(5)
        self.set_text_color(*MUTED)
        self.set_xy(x, y + 31)
        self.cell(PW, 5, "Connectez-vous", align="C")
        self.inp(x + 5, y + 42, "Email")
        self.inp(x + 5, y + 54, "Mot de passe")
        self.txt(x + 5, y + 65, "Mot de passe oublie ?", 4, color=ACCENT)
        self.btn(x + 5, y + 72, "Se connecter")
        self.f(4.5)
        self.set_text_color(*MUTED)
        self.set_xy(x + 5, y + 88)
        self.cell(PW - 10, 5, "Pas de compte ?", align="C")
        self.f(4.5)
        self.set_text_color(*ACCENT)
        self.set_xy(x + 5, y + 94)
        self.cell(PW - 10, 5, "Creer un compte", align="C")

    # 4. INSCRIPTION  (POST /api/auth/register  →  RegisterRequest: fullName, email, password)
    def inscription(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Creer un compte")
        ty = y + NOTCH_H + 19
        self.inp(x + 5, ty,      "Nom complet  (User.displayName)")
        self.inp(x + 5, ty + 14, "Email  (User.email)")
        self.inp(x + 5, ty + 28, "Mot de passe  (min. 8 caracteres)")
        self.inp(x + 5, ty + 42, "Confirmer le mot de passe")
        self.btn(x + 5, ty + 58, "Creer mon compte")
        self.f(4)
        self.set_text_color(*MUTED)
        self.set_xy(x + 5, ty + 70)
        self.cell(PW - 10, 5, "En creant un compte, j'accepte les CGU", align="C")
        self.f(4.5)
        self.set_text_color(*MUTED)
        self.set_xy(x + 5, ty + 80)
        self.cell(PW - 10, 5, "Deja un compte ?", align="C")
        self.f(4.5)
        self.set_text_color(*ACCENT)
        self.set_xy(x + 5, ty + 86)
        self.cell(PW - 10, 5, "Se connecter", align="C")

    # 5. FIL DE LECTURE  (Story: title, coverImage, tempsLectureCalcul, visibility, tags)
    def home(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Fil de lecture")
        ty = y + NOTCH_H + 17
        for i, c in enumerate(["Tous", "Fiction", "Sci-Fi", "Romance"]):
            self.chip(x + 4 + i * 21, ty, c, active=(i == 0))
        ty += 9
        cover_colors = [ACCENT, ACCENT2, GREEN]
        vis_colors   = [GREEN, ACCENT, MUTED]
        vis_labels   = ["PUBLIC", "CIRCLE", "PRIVATE"]
        for i in range(3):
            cy = ty + i * 40
            self.card(x + 4, cy, PW - 8, 37)
            self.cover(x + 6, cy + 3, 22, 30, cover_colors[i % 3])
            # lu / non lu  (StoryRead)
            self.set_fill_color(*(GREEN if i == 0 else CARD))
            self.rounded_rect(x + 22, cy + 3, 6, 5, 1, "F")
            self.f(3)
            self.set_text_color(*(WHITE if i == 0 else MUTED))
            self.set_xy(x + 22, cy + 4)
            self.cell(6, 3, "Lu" if i == 0 else "", align="C")
            self.txt(x + 31, cy + 4,  f"Histoire {i+1}", 5.5, bold=True)
            self.txt(x + 31, cy + 11, f"Auteur {i+1}", 4, color=MUTED)
            self.txt(x + 31, cy + 17, f"{(i+1)*4} min", 4, color=MUTED)
            # visibilite (Story.visibility)
            self.set_fill_color(*vis_colors[i])
            self.rounded_rect(x + 31, cy + 23, 16, 5, 1, "F")
            self.f(3)
            self.set_text_color(*WHITE)
            self.set_xy(x + 31, cy + 24)
            self.cell(16, 3.5, vis_labels[i], align="C")
            # interest (StoryInterest)
            self.txt(x + 51, cy + 23, "+", 7, bold=True, color=ACCENT2)
        self.navbar(x, y, [("[H]","Accueil"),("[R]","Rech."),("[+]","Creer"),("[D]","Dossiers"),("[P]","Profil")])

    # 6. RECHERCHE  (Tag, SearchHistory, Story.tempsLectureCalcul)
    def recherche(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Recherche & Filtres")
        ty = y + NOTCH_H + 17
        self.set_fill_color(*CARD)
        self.rounded_rect(x + 4, ty, PW - 8, 9, 3, "F")
        self.f(5)
        self.set_text_color(*MUTED)
        self.set_xy(x + 7, ty + 2)
        self.cell(PW - 14, 5, "Chercher une histoire, un auteur...")
        ty += 12
        self.txt(x + 4, ty, "Filtres", 5.5, bold=True)
        ty += 7
        filters = [
            ("Tags (Tag.name)",          "#romance  #thriller"),
            ("Duree (tempsLectureCalcul)","< 10 min"),
            ("Visibilite (Visibility)",   "PUBLIC / CIRCLE"),
            ("Tri",                       "Upvotes  |  Date  |  Vues"),
        ]
        for lf, val in filters:
            self.set_fill_color(*CARD)
            self.rounded_rect(x + 4, ty, PW - 8, 8, 1, "F")
            self.txt(x + 7, ty + 1.5, lf, 3.8, bold=True)
            self.txt(x + 7, ty + 5.5, val, 3.8, color=MUTED)
            ty += 11
        self.btn(x + 5, ty + 2, "Appliquer les filtres")
        ty += 14
        self.txt(x + 4, ty, "Recherches recentes  (SearchHistory)", 4.5, bold=True, color=MUTED)
        for i, h in enumerate(["dragons", "romance Paris", "sci-fi courts"]):
            self.txt(x + 7, ty + 8 + i * 8, f"> {h}", 4.5, color=MUTED)
        self.navbar(x, y, [("[H]","Accueil"),("[R]","Rech."),("[+]","Creer"),("[D]","Dossiers"),("[P]","Profil")])

    # 7. RESULTATS  (Story list: title, coverImage, tempsLectureCalcul, tags)
    def resultats(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Resultats")
        ty = y + NOTCH_H + 17
        self.f(4.5)
        self.set_text_color(*MUTED)
        self.set_xy(x + 4, ty)
        self.cell(PW - 8, 5, "24 resultats pour \"romance\"")
        ty += 8
        covers = [ACCENT, GREEN, ACCENT2, ORANGE]
        for i in range(4):
            cy = ty + i * 32
            self.card(x + 4, cy, PW - 8, 29)
            self.cover(x + 6, cy + 3, 18, 22, covers[i])
            self.txt(x + 27, cy + 3,  f"Titre histoire {i+1}", 5, bold=True)
            self.txt(x + 27, cy + 9,  f"par Auteur {i+1}", 4, color=MUTED)
            self.txt(x + 27, cy + 15, f"{(i+1)*3+3} min  ·  #romance", 3.8, color=MUTED)
            # sauvegarder  (StoryInterest)
            self.set_fill_color(*ACCENT2)
            self.rounded_rect(x + PW - 14, cy + 3, 8, 7, 2, "F")
            self.f(5, bold=True)
            self.set_text_color(*WHITE)
            self.set_xy(x + PW - 14, cy + 4)
            self.cell(8, 5, "+", align="C")
        self.navbar(x, y, [("[H]","Accueil"),("[R]","Rech."),("[+]","Creer"),("[D]","Dossiers"),("[P]","Profil")])

    # 8. FICHE HISTOIRE  (Story: title, author, coverImage, resume, tempsLectureCalcul, visibility,
    #                     commentable | StoryTag | StoryAttachment | StoryRating | StoryInterest | StoryRead)
    def fiche(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.set_fill_color(*ACCENT)
        self.rect(x, y + NOTCH_H + 6, PW, 33, "F")
        self.f(8, bold=True)
        self.set_text_color(*WHITE)
        self.set_xy(x, y + NOTCH_H + 17)
        self.cell(PW, 10, "COUVERTURE  (Story.coverImage)", align="C")
        ty = y + NOTCH_H + 42
        # titre + auteur
        self.txt(x + 4, ty,     "Le Secret des Etoiles", 7, bold=True)
        self.txt(x + 4, ty + 8, "par Marie Dupont  ·  12 min", 4.5, color=MUTED)
        # visibilite + commentable
        ty += 16
        self.badge(x + 4,  ty, "PUBLIC", GREEN)
        self.badge(x + 21, ty, "Commentaires ON", ACCENT)
        # stats votes/likes/commentaires  (StoryRating)
        ty += 8
        for i, (n, lb) in enumerate([("234","upvotes"),("89","likes"),("41","avis")]):
            sx = x + 5 + i * 27
            self.f(6, bold=True)
            self.set_text_color(*ACCENT)
            self.set_xy(sx, ty)
            self.cell(22, 5, n, align="C")
            self.f(3.5)
            self.set_text_color(*MUTED)
            self.set_xy(sx, ty + 5)
            self.cell(22, 4, lb, align="C")
        ty += 12
        # tags  (StoryTag -> Tag.name)
        self.txt(x + 4, ty, "Tags :", 4.5, bold=True)
        for i, tag in enumerate(["#sci-fi", "#aventure", "#IA"]):
            self.set_fill_color(*CARD)
            self.rounded_rect(x + 20 + i * 23, ty, 20, 5, 1, "F")
            self.f(3.5)
            self.set_text_color(*MUTED)
            self.set_xy(x + 20 + i * 23, ty + 0.8)
            self.cell(20, 3.8, tag, align="C")
        ty += 8
        # resume IA  (Story.resume)
        self.txt(x + 4, ty, "Resume  (Story.resume)", 4.5, bold=True)
        self.f(4)
        self.set_text_color(*TEXT)
        for i, line in enumerate(["Dans un futur lointain, Lea", "decouvre un secret enorme..."]):
            self.set_xy(x + 4, ty + 7 + i * 5.5)
            self.cell(PW - 8, 5, line)
        ty += 21
        hw = (PW - 14) / 2 - 1
        self.btn(x + 5,          ty, "Lire l'histoire", ACCENT, hw)
        self.btn(x + 5 + hw + 3, ty, "Sauvegarder", ACCENT2, hw)
        # marquer comme lu  (StoryRead)
        ty += 11
        self.btn(x + 5, ty, "Marquer comme lu  (StoryRead)", GREEN, PW - 10, tc=WHITE)
        self.navbar(x, y, [("<","Retour"),("[S]","Partager"),("[+]","Dossier"),("[I]","Impr."),("...","Plus")])

    # 9. VOTES & COMMENTAIRES  (StoryRating: rating, comment)
    def commentaires(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Votes & Commentaires", back=True)
        ty = y + NOTCH_H + 17
        # vote  (StoryRating.rating)
        self.txt(x + 4, ty, "Voter  (StoryRating.rating)", 5, bold=True)
        ty += 7
        hw = (PW - 14) / 2 - 1
        self.btn(x + 5,          ty, "Upvoter  (234)", ACCENT, hw)
        self.btn(x + 5 + hw + 3, ty, "Downvote", CARD, hw, TEXT)
        ty += 13
        self.txt(x + 4, ty, "Commentaires  (StoryRating.comment)", 4.5, bold=True)
        ty += 7
        for i, f in enumerate(["Recents", "Top", "Prives"]):
            self.chip(x + 4 + i * 28, ty, f, active=(i == 0), w=25)
        ty += 9
        for i in range(3):
            cy = ty + i * 27
            self.card(x + 4, cy, PW - 8, 24)
            self.set_fill_color(*ACCENT)
            self.ellipse(x + 7, cy + 5, 9, 9, "F")
            self.txt(x + 18, cy + 4,   f"User {i+1}", 4.5, bold=True)
            priv = "  [PRIVE]" if i == 2 else ""
            self.txt(x + 18, cy + 9.5, f"il y a 2h  ·  +12{priv}", 3.8, color=MUTED)
            self.txt(x + 7,  cy + 16,  "Super histoire, vraiment !", 4.5)
        # champ commentaire  (StoryRating.comment)
        self.inp(x + 4, y + PH_SIZE - 22, "Votre commentaire...", PW - 20)
        self.btn(x + PW - 18, y + PH_SIZE - 22, ">", ACCENT, 12)

    # 10. MES DOSSIERS  (Folder: name, privateFolder | FolderStory | FolderShare)
    def dossiers(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Mes Dossiers  (Folder)")
        ty = y + NOTCH_H + 17
        items = [
            ("FAV",  "Favoris",      "12 histoires  ·  prive", ORANGE, True),
            ("LIR",  "A lire",       "5 histoires  ·  prive",  GREEN,  True),
            ("ROM",  "Romans",       "8 histoires  ·  public", ACCENT2, False),
            ("PART", "Partage",      "invite: 3 pers.",        ACCENT,  False),
        ]
        for i, (code, name, sub, color, priv) in enumerate(items):
            cy = ty + i * 28
            self.card(x + 4, cy, PW - 8, 25)
            self.cover(x + 6, cy + 4, 17, 17, color)
            self.f(5, bold=True)
            self.set_text_color(*WHITE)
            self.set_xy(x + 6, cy + 8)
            self.cell(17, 8, code, align="C")
            self.txt(x + 26, cy + 4,  name, 5.5, bold=True)
            self.txt(x + 26, cy + 12, sub,  3.8, color=MUTED)
            # badge prive  (Folder.privateFolder)
            if priv:
                self.set_fill_color(*MUTED)
                self.rounded_rect(x + PW - 20, cy + 4, 13, 5, 1, "F")
                self.f(3)
                self.set_text_color(*WHITE)
                self.set_xy(x + PW - 20, cy + 5)
                self.cell(13, 3.5, "PRIVE", align="C")
            else:
                self.txt(x + PW - 10, cy + 5, "...", 7, color=MUTED)
        ty += 4 * 28 + 4
        self.btn(x + 5, ty, "+ Nouveau dossier", CARD, tc=ACCENT)
        self.navbar(x, y, [("[H]","Accueil"),("[R]","Rech."),("[+]","Creer"),("[D]","Dossiers"),("[P]","Profil")])

    # 11. DETAIL DOSSIER  (FolderStory | FolderShare: inviter un user)
    def detail_dossier(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Dossier : Favoris", back=True)
        ty = y + NOTCH_H + 17
        for i, lb in enumerate(["Inviter  (FolderShare)", "Deplacer", "Gerer"]):
            bx = x + 4 + i * 28
            self.set_fill_color(*CARD)
            self.rounded_rect(bx, ty, 25, 9, 2, "F")
            self.f(4)
            self.set_text_color(*TEXT)
            self.set_xy(bx, ty + 1.5)
            self.cell(25, 6, lb, align="C")
        ty += 13
        # membres invites  (FolderShare)
        self.txt(x + 4, ty, "Membres invites :", 4.5, bold=True)
        ty += 6
        for i in range(2):
            self.set_fill_color(*ACCENT)
            self.ellipse(x + 7 + i * 14, ty, 10, 10, "F")
            self.f(4, bold=True)
            self.set_text_color(*WHITE)
            self.set_xy(x + 7 + i * 14, ty + 2)
            self.cell(10, 6, f"U{i+1}", align="C")
        ty += 14
        covers2 = [ACCENT, ACCENT2, GREEN]
        for i in range(3):
            cy = ty + i * 30
            self.card(x + 4, cy, PW - 8, 27)
            self.cover(x + 6, cy + 3, 18, 20, covers2[i])
            self.txt(x + 27, cy + 3,  f"Histoire {i+1}", 5, bold=True)
            self.txt(x + 27, cy + 9,  "8 min  ·  #fiction", 4, color=MUTED)
            self.txt(x + PW - 12, cy + 3, "...", 7, color=MUTED)
        self.navbar(x, y, [("<","Retour"),("[F]","Filtrer"),("",""),("",""),("[G]","Gerer")])

    # 12. CERCLES  (Circle: name, owner | CircleMember | StoryCircle | Visibility.CIRCLE)
    def cercles(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Mes Cercles  (Circle)")
        ty = y + NOTCH_H + 17
        # explication
        self.f(4)
        self.set_text_color(*MUTED)
        self.set_xy(x + 4, ty)
        self.cell(PW - 8, 5, "Partage d'histoires en visibilite CIRCLE")
        ty += 9
        circles = [
            ("Famille",      "4 membres",  ACCENT),
            ("Amis proches", "7 membres",  GREEN),
            ("Collegues",    "12 membres", ACCENT2),
        ]
        for i, (name, sub, color) in enumerate(circles):
            cy = ty + i * 30
            self.card(x + 4, cy, PW - 8, 27)
            self.set_fill_color(*color)
            self.ellipse(x + 7, cy + 5, 16, 16, "F")
            self.f(5, bold=True)
            self.set_text_color(*WHITE)
            self.set_xy(x + 7, cy + 8)
            self.cell(16, 9, name[0], align="C")
            self.txt(x + 26, cy + 4,  name, 5.5, bold=True)
            self.txt(x + 26, cy + 11, sub,  4, color=MUTED)
            self.txt(x + PW - 12, cy + 4, "...", 7, color=MUTED)
        ty += 3 * 30 + 4
        self.btn(x + 5, ty, "+ Nouveau Cercle", CARD, tc=ACCENT)
        self.navbar(x, y, [("[H]","Accueil"),("[R]","Rech."),("[+]","Creer"),("[D]","Dossiers"),("[P]","Profil")])

    # 13. PROFIL PUBLIC  (User: pseudo, displayName, photo, bio | StoryRating | Story list)
    def profil_public(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.set_fill_color(*ACCENT)
        self.rect(x, y + NOTCH_H + 6, PW, 22, "F")
        self.set_fill_color(*WHITE)
        self.ellipse(x + PW/2 - 11, y + NOTCH_H + 18, 22, 22, "F")
        self.f(10, bold=True)
        self.set_text_color(*ACCENT)
        self.set_xy(x + PW/2 - 11, y + NOTCH_H + 21)
        self.cell(22, 14, "M", align="C")
        ty = y + NOTCH_H + 44
        self.txt(x + 4, ty,     "Marie Dupont  (User.displayName)", 6, bold=True, align="C", w=PW - 8)
        self.txt(x + 4, ty + 8, "@mariedupont  (User.pseudo)", 4, color=MUTED, align="C", w=PW - 8)
        ty += 16
        self.f(4.5)
        self.set_text_color(*TEXT)
        self.set_xy(x + 4, ty)
        self.cell(PW - 8, 5, "Bio  (User.bio) :", align="C")
        self.f(4)
        self.set_text_color(*MUTED)
        self.set_xy(x + 4, ty + 5)
        self.cell(PW - 8, 5, "Auteure passionnee de sci-fi", align="C")
        ty += 12
        for i, (n, lb) in enumerate([("12","histoires"),("348","abonnes"),("89","suivis")]):
            sx = x + 6 + i * 27
            self.f(7, bold=True)
            self.set_text_color(*ACCENT)
            self.set_xy(sx, ty)
            self.cell(22, 6, n, align="C")
            self.f(3.5)
            self.set_text_color(*MUTED)
            self.set_xy(sx, ty + 6)
            self.cell(22, 4, lb, align="C")
        ty += 14
        hw = (PW - 14) / 2 - 1
        self.btn(x + 5,          ty, "Suivre", ACCENT, hw)
        self.btn(x + 5 + hw + 3, ty, "Message", CARD, hw, TEXT)
        ty += 13
        self.txt(x + 4, ty, "Publications  (Story)", 5, bold=True)
        ty += 7
        for i in range(2):
            cy = ty + i * 22
            self.card(x + 4, cy, PW - 8, 19)
            self.txt(x + 7, cy + 3,  f"Histoire publiee {i+1}", 5, bold=True)
            self.txt(x + 7, cy + 9,  "8 min  ·  234 votes", 4, color=MUTED)

    # 14. MON PROFIL / PARAMETRES  (User: photo, pseudo, bio, displayName + notifs + confidentialite)
    def mon_profil(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Mon Profil")
        ty = y + NOTCH_H + 17
        self.set_fill_color(*ACCENT)
        self.ellipse(x + PW/2 - 12, ty, 24, 24, "F")
        self.f(10, bold=True)
        self.set_text_color(*WHITE)
        self.set_xy(x + PW/2 - 12, ty + 5)
        self.cell(24, 14, "M", align="C")
        self.set_fill_color(*ACCENT2)
        self.ellipse(x + PW/2 + 3, ty + 16, 8, 8, "F")
        self.f(4.5, bold=True)
        self.set_text_color(*WHITE)
        self.set_xy(x + PW/2 + 3, ty + 17)
        self.cell(8, 6, "Ed.", align="C")
        ty += 28
        sections = [
            "Modifier pseudo / bio / photo  (User)",
            "Notifications",
            "Confidentialite & donnees",
            "Telecharger mes donnees (User)",
            "Supprimer le compte",
        ]
        for i, label_s in enumerate(sections):
            sy = ty + i * 16
            color_s = RED if i == 4 else CARD
            self.set_fill_color(*color_s)
            self.rounded_rect(x + 4, sy, PW - 8, 13, 2, "F")
            tc = WHITE if i == 4 else TEXT
            self.f(4.5)
            self.set_text_color(*tc)
            self.set_xy(x + 7, sy + 3)
            self.cell(PW - 18, 7, label_s)
            self.f(8)
            self.set_text_color(*(WHITE if i == 4 else MUTED))
            self.set_xy(x + PW - 12, sy + 2)
            self.cell(6, 9, ">")
        self.navbar(x, y, [("[H]","Accueil"),("[R]","Rech."),("[+]","Creer"),("[D]","Dossiers"),("[P]","Profil")])

    # 15. LECTURE (detail de l'histoire)  (Story: title, content, author, coverImage, tempsLectureCalcul,
    #              visibility, commentable, resume | StoryRead | StoryRating | StoryAttachment | StoryTag)
    def lecture(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        # barre de lecture avec progression
        self.set_fill_color(*HEADER)
        self.rect(x, y + NOTCH_H + 6, PW, 7, "F")
        self.f(4)
        self.set_text_color(*WHITE)
        self.set_xy(x + 2, y + NOTCH_H + 7)
        self.cell(8, 5, "< Retour")
        self.f(5, bold=True)
        self.set_xy(x + 10, y + NOTCH_H + 7)
        self.cell(PW - 30, 5, "Le Secret des Etoiles", align="C")
        self.f(4)
        self.set_xy(x + PW - 18, y + NOTCH_H + 7)
        self.cell(14, 5, "8 / 12 min", align="R")
        # barre de progression (StoryRead.tempsLecture)
        self.set_fill_color(80, 60, 160)
        self.rect(x, y + NOTCH_H + 13, PW, 2, "F")
        self.set_fill_color(*WHITE)
        self.rect(x, y + NOTCH_H + 13, PW * 0.65, 2, "F")
        ty = y + NOTCH_H + 18
        # chapeau / accroche (Story.resume)
        self.set_fill_color(245, 240, 255)
        self.rounded_rect(x + 4, ty, PW - 8, 14, 2, "F")
        self.f(4, bold=True)
        self.set_text_color(*ACCENT)
        self.set_xy(x + 6, ty + 1.5)
        self.cell(PW - 12, 5, "Resume (Story.resume)")
        self.f(3.8)
        self.set_text_color(*MUTED)
        self.set_xy(x + 6, ty + 7)
        self.cell(PW - 12, 5, "Dans un futur lointain, Lea decouvre...")
        ty += 17
        # contenu du texte (Story.content)
        self.f(5, bold=True)
        self.set_text_color(*TEXT)
        self.set_xy(x + 4, ty)
        self.cell(PW - 8, 6, "Chapitre 1")
        ty += 7
        paragraphes = [
            "La nuit etait tombee sur la cite",
            "spatiale quand Lea remarqua la",
            "lueur etrange a l'horizon...",
            "",
            "Elle se leva lentement, les yeux",
            "fixes sur ce point lumineux qui",
            "pulsait comme un coeur.",
            "",
            "\"C'est impossible\", murmura-t-elle,",
            "en saisissant son communicateur.",
        ]
        self.f(4.8)
        self.set_text_color(*TEXT)
        for i, ligne in enumerate(paragraphes):
            self.set_xy(x + 4, ty + i * 6)
            self.cell(PW - 8, 5.5, ligne)
        ty += len(paragraphes) * 6 + 2
        # pièces jointes (StoryAttachment)
        self.set_fill_color(*CARD)
        self.rounded_rect(x + 4, ty, PW - 8, 8, 2, "F")
        self.f(4)
        self.set_text_color(*MUTED)
        self.set_xy(x + 7, ty + 2)
        self.cell(PW - 14, 5, "Piece jointe : image.jpg  (StoryAttachment)")
        # barre flottante en bas
        by = y + PH_SIZE - 22
        self.set_fill_color(*HEADER)
        self.rect(x, by, PW, 8, "F")
        actions = [("< Prev", 0), ("A+ / A-", 1), ("Lu (SR)", 2), ("Avis", 3), ("> Suiv", 4)]
        w = PW / len(actions)
        for i, (lb, _) in enumerate(actions):
            self.f(3.8, bold=(i == 2))
            self.set_text_color(*WHITE)
            self.set_xy(x + i * w, by + 1.5)
            self.cell(w, 5, lb, align="C")

    # 16. CREATION HISTOIRE  (Story: title, content, visibility(PRIVATE/CIRCLE/PUBLIC),
    #                          coverImage, commentable, resume | StoryTag | StoryAttachment | FolderStory)
    def creation(self, x, y):
        self.phone(x, y)
        self.set_fill_color(*PH_BG)
        self.rect(x, y + NOTCH_H, PW, PH_SIZE - NOTCH_H, "F")
        self.statusbar(x, y)
        self.titlebar(x, y, "Nouvelle Histoire", back=True)
        ty = y + NOTCH_H + 17
        # couverture  (Story.coverImage)
        self.set_fill_color(*CARD)
        self.rounded_rect(x + PW/2 - 18, ty, 36, 26, 3, "F")
        self.f(6, bold=True)
        self.set_text_color(*MUTED)
        self.set_xy(x + PW/2 - 18, ty + 6)
        self.cell(36, 8, "+ coverImage", align="C")
        self.f(4)
        self.set_xy(x + PW/2 - 18, ty + 16)
        self.cell(36, 5, "ou generer par IA", align="C")
        ty += 30
        self.inp(x + 5, ty, "Titre  (Story.title) *")
        ty += 11
        # visibilite 3 options  (Story.visibility = PRIVATE / CIRCLE / PUBLIC)
        self.txt(x + 5, ty, "Visibilite  (Story.visibility) :", 4.5, bold=True)
        ty += 7
        for i, (lb, color) in enumerate([("PRIVATE", MUTED), ("CIRCLE", ACCENT), ("PUBLIC", GREEN)]):
            active = i == 2
            self.set_fill_color(*(color if active else CARD))
            self.rounded_rect(x + 5 + i * 27, ty, 24, 7, 2, "F")
            self.f(4, bold=active)
            self.set_text_color(*(WHITE if active else MUTED))
            self.set_xy(x + 5 + i * 27, ty + 1.5)
            self.cell(24, 4, lb, align="C")
        ty += 10
        # tags  (StoryTag -> Tag)
        self.inp(x + 5, ty, "#  Tags  (StoryTag + Tag)")
        ty += 11
        # commentable toggle  (Story.commentable)
        self.set_fill_color(*CARD)
        self.rounded_rect(x + 5, ty, PW - 10, 8, 2, "F")
        self.txt(x + 8, ty + 2, "Commentaires  (Story.commentable)", 4)
        self.set_fill_color(*ACCENT)
        self.rounded_rect(x + PW - 16, ty + 2, 9, 4, 2, "F")
        self.set_fill_color(*WHITE)
        self.ellipse(x + PW - 9, ty + 2, 4, 4, "F")
        ty += 11
        # dossier  (FolderStory)
        self.set_fill_color(*CARD)
        self.rounded_rect(x + 5, ty, PW - 10, 8, 2, "F")
        self.txt(x + 8, ty + 2, "Ajouter a un Dossier  (FolderStory)", 4)
        ty += 11
        self.btn(x + 5, ty, "Publier l'histoire", ACCENT)


# ── GENERATION ────────────────────────────────────────────────────────────────

pdf = PDF(orientation="L", unit="mm", format="A4")
pdf.set_auto_page_break(False)
pdf.setup_fonts()

POS = [(10, 18), (110, 18), (210, 18)]

# PAGE 1 — Splash & Onboarding
pdf.add_page()
pdf.page_bg("Heritage - Maquettes UI  (v2 - modeles inclus)", "Page 1/5  |  Splash & Onboarding")
pdf.splash(*POS[0])
pdf.onboarding(*POS[1], slide=0)
pdf.onboarding(*POS[2], slide=2)
pdf.cap(POS[0][0], 1, "Splash")
pdf.cap(POS[1][0], 2, "Onboarding - slide 1/3")
pdf.cap(POS[2][0], 3, "Onboarding - slide 3/3")

# PAGE 2 — Auth
pdf.add_page()
pdf.page_bg("Heritage - Maquettes UI  (v2 - modeles inclus)", "Page 2/5  |  Authentification  (User: email, passwordHash, pseudo, displayName)")
pdf.connexion(*POS[0])
pdf.inscription(*POS[1])
pdf.connexion(*POS[2])
pdf.cap(POS[0][0], 4, "Connexion")
pdf.cap(POS[1][0], 5, "Inscription")
pdf.cap(POS[2][0], "4b", "Connexion (variante)")

# PAGE 3 — Fil + Recherche + Resultats
pdf.add_page()
pdf.page_bg("Heritage - Maquettes UI  (v2 - modeles inclus)", "Page 3/5  |  Fil de lecture, Recherche & Resultats  (Story, Tag, SearchHistory)")
pdf.home(*POS[0])
pdf.recherche(*POS[1])
pdf.resultats(*POS[2])
pdf.cap(POS[0][0], 6, "Fil de lecture (Home)")
pdf.cap(POS[1][0], 7, "Recherche & Filtres")
pdf.cap(POS[2][0], 8, "Resultats")

# PAGE 4 — Fiche + Commentaires + Dossiers
pdf.add_page()
pdf.page_bg("Heritage - Maquettes UI  (v2 - modeles inclus)", "Page 4/5  |  Fiche, Votes & Dossiers  (Story, StoryRating, Folder, FolderShare)")
pdf.fiche(*POS[0])
pdf.commentaires(*POS[1])
pdf.dossiers(*POS[2])
pdf.cap(POS[0][0],  9, "Fiche histoire")
pdf.cap(POS[1][0], 10, "Votes & Commentaires (StoryRating)")
pdf.cap(POS[2][0], 11, "Mes Dossiers (Folder + privateFolder)")

# PAGE 5 — Detail dossier + Cercles + Profils + Creation
pdf.add_page()
pdf.page_bg("Heritage - Maquettes UI  (v2 - modeles inclus)", "Page 5/5  |  Dossier detail, Cercles, Profils & Creation")

# 4 ecrans sur cette page : on en met 3 + 1 sur ligne suivante
POS5 = [(10, 16), (110, 16), (210, 16)]
pdf.detail_dossier(*POS5[0])
pdf.cercles(*POS5[1])
pdf.profil_public(*POS5[2])
pdf.cap(POS5[0][0], 12, "Detail dossier (FolderShare)")
pdf.cap(POS5[1][0], 13, "Cercles (Circle + CircleMember)")
pdf.cap(POS5[2][0], 14, "Profil public auteur")

# ecrans 15 et 16 sur une 6e page
pdf.add_page()
pdf.page_bg("Heritage - Maquettes UI  (v2 - modeles inclus)", "Page 6/6  |  Lecture, Mon Profil & Creation d'histoire")
pdf.lecture(*POS[0])
pdf.mon_profil(*POS[1])
pdf.creation(*POS[2])
pdf.cap(POS[0][0], 15, "Lecture / Detail histoire (Story.content + StoryRead)")
pdf.cap(POS[1][0], 16, "Mon Profil / Parametres (User)")
pdf.cap(POS[2][0], 17, "Creation d'histoire (Story + StoryTag + FolderStory)")

out = "/home/melissa/Desktop/Heritage_maquettes.pdf"
pdf.output(out)
print(f"PDF genere : {out}")
