# Publication GitHub

Ce guide prepare une publication publique avec artefacts Windows, macOS et Linux.

## 1. Initialiser le depot

Ce dossier n'est pas encore un depot Git. Depuis `C:\Users\addup\Accessible` :

```powershell
git init
git branch -M main
git add .
git commit -m "Release Accessible 0.1.0"
```

Puis creer le depot GitHub et pousser :

```powershell
gh auth login
gh repo create accessible --public --source=. --remote=origin --push
```

Si GitHub CLI (`gh`) n'est pas installe :

1. Creer un nouveau depot vide sur GitHub, par exemple `accessible`.
2. Copier l'URL HTTPS du depot.
3. Pousser depuis ce dossier :

```powershell
git remote add origin https://github.com/<compte-ou-org>/accessible.git
git push -u origin main
```

Si le depot existe deja :

```powershell
git remote add origin https://github.com/<compte-ou-org>/accessible.git
git push -u origin main
```

## 2. Verifier les informations avant publication

Avant de rendre le depot public, completer si besoin :

- `README.md` : description, captures si disponibles, lien de support.
- `PRIVACY.md` : contact/responsable de publication.
- `SECURITY.md` et `SUPPORT.md` : canal de signalement, support et limites.
- `CHANGELOG.md` : notes de version.
- `src-tauri/Cargo.toml` et `package.json` : adapter le champ `repository` si le depot final n'est pas `AddUp256/accessible`.
- GitHub : activer "Private vulnerability reporting" si le depot public doit recevoir des signalements securite prives.

## 3. Creer une release desktop

Le workflow `.github/workflows/release.yml` demarre sur un tag `v*.*.*`.

```powershell
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions va construire :

- Windows x64 : NSIS `.exe` et MSI.
- macOS Apple Silicon : `.dmg` / `.app`.
- macOS Intel : `.dmg` / `.app`.
- Linux x64 : `.deb` et AppImage.

La release est creee en brouillon et en pre-release. Verifier les fichiers, tester les installateurs, puis publier manuellement depuis GitHub.

## 4. Publication sans tag

Il est aussi possible de lancer le workflow manuellement :

1. GitHub -> Actions -> Desktop release.
2. Run workflow.
3. Entrer `v0.1.0`.

## 5. Signature et notarisation

### Windows

Sans certificat, Windows SmartScreen peut afficher un avertissement. Pour une distribution publique large, ajouter une signature de code Windows dans le workflow ou signer les artefacts apres generation.

### macOS

Le workflow force une signature ad-hoc si aucun secret Apple n'est configure. Cela permet de generer les artefacts, mais ne remplace pas une notarisation Apple.

Pour une distribution fluide sur macOS, configurer un certificat Developer ID Application et la notarisation Apple, puis ajuster le workflow avec les secrets Apple.

Secrets typiques :

- `APPLE_SIGNING_IDENTITY`
- certificat `.p12` encode en base64, par exemple `APPLE_CERTIFICATE`
- `APPLE_CERTIFICATE_PASSWORD`
- credentials de notarisation Apple : `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`, ou API App Store Connect

### Linux

Le `.deb` et l'AppImage ne sont pas signes par defaut. Une signature GPG des AppImage peut etre ajoutee quand une cle de publication existe.

## 6. Compatibilites a annoncer

Copier la matrice de `COMPATIBILITY.md` dans la description de release. Ne pas promettre :

- Windows ARM64 tant qu'un build dedie n'est pas ajoute.
- Linux ARM tant qu'un runner ARM n'a pas ete teste.
- macOS "sans avertissement" tant que la notarisation n'est pas activee.

## 7. Checklist release

- [ ] `npm run smoke`
- [ ] `npx tauri build --no-bundle --ci` sur Windows
- [ ] depot GitHub pousse
- [ ] tag `v0.1.0` pousse
- [ ] Actions vertes pour Windows, Linux, macOS Intel, macOS Apple Silicon
- [ ] artefacts telecharges et testes
- [ ] release brouillon relue puis publiee
