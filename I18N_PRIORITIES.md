# Langues prioritaires — interface bilingue

Accessible affiche le **français** en ligne principale et la langue choisie en **ligne secondaire**, sans repli sur l’anglais pour les langues prioritaires.

## Ordre de priorité

| Code | Langue | Pack UI (export JSON) | `dyn.*` |
|------|--------|------------------------|---------|
| `es` | Espagnol | **632** clés (complet) | 157 |
| `ar` | Arabe | **632** | 157 |
| `zh` | Chinois (simplifié) | **632** | 157 |
| `it` | Italien | **632** | 157 |
| `pt` | Portugais (européen) | **632** | 157 |
| `de` | Allemand | **632** | 157 |
| `hi` | Hindi | **632** | 157 |
| `uk` | Ukrainien | **632** | 157 |
| `tr` | Turc | **632** | 157 |

Chaque langue prioritaire fusionne : `UI_*_PACK` (nav + raccourcis), `modules/*`, `extended/*`, `panels/*`, `config/*`. Vérifier avec `npm run i18n:coverage` et `npm run build:lang-packs`.

## Fichiers

```
src/lib/i18n/
  priority-languages.ts      # Liste et helpers
  locale-packs/
    index.ts                 # Fusion EXPLICIT_UI_PACKS
    modules/{es,de,ar,...}.ts
    extended/{es,de,ar,zh,it,pt,hi,uk,tr}.ts
    panels/{es,de,ar,zh,it,pt,hi,uk,tr}.ts
    config/{es,de,ar,zh,it,pt,hi,uk,tr}.ts
  ui-dynamic-locales.ts      # dyn.* pour les 9 langues
  ui-es-pack.ts              # Nav + raccourcis (es)
  ui-de-pack.ts              # Nav + raccourcis (de)
  ui-ar-pack.ts              # Nav + raccourcis (ar)
  ui-zh-pack.ts              # Nav + raccourcis (zh)
  ui-pt-pack.ts              # Nav + raccourcis (pt)
  ui-it-pack.ts              # Nav + raccourcis (it)
  ui-hi-pack.ts              # Nav + raccourcis (hi)
  ui-uk-pack.ts              # Nav + raccourcis (uk)
  ui-tr-pack.ts              # Nav + raccourcis (tr)
```

## Ajouter ou compléter une langue

1. Copier `locale-packs/modules/es.ts` → `locale-packs/modules/xx.ts`, traduire.
2. Enregistrer dans `locale-packs/modules/index.ts`.
3. Pour une couverture type espagnol : ajouter `extended/xx.ts`, `panels/xx.ts`, `config/xx.ts` et les référencer dans les `index.ts` respectifs.
4. Vérifier les clés `dyn.*` dans `ui-dynamic-locales.ts`.
5. Lancer `npm run i18n:coverage`.

## Sélecteur Paramètres

Les langues prioritaires apparaissent en premier (« Langues prioritaires »), puis « Autres langues » (`languages.ts`).

## Installation locale (packs JSON)

L’application de base **n’embarque pas** toutes les langues dans l’exe. Les packs sont des fichiers `{code}.json` dans le dossier `lang-packs/` à côté de l’exécutable.

| Étape | Action |
|--------|--------|
| Build | `npm run build:lang-packs` puis `npm run tauri:build` ou `npm run tauri:build:nsis` |
| 1ʳᵉ install | Installateur NSIS : **Installation complète** → cocher les langues |
| Ajout langue | Relancer l’installateur NSIS → **Packs de langue uniquement** (ou `Accessible-Setup.ps1`) |

Détails : **[installer/README.md](./installer/README.md)**.

Dans l’app : Paramètres → Interface bilingue n’affiche que les **langues installées** (prioritaires). L’anglais reste toujours disponible via le cœur de l’app.

## Cartes CAA intégrées

14 cartes (`help`, `pause`, …) : traductions dans `card-translations.ts`, affichage bilingue via `getCardTranslation` / `resolveBuiltInCard`. Vérifier : `npm run i18n:coverage` (section Cartes CAA).

## Prochaines étapes suggérées

- Tests manuels : voir **TEST_PLAN.md** phase 51.
- Validation automatisée : `npm run validate:lang-packs` (inclus dans `npm run smoke`).
