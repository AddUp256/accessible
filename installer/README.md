# Installateur Windows — Accessible

## Contenu du dossier de distribution

Après `npm run tauri:build` et `npm run build:lang-packs`, préparez un ZIP ou un média USB avec :

```
Accessible-Setup.ps1          ← ce script
lang-packs/
  catalog.json
  es.json
  ar.json
  zh.json
  …
Accessible_0.0.1_x64-setup.exe   ← installateur Tauri (NSIS ou MSI)
```

L’application **de base** (exe + WebView) est installée par le setup Tauri. Les **traductions bilingues** sont des fichiers JSON copiés dans `{Installation}\lang-packs\`.

## Première installation (installateur NSIS intégré — recommandé)

L’installateur Windows généré par `npm run tauri:build` (ou `npm run tauri:build:nsis` pour NSIS seul) affiche, après l’écran d’accueil :

1. **Type d’installation** : complète ou **packs de langue uniquement** (libellés FR/EN — sélecteur de langue NSIS au démarrage si activé)
2. **Langues à installer** : cases à cocher (es, ar, zh, it, pt, de, hi, uk, tr)

Seuls les packs cochés sont conservés dans `{Installation}\lang-packs\`.

## Alternative : script PowerShell

1. Clic droit sur `Accessible-Setup.ps1` → **Exécuter avec PowerShell**.
2. Choisir **1 — Installation complète** ou **2 — Packs de langue uniquement**.
3. Sélectionner les langues.
4. Ouvrir **Paramètres** (la liste des langues installées se met à jour au chargement) ou redémarrer l’app.

Comportement aligné sur l’installateur NSIS :
- **Packs seuls** : ajoute les JSON choisis sans supprimer les packs déjà présents.
- **Installation complète** : ne conserve que les langues cochées (supprime les autres `.json` du dossier `lang-packs`).

## Ligne de commande

```powershell
# Installation complète + espagnol et allemand
.\Accessible-Setup.ps1 -Languages es,de -InstallerPath ".\Accessible_0.0.1_x64-setup.exe"

# Packs seulement
.\Accessible-Setup.ps1 -LangPacksOnly -Languages ar,zh
```

## Générer les packs

À la racine du projet :

```powershell
npm run build:lang-packs
```

Copiez ensuite `installer/lang-packs/` sur le média d’installation.

## Dépannage

| Problème | Piste |
|----------|--------|
| « catalog.json introuvable » | Exécutez `npm run build:lang-packs` avant de copier le dossier. |
| « Accessible n'est pas installé » | Passez par le mode 1 ou installez le `.exe` Tauri manuellement. |
| Langue absente dans l’app | Vérifiez `%InstallDir%\lang-packs\es.json` et redémarrez l’app. |

Voir aussi [I18N_PRIORITIES.md](../I18N_PRIORITIES.md) et [BUILD.md](../BUILD.md).
