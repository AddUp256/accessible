/**
 * Génère les packs JSON pour l'installateur et l'application Tauri.
 * Usage: npx tsx scripts/export-lang-packs.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LANGUAGE_BY_CODE } from '../src/lib/i18n/languages.ts';
import { getExplicitUiPack } from '../src/lib/i18n/locale-packs/index.ts';
import { PRIORITY_LANGUAGE_CODES } from '../src/lib/i18n/priority-languages.ts';
import type { LanguagePackPayload } from '../src/lib/i18n/language-pack-types.ts';
import { LANGUAGE_PACK_FORMAT_VERSION } from '../src/lib/i18n/language-pack-types.ts';
import { DYNAMIC_LOCALE_PACKS } from '../src/lib/i18n/ui-dynamic-locales.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDirs = [
	join(root, 'static/lang-packs'),
	join(root, 'installer/lang-packs'),
	join(root, 'src-tauri/resources/lang-packs')
];

for (const dir of outDirs) {
	mkdirSync(dir, { recursive: true });
}

const manifestList: { code: string; labelFr: string; nativeName: string; file: string }[] = [];

for (const code of PRIORITY_LANGUAGE_CODES) {
	const meta = LANGUAGE_BY_CODE[code];
	const ui = getExplicitUiPack(code) ?? {};
	const dynamic = DYNAMIC_LOCALE_PACKS[code] ?? {};
	const payload: LanguagePackPayload = {
		manifest: {
			code,
			version: LANGUAGE_PACK_FORMAT_VERSION,
			labelFr: meta?.nameFr ?? code,
			nativeName: meta?.nativeName ?? code
		},
		ui,
		dynamic
	};
	const json = JSON.stringify(payload, null, 0);
	const fileName = `${code}.json`;
	for (const dir of outDirs) {
		writeFileSync(join(dir, fileName), json, 'utf8');
	}
	manifestList.push({
		code,
		labelFr: payload.manifest.labelFr,
		nativeName: payload.manifest.nativeName,
		file: fileName
	});
	console.log(`lang-pack ${code}: ui=${Object.keys(ui).length} dyn=${Object.keys(dynamic).length}`);
}

const catalog = {
	version: LANGUAGE_PACK_FORMAT_VERSION,
	packs: manifestList
};

const catalogJson = JSON.stringify(catalog, null, 2);
for (const dir of outDirs) {
	writeFileSync(join(dir, 'catalog.json'), catalogJson, 'utf8');
}

writeFileSync(join(root, 'installer/lang-packs/README.txt'), [
	'Packs de langue Accessible (interface bilingue).',
	'Ne supprimez pas catalog.json.',
	'Installez via installer/Accessible-Setup.ps1 (mode packs de langue).',
	''
].join('\r\n'), 'utf8');

console.log(`\n${manifestList.length} packs → static/, installer/, src-tauri/resources/`);
