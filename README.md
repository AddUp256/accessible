# Accessible

Accessible est une application locale et une version web statique destinées à aider une personne, une équipe pédagogique ou un service d'appui à tester des aménagements numériques concrets : lecture, écriture, organisation du travail, compréhension des consignes, communication, notes et mémorisation.

Accessible ne pose pas de diagnostic médical, psychologique ou pédagogique. L'application sert à repérer des besoins fonctionnels, à essayer des réglages, à produire une synthèse exploitable et à préparer un dialogue avec les personnes concernées.

Version web publique : <https://addup256.github.io/accessible/>
Dernière release desktop : <https://github.com/AddUp256/accessible/releases/latest>

## À qui s'adresse ce projet ?

### Ingénierie pédagogique universitaire

Accessible peut servir de support de médiation pour :

- identifier les obstacles concrets rencontrés dans les activités universitaires courantes ;
- tester des adaptations de documents, consignes, supports de cours, notes et révisions ;
- produire une synthèse des préférences et besoins fonctionnels sans formuler de diagnostic ;
- préparer des recommandations reproductibles dans Word, LibreOffice, navigateur, messagerie, LMS ou environnement de travail institutionnel ;
- distinguer ce qui relève d'un réglage individuel, d'une adaptation de support ou d'une orientation vers un service compétent.

### Équipes informatiques et DSI

Accessible est conçu comme une application locale-first :

- aucune authentification n'est nécessaire ;
- aucun serveur applicatif n'est requis pour l'usage local ;
- les données utilisateur restent sur l'appareil ou dans le stockage du navigateur ;
- la version web est une application statique publiée par GitHub Pages ;
- la version desktop repose sur Tauri 2 et ajoute les capacités locales : stockage fichier/SQLite, moteurs optionnels, ouverture de dossiers, détection locale.

Les dépendances avancées comme Tesseract, Hunspell, Grammalecte, Piper, eSpeak, FFmpeg ou whisper.cpp sont optionnelles et documentées. Elles ne sont pas indispensables au premier test fonctionnel.

### Gouvernance universitaire

Le projet peut être étudié comme prototype d'outil d'accessibilité numérique et d'accompagnement des usages. Les points à examiner avant déploiement sont :

- cadrage non diagnostique et articulation avec les services handicap, santé, scolarité, pédagogie et numérique ;
- conditions de support, maintenance, sécurité et responsabilité ;
- conformité RGPD et doctrine de conservation des données locales ;
- politique de distribution, signature des installateurs, validation antivirus et homologation poste de travail ;
- séparation entre code open source, contenus éditoriaux et usages commerciaux interdits sans autorisation.

## Ce que fait Accessible

| Domaine | Fonctions principales | Exemples d'usages |
| --- | --- | --- |
| Lire | Police, taille, interligne, fond, largeur de ligne, lecture vocale, OCR | Supports longs, PDF, fatigue visuelle, besoin d'audio |
| Écrire | Éditeur simple, relecture vocale, correction, phrases longues, prédiction de mots | Orthographe, relecture, fatigue d'écriture, réduction de frappe |
| Organiser | Checklists, routines, minuteur, kanban, cartes mentales | Planification, démarrage de tâche, étapes de travail |
| Comprendre | Découpage et reformulation de consignes | Consignes longues, implicites ou multiples |
| Communiquer | Cartes, messages préparés, pictogrammes ARASAAC | Communication alternative ou appui en situation de surcharge |
| Notes | Notes simples, format Cornell, export Markdown | Cours, réunions, révisions |
| Mémoriser | Flashcards, révision espacée, export CSV Anki | Révisions et apprentissages actifs |
| Profil | Synthèse exportable JSON, PDF, ODT, DOCX | Transmission à un référent, préparation de rendez-vous |

## Ce que Accessible ne fait pas

- Accessible ne remplace pas une évaluation professionnelle.
- Accessible ne déduit pas un trouble, une pathologie ou un droit à aménagement.
- Accessible ne transmet pas les données personnelles à un serveur applicatif.
- Accessible ne garantit pas la compatibilité avec toutes les politiques de poste de travail sans validation locale.
- Accessible n'est pas encore un produit institutionnel signé, notarise et supporté comme un logiciel commercial.

## Versions disponibles

### Version web

La version web est utile pour tester rapidement les interfaces et les réglages de base :

<https://addup256.github.io/accessible/>

Limites de la version web :

- certaines fonctions locales dépendent des autorisations du navigateur ;
- les moteurs externes installés sur l'ordinateur ne sont pas tous accessibles depuis le navigateur ;
- le stockage dépend du navigateur et du profil utilisateur.

### Version desktop

Les installateurs et archives sont publiés dans GitHub Releases :

<https://github.com/AddUp256/accessible/releases/latest>

| Système | Fichier conseillé | Remarques |
| --- | --- | --- |
| Windows 10/11 x64 | `Accessible_*_windows_x64-setup.exe` ou `.msi` | NSIS pour usage individuel, MSI pour déploiement administré |
| macOS Apple Silicon | `Accessible_*_darwin_aarch64.app.tar.gz` | Non notarise tant qu'aucun certificat Apple n'est configure |
| macOS Intel | `Accessible_*_darwin_x64.app.tar.gz` | Non notarise tant qu'aucun certificat Apple n'est configure |
| Linux x64 | `.deb` ou `.AppImage` | Debian/Ubuntu récents conseillés |

Les premiers installateurs peuvent afficher des avertissements Windows SmartScreen ou macOS Gatekeeper tant que la signature de code et la notarisation ne sont pas mises en place.

Sur Windows, l’installateur NSIS propose une personnalisation des modules complémentaires : Tesseract, Hunspell, Grammalecte, FFmpeg/whisper.cpp, Piper et eSpeak NG peuvent être installés ou configurés depuis l’assistant, sans commande manuelle.

### GitHub Packages

Le dépôt publie aussi un package npm GitHub Packages à partir de `main`. Ce package sert de paquet source versionné pour audit, archivage et intégration technique. Il ne remplace pas les installateurs utilisateur, qui restent dans GitHub Releases.

Package prévu : `@addup256/accessible`
Registre : `https://npm.pkg.github.com`

Pour l'installer dans un contexte technique autorisé :

```bash
npm config set @addup256:registry https://npm.pkg.github.com
npm install @addup256/accessible
```

## Données personnelles et RGPD

Accessible applique une logique de minimisation :

- pas de compte utilisateur ;
- pas de télémétrie intégrée ;
- pas de serveur applicatif Accessible ;
- profil, notes, cartes, exports et réglages stockés localement ;
- export volontaire par l'utilisateur en JSON, PDF, ODT, DOCX ou Markdown selon les modules ;
- mode invité et options de suppression locale.

Points d'attention pour une université :

- définir qui accompagne l'utilisateur dans l'interprétation de la synthèse ;
- préciser les règles internes de conservation si une synthèse est déposée dans un SI universitaire ;
- vérifier les modules optionnels installés sur les postes gérés ;
- documenter le support de premier niveau et la procédure de suppression des données locales.

Voir aussi [PRIVACY.md](./PRIVACY.md), [SECURITY.md](./SECURITY.md) et [SUPPORT.md](./SUPPORT.md).

## Cadre juridique et usage commercial

Le code logiciel est publié sous licence MIT lorsque cette licence s'applique explicitement au code source.

Sauf autorisation écrite, préalable, expresse et spécifique d'Atelier Eden, toute reproduction, adaptation, diffusion, intégration, extraction, revente, mise à disposition ou exploitation du contenu éditorial, pédagogique, graphique, documentaire ou méthodologique d'Accessible à des fins commerciales, directes ou indirectes, est interdite.

Toute utilisation non autorisée pourra donner lieu à une demande de retrait, de réparation du préjudice subi et, le cas échéant, à des poursuites judiciaires.

Contact éditeur : Atelier Eden, contact@atelier-eden.pro. Adresse postale et représentant légal à compléter avant publication juridique.

## Démarrage développeur

Prérequis :

- Node.js LTS ;
- npm ;
- Rust stable ;
- dépendances système Tauri selon la plateforme.

```powershell
cd C:\Users\addup\Accessible
npm install
npm run dev
```

Serveur local par défaut :

<http://127.0.0.1:5173/>

Application desktop en développement :

```powershell
npm run tauri:dev
```

Build web :

```powershell
npm run build
```

Build Windows NSIS :

```powershell
npm run tauri:build:nsis
```

## Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement web |
| `npm run build` | Build statique de production |
| `npm run preview` | Prévisualisation du build |
| `npm run check` | Vérification Svelte et TypeScript |
| `npm run test:regression` | Tests de régression applicatifs |
| `npm run smoke` | Check complet : Svelte, tests, build, langues, artefacts |
| `npm run i18n:coverage` | Couverture i18n |
| `npm run validate:lang-packs` | Validation des packs de langue |
| `npm run tauri:dev` | Application desktop en mode développement |
| `npm run tauri:build` | Build desktop plateforme courante |
| `npm run tauri:build:nsis` | Installateur Windows NSIS |

## Moteurs optionnels

Accessible fonctionne sans moteurs externes. Les modules ci-dessous améliorent les fonctions locales dans la version desktop :

| Moteur | Rôle |
| --- | --- |
| Tesseract + `fra.traineddata` | OCR local image/PDF |
| Hunspell + dictionnaires `fr_FR` | Correction orthographique |
| Grammalecte CLI/Serveur | Correction grammaticale française |
| FFmpeg | Préparation audio/vidéo |
| whisper.cpp | Transcription locale |
| Piper | Voix locale de meilleure qualité |
| eSpeak NG | Voix locale légère |

Sous Windows, l’installateur `.exe` propose ces modules comme options d’installation. Les commandes visibles dans `Paramètres > Installation et dépendances` servent surtout de référence technique pour les postes gérés ou les dépannages.

Voir [EXTERNAL_DEPENDENCIES.md](./EXTERNAL_DEPENDENCIES.md) et [ENGINE_SETUP.md](./ENGINE_SETUP.md).

## Documentation du dépôt

| Document | Utilité |
| --- | --- |
| [INSTALLATION.md](./INSTALLATION.md) | Installation utilisateur |
| [COMPATIBILITY.md](./COMPATIBILITY.md) | Compatibilités et limites |
| [BUILD.md](./BUILD.md) | Build local et CI |
| [PUBLISHING.md](./PUBLISHING.md) | Publication GitHub, Releases et Packages |
| [PROJECT_STATUS.md](./PROJECT_STATUS.md) | État du projet |
| [AUDIT_CODEBASE.md](./AUDIT_CODEBASE.md) | Audit des zones isolées ou partielles |
| [DATA_MODEL.md](./DATA_MODEL.md) | Modèle de données |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architecture technique |
| [PRIVACY.md](./PRIVACY.md) | Vie privée et RGPD |
| [SECURITY.md](./SECURITY.md) | Sécurité |
| [SUPPORT.md](./SUPPORT.md) | Support |
| [CHANGELOG.md](./CHANGELOG.md) | Historique |

## État recommandé avant expérimentation institutionnelle

Avant une expérimentation universitaire réelle, il est recommandé de :

1. valider le cadrage avec les services compétents ;
2. relire les mentions légales et RGPD avec le DPO ou le service juridique ;
3. signer les installateurs Windows et notariser macOS ;
4. définir un canal de support ;
5. tester les moteurs optionnels sur un poste géré ;
6. documenter le périmètre de conservation des exports produits par les utilisateurs ;
7. réaliser un test d'accessibilité et d'utilisabilité avec des personnes concernées.
