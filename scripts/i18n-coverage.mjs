/** R?le : Script de maintenance I18n Coverage pour automatiser les t?ches du d?p?t. */
/**
 * Rapport de couverture des packs explicites (interface bilingue).
 * Utilisation: npm run i18n:coverage
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const i18n = join(root, 'src/lib/i18n');

/** Compte les clés 'foo.bar': dans le bloc objet d'un export const NAME. */
function countKeysInObjectLiteral(source, exportName) {
	const marker = `export const ${exportName}`;
	const start = source.indexOf(marker);
	if (start < 0) return 0;
	const brace = source.indexOf('{', start);
	if (brace < 0) return 0;
	let depth = 0;
	let end = brace;
	for (let i = brace; i < source.length; i++) {
		const ch = source[i];
		if (ch === '{') depth++;
		else if (ch === '}') {
			depth--;
			if (depth === 0) {
				end = i + 1;
				break;
			}
		}
	}
	const block = source.slice(brace, end);
	return (block.match(/^\s+'[^']+':/gm) ?? []).length;
}

const uiKeysBlock = readFileSync(join(i18n, 'ui-translations.ts'), 'utf8').match(
	/UI_KEYS = \[([\s\S]*?)\] as const/
)?.[1];
const uiKeys = (uiKeysBlock?.match(/'[^']+'/g) ?? []).length;

const priority = ['es', 'ar', 'zh', 'it', 'pt', 'de', 'hi', 'uk', 'tr'];
const exportSuffix = (lang) => lang.toUpperCase();

const panelBilingualPath = join(i18n, 'locale-packs/panels/bilingual-priority.ts');

console.log(`UI_KEYS (nav + réglages de base): ${uiKeys}\n`);
console.log('Langue | module | extended | panel | config | bilingual×4 | note');
console.log('-------|--------|----------|-------|--------|-------------|-----');

for (const lang of priority) {
	const modPath = join(i18n, `locale-packs/modules/${lang}.ts`);
	let mod = 0;
	if (existsSync(modPath)) {
		mod = countKeysInObjectLiteral(readFileSync(modPath, 'utf8'), `MODULE_${exportSuffix(lang)}`);
	}
	const suffix = exportSuffix(lang);
	const extPath = join(i18n, `locale-packs/extended/${lang}.ts`);
	const panPath = join(i18n, `locale-packs/panels/${lang}.ts`);
	const cfgPath = join(i18n, `locale-packs/config/${lang}.ts`);
	const ext = existsSync(extPath)
		? countKeysInObjectLiteral(readFileSync(extPath, 'utf8'), `EXTENDED_${suffix}`)
		: 0;
	const pan = existsSync(panPath)
		? countKeysInObjectLiteral(readFileSync(panPath, 'utf8'), `PANEL_${suffix}`)
		: 0;
	const cfg = existsSync(cfgPath)
		? countKeysInObjectLiteral(readFileSync(cfgPath, 'utf8'), `CONFIG_${suffix}`)
		: 0;
	let bi = 0;
	if (existsSync(panPath)) {
		const panSrc = readFileSync(panPath, 'utf8');
		if (panSrc.includes("'settings.bilingual.note'")) bi = 4;
	} else if (existsSync(panelBilingualPath)) {
		const src = readFileSync(panelBilingualPath, 'utf8');
		const marker = `BILINGUAL_PANEL_${suffix}`;
		if (src.includes(marker)) {
			bi = countKeysInObjectLiteral(src, marker);
		}
	}
	const navPack = existsSync(join(i18n, `ui-${lang}-pack.ts`));
	const note =
		lang === 'es' || (navPack && ext > 0 && pan > 0 && cfg > 0)
			? `pack complet (+ nav UI_${lang.toUpperCase()}_PACK)`
			: ext > 0 && pan > 0 && cfg > 0
				? 'modules + panels + extended + config'
				: 'modules + dyn.* + install (partiel)';
	console.log(
		`${lang.padEnd(6)} | ${String(mod).padStart(6)} | ${String(ext).padStart(8)} | ${String(pan).padStart(5)} | ${String(cfg).padStart(6)} | ${String(bi).padStart(11)} | ${note}`
	);
}

const CARD_IDS = [
	'help',
	'pause',
	'quiet',
	'repeat',
	'write',
	'tired',
	'overwhelmed',
	'ok',
	'not_understand',
	'more_time',
	'clarify',
	'hello',
	'thanks',
	'wait'
];
const cardSrc = readFileSync(join(i18n, 'card-translations.ts'), 'utf8');

function countCaaCards(lang) {
	const marker = `\t${lang}: {`;
	const start = cardSrc.indexOf(marker);
	if (start < 0) return 0;
	const brace = cardSrc.indexOf('{', start);
	let depth = 0;
	let end = brace;
	for (let i = brace; i < cardSrc.length; i++) {
		const ch = cardSrc[i];
		if (ch === '{') depth++;
		else if (ch === '}') {
			depth--;
			if (depth === 0) {
				end = i + 1;
				break;
			}
		}
	}
	const block = cardSrc.slice(brace, end);
	return CARD_IDS.filter((id) => block.includes(`${id}: { label`)).length;
}

console.log('\nCartes CAA intégrées (label + message):');
for (const lang of priority) {
	const n = countCaaCards(lang);
	const ok = n === CARD_IDS.length ? 'ok' : `manque ${CARD_IDS.length - n}`;
	console.log(`  ${lang}: ${n}/${CARD_IDS.length} ${ok}`);
}

console.log('\nMessages dynamiques (dyn.*) : ui-dynamic-locales.ts (157 clés / langue prioritaire)');
