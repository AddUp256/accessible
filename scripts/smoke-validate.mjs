#!/usr/bin/env node
/**
 * Smoke validation after `npm run check` and `npm run build`.
 * Verifies build artifacts and critical project files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function assert(condition, message) {
	if (!condition) errors.push(message);
}

function fileExists(relativePath) {
	return fs.existsSync(path.join(root, relativePath));
}

assert(fileExists('package.json'), 'package.json missing');
assert(fileExists('src/routes/+page.svelte'), 'home route missing');
assert(fileExists('src/lib/components/accessibility/InterfaceTTS.svelte'), 'InterfaceTTS missing');
assert(fileExists('build/index.html'), 'build/index.html missing — run npm run build first');

try {
	JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
} catch {
	errors.push('package.json is not valid JSON');
}

const buildDir = path.join(root, 'build', '_app');
assert(fs.existsSync(buildDir), 'build/_app missing');

assert(
	fs.existsSync(path.join(root, 'src-tauri/nsis/lang-pack-installer.nsh')),
	'src-tauri/nsis/lang-pack-installer.nsh missing'
);
assert(
	fs.existsSync(path.join(root, 'src/lib/i18n/voice-alignment.ts')),
	'voice-alignment.ts missing'
);

const langPackDir = path.join(root, 'static/lang-packs');
assert(fs.existsSync(langPackDir), 'static/lang-packs missing — run npm run build:lang-packs');
assert(
	fs.existsSync(path.join(langPackDir, 'catalog.json')),
	'static/lang-packs/catalog.json missing'
);
for (const code of ['es', 'ar', 'zh', 'it', 'pt', 'de', 'hi', 'uk', 'tr']) {
	assert(
		fs.existsSync(path.join(langPackDir, `${code}.json`)),
		`static/lang-packs/${code}.json missing`
	);
}

if (errors.length > 0) {
	console.error('Smoke validation failed:\n');
	for (const error of errors) console.error(`  - ${error}`);
	process.exit(1);
}

console.log('Smoke validation passed (build artifacts + critical files OK).');
