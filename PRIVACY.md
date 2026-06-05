# PRIVACY — Accessible

Politique de confidentialité et gestion des données. Accessible est conçu **local-first** et **sans télémétrie**.

---

## Principes

1. **Vos données restent sur votre appareil.**
2. **Aucune connexion Internet requise** pour utiliser l'application.
3. **Aucune télémétrie** par défaut — pas d'analytics, pas de crash reporter distant.
4. **Vous contrôlez** export, import et suppression.
5. **Accessible ne pose pas de diagnostic** — les données reflètent des déclarations et préférences, pas des jugements médicaux.

---

## Données collectées

### Données stockées localement

| Donnée | Finalité | Emplacement |
|--------|----------|-------------|
| Profil utilisateur | Réglages, préférences, parcours onboarding | `profile.json` |
| Profils médicaux déclarés | Presets de départ, export PDF optionnel | Dans profil |
| Profils fonctionnels | Adapter l'interface | Dans profil |
| Réglages actifs / rejetés | Personnalisation | Dans profil |
| Résultats tests comparatifs | Affiner recommandations | Dans profil |
| Exports PDF/JSON | Partage avec professionnels | Dossier exports (choix utilisateur) |

### Données NON collectées

- Nom, email, identifiants en ligne
- Géolocalisation
- Historique de navigation web
- Contenu des documents importés (sauf si l'utilisateur les colle dans l'app — reste local)
- Données biométriques
- Journaux d'utilisation envoyés à un serveur

---

## Emplacements fichiers

| Mode | Chemin Windows |
|------|----------------|
| Installation standard | `%APPDATA%/Accessible/` |
| Mode portable | `./data/` (à côté de l'exécutable) |
| Développement web | `localStorage` navigateur (clé `accessible-profile-v1`) |

Contenu typique :
```
Accessible/
├── profile.json
└── exports/
    ├── synthese-2026-06-02.pdf
    └── profil-export.json
```

---

## Mode invité

- Aucune persistance entre sessions
- Profil temporaire en mémoire uniquement
- À la fermeture : données effacées
- Indication visuelle claire « Mode invité actif »

---

## Export et partage

- **Export JSON** : fichier complet du profil technique
- **Export PDF** : synthèse lisible pour professionnels
- L'utilisateur choisit **où enregistrer** le fichier (dialogue système)
- Option **masquer les profils médicaux déclarés** dans le PDF
- Mention obligatoire : « Ce document ne constitue pas un diagnostic. »

**Responsabilité utilisateur :** Une fois exporté, le fichier PDF/JSON est sous le contrôle de l'utilisateur. Accessible n'envoie rien automatiquement.

---

## Suppression des données

Bouton **« Supprimer toutes les données »** dans Paramètres :

1. Confirmation explicite (double validation)
2. Suppression de `profile.json` et historique local
3. Réinitialisation au profil par défaut
4. Message de confirmation

Aucune copie distante à supprimer (il n'y en a pas).

---

## Import de profil

- Import manuel d'un fichier JSON exporté précédemment
- Validation du schéma avant remplacement
- Pas d'import automatique depuis le cloud

---

## Chiffrement (V2) ✅

- Chiffrement optionnel du blob profil (JSON + SQLite `user_profiles.content`)
- Mot de passe local via PBKDF2 + AES-GCM (Web Crypto)
- Mot de passe non récupérable — avertissement affiché à l'activation
- Tables SQLite normalisées (notes, flashcards, etc.) restent en clair dans cette version

---

## TTS et services système

- **Web Speech API** : utilise les voix installées sur l'OS ; texte envoyé au moteur système, pas à Accessible
- **Dictée système** : utilise le service OS (Windows Speech)
- Accessible ne stocke pas les enregistrements vocaux

---

## OCR et correcteur (V2)

- Traitement **100 % local** (Tesseract, Grammalecte)
- Documents importés traités en mémoire / temp local
- Pas d'envoi à un service cloud

---

## Mises à jour

- V1 : pas de mécanisme de mise à jour automatique obligatoire
- Téléchargement manuel de nouvelles versions
- Aucune vérification de licence en ligne prévue

---

## Télémétrie — engagement

| Pratique | Accessible V1 |
|----------|---------------|
| Analytics (Google, Plausible…) | ❌ Non |
| Crash reporting distant (Sentry…) | ❌ Non |
| Vérification licence en ligne | ❌ Non |
| Mise à jour forcée | ❌ Non |
| Contenu tiers tracking | ❌ Non |

---

## RGPD — orientation

Accessible V1 ne traite pas de données personnelles côté serveur (pas de serveur).  
Les données locales sont sous contrôle exclusif de l'utilisateur.

Recommandations affichées à l'utilisateur :
- Ne partagez un export PDF/JSON qu'avec des personnes de confiance
- Supprimez les exports obsolètes de votre appareil
- Utilisez le mode invité sur un ordinateur partagé

---

## Contact / responsable

À compléter lors de la publication (éditeur, contact DPO si applicable).

---

## Historique

| Date | Modification |
|------|--------------|
| 2026-06-02 | Création document initial |
