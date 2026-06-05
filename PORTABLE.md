# Mode portable — Accessible

Le **mode portable** stocke profil et données **à côté de l’exécutable**, dans un dossier `data/`. Utile pour clé USB, poste partagé ou absence de droits d’écriture dans `%APPDATA%`.

---

## Activation

### Option A — Dossier `data/` existant

1. Créez un dossier `data` **dans le même répertoire que `Accessible.exe`** (ou lancez l’app depuis un répertoire contenant `./data/`).
2. Relancez Accessible.
3. Paramètres → Stockage : le mode portable apparaît **actif**.

### Option B — Bouton dans l’app

1. Paramètres → Stockage (mode expert).
2. Cliquez **Activer le mode portable (dossier ./data/)**.
3. **Relancez** l’application pour que tous les chemins soient pris en compte.

---

## Contenu du dossier `data/`

| Fichier | Rôle |
|---------|------|
| `profile.json` | Profil actif (réglages, modules) |
| `accessible.db` | Base SQLite (multi-profils, notes, flashcards…) |

En mode portable, **profil JSON et SQLite** utilisent le même dossier `data/`.

---

## Distribution USB / zip portable

Structure recommandée :

```
AccessiblePortable/
├── Accessible.exe
├── data/                 ← créé au premier lancement ou à l’activation
│   ├── profile.json
│   └── accessible.db
└── README.txt            ← rappel : ne pas supprimer data/
```

1. Copiez le contenu de `src-tauri/target/release/` (exe + DLL) **ou** l’installateur extrait.
2. Créez `data/` vide **ou** laissez l’app le créer.
3. Lancez `Accessible.exe` depuis ce dossier.

> **Windows :** les installateurs MSI/NSIS standard installent dans Program Files. Pour un vrai portable, préférez copier le binaire depuis `target/release/` ou un zip documenté.

---

## Limites

- **Moteurs externes** (Tesseract, Piper, Whisper, etc.) restent des binaires **système** ou dans le PATH — ils ne sont pas copiés dans `data/`.
- **Chiffrement profil :** fonctionne ; conservez `data/` et le mot de passe ensemble.
- **Multi-profils :** supportés via SQLite dans `data/accessible.db`.

---

## Désactivation

Supprimez le dossier `data/` à côté de l’exe (après export JSON si besoin) et relancez : Accessible repasse sur `%APPDATA%/Accessible/`.
