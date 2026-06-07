# Accessible

Application locale, légère et utilisable hors connexion pour adapter son environnement de lecture, d'écriture, d'organisation, de communication et de travail numérique.

**Accessible ne pose pas de diagnostic.**

## Télécharger et installer

Les versions prêtes à installer seront publiées dans les **GitHub Releases** du projet.

| Système | Fichier conseillé | Compatibilité annoncée |
|---------|-------------------|------------------------|
| Windows 10/11 | `.exe` NSIS, ou `.msi` pour déploiement administré | x64 |
| macOS Apple Silicon | `.dmg` / `.app` `aarch64` ou `arm64` | Apple Silicon |
| macOS Intel | `.dmg` / `.app` `x86_64` | Intel x64 |
| Linux | `.AppImage` ou `.deb` | x64, distributions récentes |

Les premiers installateurs peuvent ne pas être signés avec un certificat éditeur. Windows SmartScreen ou macOS Gatekeeper peuvent donc afficher un avertissement tant que la signature Windows et la notarisation Apple ne sont pas configurées.

Voir **[INSTALLATION.md](./INSTALLATION.md)** pour les étapes clic par clic, **[COMPATIBILITY.md](./COMPATIBILITY.md)** pour le détail des plateformes, limites et dépendances optionnelles, et **[PUBLISHING.md](./PUBLISHING.md)** pour publier une release GitHub.

## Démarrage

```powershell
cd c:\Users\addup\Accessible
npm install
npm run dev
```

Ouvrir l'URL affichée (souvent `http://localhost:5173`).

## Scripts

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production (SPA statique) |
| `npm run preview` | Prévisualiser le build |
| `npm run check` | Vérification TypeScript / Svelte |
| `npm run smoke` | check + build + validation packs + artefacts |
| `npm run i18n:coverage` | Rapport couverture packs bilingues |
| `npm run validate:lang-packs` | Vérifie JSON packs (3 dossiers) + NSIS |
| `npm run build:lang-packs` | Exporte `static/`, `installer/`, `src-tauri/resources/` |
| `npm run tauri:dev` | Application desktop (dev) |
| `npm run tauri:build` | Installateurs (plateforme courante) |
| `npm run tauri:build:nsis` | Installateur NSIS Windows seul |
| `npm run tauri:build:linux` | deb + AppImage (Linux) |
| `npm run tauri:build:macos` | dmg + app (macOS Apple Silicon) |

Guide builds : **[BUILD.md](./BUILD.md)** · Installation : **[INSTALLATION.md](./INSTALLATION.md)** · Compatibilité : **[COMPATIBILITY.md](./COMPATIBILITY.md)** · Publication : **[PUBLISHING.md](./PUBLISHING.md)** · Mode portable : **[PORTABLE.md](./PORTABLE.md)**

## Application desktop (Tauri)

```powershell
npm run tauri:dev      # développement
npm run tauri:build    # installateurs MSI + NSIS (Windows)
```

Installateurs produits dans `src-tauri\target\release\bundle\`.

## Moteurs optionnels (Tauri)

L’app fonctionne sans eux. Pour OCR, correction et TTS local hors ligne, installer séparément :

| Moteur | Rôle |
|--------|------|
| Tesseract + langue `fra` | OCR image (`/lire`) |
| Hunspell + `fr_FR` | Orthographe (`/ecrire`) |
| Grammalecte CLI | Grammaire (`/ecrire`) |
| Piper + `PIPER_MODEL*` | Synthèse vocale locale (fr + langues prioritaires) |
| eSpeak NG | Synthèse vocale locale (légère) |

Guide complet : **[EXTERNAL_DEPENDENCIES.md](./EXTERNAL_DEPENDENCIES.md)** (installation Windows, variables d’environnement, dépannage).  
Checklist de test rapide : **[ENGINE_SETUP.md](./ENGINE_SETUP.md)**.  
Langues prioritaires (bilingue) : **[I18N_PRIORITIES.md](./I18N_PRIORITIES.md)**.

## Stack

SvelteKit (SPA) · TypeScript strict · CSS variables · Tauri 2

## Documentation

Voir [PROJECT_STATUS.md](./PROJECT_STATUS.md), [TASKS.md](./TASKS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [EXTERNAL_DEPENDENCIES.md](./EXTERNAL_DEPENDENCIES.md), [BUILD.md](./BUILD.md), [INSTALLATION.md](./INSTALLATION.md), [COMPATIBILITY.md](./COMPATIBILITY.md), [PUBLISHING.md](./PUBLISHING.md), [PRIVACY.md](./PRIVACY.md), [SECURITY.md](./SECURITY.md), [SUPPORT.md](./SUPPORT.md), [CHANGELOG.md](./CHANGELOG.md), [PORTABLE.md](./PORTABLE.md).
