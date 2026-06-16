#!/usr/bin/env node
/** R?le : Script de maintenance Validate Lang Packs pour automatiser les t?ches du d?p?t. */
/**
 * Valide les packs JSON (installateur + static + ressources Tauri).
 * Utilisation: npm run validate:lang-packs
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRIORITY = ['es', 'ar', 'zh', 'it', 'pt', 'de', 'hi', 'uk', 'tr'];
const MIN_UI_KEYS = 620;
const errors = [];

function assert(condition, message) {
	if (!condition) errors.push(message);
}

function readJson(relativePath) {
	const full = join(root, relativePath);
	if (!existsSync(full)) {
		errors.push(`Missing file: ${relativePath}`);
		return null;
	}
	try {
		return JSON.parse(readFileSync(full, 'utf8'));
	} catch {
		errors.push(`Invalid JSON: ${relativePath}`);
		return null;
	}
}

function validatePackDir(label, dir) {
	for (const code of PRIORITY) {
		const rel = `${dir}/${code}.json`;
		const payload = readJson(rel);
		if (!payload) continue;
		assert(payload.manifest?.code === code, `${label}/${code}.json: manifest.code mismatch`);
		const uiCount = Object.keys(payload.ui ?? {}).length;
		assert(
			uiCount >= MIN_UI_KEYS,
			`${label}/${code}.json: ui keys=${uiCount} (expected >= ${MIN_UI_KEYS})`
		);
		const hint = payload.ui?.['mod.read.piperVoiceHint'] ?? '';
		assert(
			typeof hint === 'string' && hint.includes('PIPER_MODEL'),
			`${label}/${code}.json: mod.read.piperVoiceHint missing or outdated`
		);
	}
}

for (const dir of ['static/lang-packs', 'installer/lang-packs', 'src-tauri/resources/lang-packs']) {
	validatePackDir(dir, dir);
}

const catalog = readJson('static/lang-packs/catalog.json');
if (catalog) {
	const codes = new Set((catalog.packs ?? []).map((p) => p.code));
	for (const code of PRIORITY) {
		assert(codes.has(code), `catalog.json: missing pack entry for ${code}`);
	}
}

const nshPath = 'src-tauri/nsis/lang-pack-installer.nsh';
if (existsSync(join(root, nshPath))) {
	const nsh = readFileSync(join(root, nshPath), 'utf8');
	assert(
		nsh.includes('LangString accessibleLangModeTitle'),
		`${nshPath}: bilingual LangString blocks missing`
	);
	assert(
		nsh.includes('$(accessibleLangSelectTitle)'),
		`${nshPath}: LangString references not wired in UI`
	);
} else {
	errors.push(`Missing ${nshPath}`);
}

if (errors.length > 0) {
	console.error('Lang pack validation failed:\n');
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}

console.log(
	`Lang pack validation passed (${PRIORITY.length} packs × 3 dirs, catalog, NSIS i18n).`
);
