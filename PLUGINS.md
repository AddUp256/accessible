# Plugins — Accessible (Phase 42)

Architecture minimale pour extensions internes (pas de chargement dynamique externe en V3).

## Structure

```
src/lib/plugins/
├── index.ts              # bootstrapPlugins(), exports
├── registry.ts           # registerPlugin, getPluginActions
└── examples/
    └── demo-word-count.ts
```

## API

```typescript
import type { AccessiblePlugin } from '$lib/plugins';

export const myPlugin: AccessiblePlugin = {
  id: 'my-plugin',
  name: 'Mon extension',
  description: '…',
  version: '1.0.0',
  register(ctx) {
    ctx.registerAction({
      id: 'my_action',
      href: '/lire',
      label: '…',
      description: '…',
      zone: 'lire'
    });
  }
};
```

Enregistrement dans `src/lib/plugins/index.ts` via `registerPlugin(myPlugin)`.

## Exemple livré

**`demo-word-count`** — ajoute une action tableau de bord « Compteur mots (plugin démo) » pointant vers `/ecrire`.

## Limites V3

- Pas de sandbox ni de chargement `.js` externe
- Une seule extension d’API : `registerAction` (tableau de bord)
- Extensions futures possibles : panneaux module, export providers, hooks FALC
