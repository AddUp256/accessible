# ACCESSIBILITY_PRINCIPLES — Accessible

Règles UX, FALC, éthiques et juridiques. **Obligatoires pour toute contribution.**

---

## 1. Règle centrale

> Accessible ne cherche pas à nommer les personnes.  
> Accessible cherche à adapter l'environnement.

## 2. Vocabulaire autorisé vs interdit

### ✅ Dire

- « Ces réponses indiquent des **difficultés déclarées** dans la lecture longue. »
- « Il peut être **pertinent d'en parler** avec un orthophoniste ou le service handicap. »
- « Ce document **ne constitue pas un diagnostic**. »
- « Réglages **utiles** / **gênants** / **testés** »
- « **Besoins** / **préférences** / **pistes à discuter** »

### ❌ Ne jamais dire

- « Vous êtes dyslexique / autiste / TDA/H »
- « Diagnostic positif / négatif »
- « Vous devez consulter car vous avez… »
- Jargon médical non expliqué
- Étiquettes définitives sur la personne

### Formulation des recommandations spécialistes

Toujours : **« Il peut être pertinent de consulter… »**  
Jamais : **« Vous devez consulter car… »**

---

## 3. Profils médicaux vs fonctionnels

| Type | Rôle | Source |
|------|------|--------|
| **Médical / administratif déclaré** | Proposer réglages de départ ; option export PDF | Choix libre utilisateur |
| **Fonctionnel** | Piloter l'expérience réelle | Tests, préférences, usage |

**Règle absolue :** Si un preset médical propose un réglage et que l'utilisateur le rejette, il reste dans `rejectedSettings` et n'est jamais réactivé automatiquement.

**Texte obligatoire — parcours reconnaissance :**
> Ce choix permet de proposer des réglages fréquents.  
> Vous pourrez tout modifier ensuite.  
> Accessible ne vérifie pas et ne pose pas de diagnostic.

---

## 4. Interface FALC (Facile à Lire et à Comprendre)

### Principes par défaut

- Phrases courtes (viser ≤ 20 mots ; alerter au-delà en mode rédaction)
- Une idée par écran
- Vocabulaire simple, concret
- Gros boutons, zones cliquables larges
- Progression visible
- Pas de jargon médical
- Pas d'animations inutiles
- Pas de sons automatiques
- Pas de pop-up agressive
- Pas de surcharge visuelle

### Boutons universels (à prévoir partout où pertinent)

| Bouton | Rôle |
|--------|------|
| **Je ne sais pas** | Passer sans penalité, enregistrer « non renseigné » |
| **Expliquer autrement** | Texte alternatif plus simple |
| **Lire à voix haute** | TTS du contenu |
| **Passer cette étape** | Onboarding non bloquant |

### Modes

- **Très simple** — moins d'options, écrans épurés, gros boutons
- **Standard** — défaut
- **Expert** — plus de réglages (V3)

---

## 5. Texte d'accueil obligatoire

Afficher à la première ouverture et accessible depuis l'accueil :

> Accessible ne pose pas de diagnostic.  
> Accessible vous aide à repérer vos besoins.  
> Accessible vous aide à tester des réglages.  
> Accessible vous aide à préparer un rendez-vous si besoin.

---

## 6. Règle d'or UX — réglages

Tout réglage doit être :

1. **Prévisualisable** — voir l'effet avant d'activer
2. **Activable** — choix explicite
3. **Désactivable** — retour arrière immédiat
4. **Réinitialisable** — valeur par défaut accessible
5. **Expliqué simplement** — une phrase, pas un manuel

---

## 7. Accessibilité technique (WCAG orienté)

### HTML sémantique

- `<button>` pour actions, pas `<div onclick>`
- `<label>` associé à chaque champ
- Hiérarchie titres (`h1` → `h2` → `h3`)
- `lang="fr"` sur `<html>`

### Clavier

- Navigation Tab complète
- Focus visible (outline ≥ 2px, contraste suffisant)
- Pas de piège clavier
- Raccourcis documentés (mode expert)

### Visuel

- Contraste minimum AA (AAA pour mode contraste élevé)
- Texte redimensionnable jusqu'à 200 % sans perte
- Pas de contenu clignotant
- `prefers-reduced-motion` respecté

### Audio / vidéo

- Pas de lecture auto
- Sous-titres quand média présent (V2)

---

## 8. Mode crise / surcharge

Bouton visible permanent : **« Mode pause »**

Effets :
- Interface minimale
- Arrêt animations et sons
- Minuteur doux optionnel
- Bouton reprendre / fermer activité
- Carte de besoin affichable (j'ai besoin d'aide, pause, trop de bruit…)

---

## 9. Export PDF — mentions obligatoires

- Titre : **« Synthèse de besoins fonctionnels — document préparatoire »**
- **« Ce document ne constitue pas un diagnostic. »**
- Profils médicaux déclarés **uniquement si l'utilisateur accepte**
- Formulations : difficultés déclarées, réglages utiles, pistes à discuter

---

## 10. Design visuel

- Sobriété, calme, confiance
- **Pas** d'esthétique médicale anxiogène (blanc clinique, croix, cerveaux…)
- **Pas** d'effet gadget
- Priorité : lisibilité, contrôle utilisateur, réversibilité

### Thèmes par défaut

| Thème | Usage |
|-------|-------|
| Crème | Défaut, lecture longue |
| Clair | Standard |
| Sombre | Fatigue visuelle, soir |
| Contraste élevé | Basse vision |

---

## 11. Vie privée (lien PRIVACY.md)

- Pas de télémétrie
- Pas de connexion requise
- Données locales uniquement
- Suppression totale possible
- Mode invité sans persistance

---

## 12. Checklist revue UI (à utiliser à chaque écran)

- [ ] Phrases courtes, vocabulaire simple ?
- [ ] Une idée principale par écran ?
- [ ] Boutons assez grands (min 44×44 px cible) ?
- [ ] Focus clavier visible ?
- [ ] Pas de diagnostic implicite dans les textes ?
- [ ] « Je ne sais pas » / « Passer » disponible si onboarding ?
- [ ] Réglages prévisualisables ?
- [ ] `prefers-reduced-motion` respecté ?
