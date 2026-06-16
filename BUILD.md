# Builds multi-plateforme — Accessible

Accessible utilise **Tauri 2**. Les installateurs sont produits **sur la plateforme cible** (cross-compilation limitée).

---

## Prérequis communs

```powershell
npm install
npm run check
npm run build:lang-packs
npm run build
npm run validate:lang-packs   # optionnel avant release
npm run smoke                 # check + build + validation complète
```

- **Rust** stable (rustup)
- **Node.js** LTS
- Dépendances Tauri : [https://v2.tauri.app/start/prerequisites/](https://v2.tauri.app/start/prerequisites/)

---

## Windows (MSI + NSIS)

```powershell
npm run tauri:build
# ou
npm run tauri:build:windows
```

Sortie : `src-tauri/target/release/bundle/` (`msi/`, `nsis/`).

### Packs de langue (interface bilingue)

```powershell
npm run build:lang-packs
```

Génère `static/lang-packs/`, `installer/lang-packs/` et `src-tauri/resources/lang-packs/`.

Pour une distribution Windows complète, publiez en priorité l’installateur Tauri NSIS. Il intègre les packs de langue et la personnalisation des modules complémentaires installables sans passage manuel par PowerShell.

L’installateur NSIS personnalisé (`src-tauri/nsis/installer.nsi`) propose après l’accueil :

- **Installation complète** ou **packs de langue uniquement**
- Cases à cocher pour les 9 langues prioritaires
- Raccourci de bureau
- Modules complémentaires Windows : Tesseract, Hunspell, Grammalecte, FFmpeg/whisper.cpp, Piper et eSpeak NG

Configuration : `tauri.conf.json` → `bundle.windows.nsis`.

---

## Linux (deb + AppImage)

Sur une machine Linux x64 :

```bash
npm install
npm run tauri:build:linux
```

Sortie : `src-tauri/target/release/bundle/deb/`, `appimage/`.

Prérequis typiques (Ubuntu/Debian) :

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

---

## macOS (dmg + app)

Sur macOS (Intel ou Apple Silicon) :

```bash
npm install
npm run tauri:build:macos        # Apple Silicon (aarch64)
npm run tauri:build:macos-intel  # Intel (x86_64)
```

Sortie : `src-tauri/target/release/bundle/dmg/`, `macos/`.

---

## Cibles configurées

`src-tauri/tauri.conf.json` → `bundle.targets` :

| Plateforme | Formats |
|------------|---------|
| Windows | MSI, NSIS |
| Linux | deb, AppImage |
| macOS | dmg, app |

---

## Mode portable

Voir **[PORTABLE.md](./PORTABLE.md)** — dossier `./data/` à côté de l’exécutable.

---

## CI GitHub Actions

Deux workflows sont fournis :

- `.github/workflows/ci.yml` : vérifie `npm ci` et `npm run smoke` sur les pushes et pull requests.
- `.github/workflows/release.yml` : construit les artefacts desktop quand un tag `v*.*.*` est poussé, ou via lancement manuel.
- `.github/workflows/pages.yml` : publie la version navigateur sur GitHub Pages à chaque push sur `main`.

Pour tester localement le build GitHub Pages :

```bash
GITHUB_PAGES=true npm run build
```

Pour déclencher une release :

```powershell
git tag v0.1.0
git push origin v0.1.0
```

La release GitHub est créée en brouillon et marquée pre-release. Elle contient :

| Plateforme | Runner | Artefacts |
|------------|--------|-----------|
| Windows x64 | `windows-latest` | `.exe` NSIS, `.msi` |
| Linux x64 | `ubuntu-22.04` | `.deb`, AppImage |
| macOS Apple Silicon | `macos-14` | `.dmg`, `.app` |
| macOS Intel | `macos-15-intel` | `.dmg`, `.app` |

Les premiers artefacts macOS utilisent une signature ad-hoc si aucun secret Apple n'est configuré. Pour une distribution publique sans avertissement système, ajouter une signature Windows et une signature/notarisation Apple.

Voir aussi **[COMPATIBILITY.md](./COMPATIBILITY.md)** et **[PUBLISHING.md](./PUBLISHING.md)**.
