/** R?le : Script de maintenance Regression Tests pour automatiser les t?ches du d?p?t. */
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
	Object.defineProperty(globalThis, 'crypto', {
		value: webcrypto,
		configurable: true
	});
}

if (!globalThis.btoa) {
	Object.defineProperty(globalThis, 'btoa', {
		value: (value: string) => Buffer.from(value, 'binary').toString('base64'),
		configurable: true
	});
}

if (!globalThis.atob) {
	Object.defineProperty(globalThis, 'atob', {
		value: (value: string) => Buffer.from(value, 'base64').toString('binary'),
		configurable: true
	});
}

const {
	createSalt,
	decryptWithKey,
	deriveKey,
	deriveKeyFromEnvelope,
	encryptWithKey,
	getEnvelopeSalt,
	verifyPassword
} = await import('../src/lib/services/storage/encryption/crypto.ts');

const { clearSessionKey, getSessionKey, getSessionSalt, setSessionKey } = await import(
	'../src/lib/services/storage/encryption/session.ts'
);

const { canAutoPersistProfile } = await import('../src/lib/stores/profile-persistence.ts');
const { createDefaultProfile } = await import('../src/lib/services/storage/default-profile.ts');
const { migrateProfile } = await import('../src/lib/services/storage/migrate.ts');
const { EXTENDED_EN, EXTENDED_FR } = await import('../src/lib/i18n/ui-extended.ts');
const { EXTENDED_AR } = await import('../src/lib/i18n/locale-packs/extended/ar.ts');
const { EXTENDED_DE } = await import('../src/lib/i18n/locale-packs/extended/de.ts');
const { EXTENDED_ES } = await import('../src/lib/i18n/locale-packs/extended/es.ts');
const { EXTENDED_ZH } = await import('../src/lib/i18n/locale-packs/extended/zh.ts');
const { EXTENDED_IT } = await import('../src/lib/i18n/locale-packs/extended/it.ts');
const { EXTENDED_PT } = await import('../src/lib/i18n/locale-packs/extended/pt.ts');
const { EXTENDED_HI } = await import('../src/lib/i18n/locale-packs/extended/hi.ts');
const { EXTENDED_UK } = await import('../src/lib/i18n/locale-packs/extended/uk.ts');
const { EXTENDED_TR } = await import('../src/lib/i18n/locale-packs/extended/tr.ts');

const INTRO_UI_KEYS = [
	'intro.title',
	'intro.lead',
	'intro.audience',
	'intro.use',
	'intro.featuresTitle',
	'intro.feature.read',
	'intro.feature.write',
	'intro.feature.organize',
	'intro.feature.communicate',
	'intro.privacy',
	'intro.continue',
	'intro.dismiss'
] as const;

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
	return left.length === right.length && left.every((value, index) => value === right[index]);
}

async function testEncryptionSaltRoundTrip() {
	const password = 'AuditTest123!';
	const plaintext = JSON.stringify({ app: 'Accessible', regression: 'encryption-salt' });
	const salt = createSalt();
	const key = await deriveKey(password, salt);

	setSessionKey(key, salt);
	const sessionKey = getSessionKey();
	const sessionSalt = getSessionSalt();

	assert.ok(sessionKey, 'session key should be stored');
	assert.ok(sessionSalt, 'session salt should be stored');
	assert.ok(sameBytes(sessionSalt, salt), 'session salt should match the derivation salt');

	const originalFirstByte = sessionSalt[0];
	salt[0] = salt[0]! ^ 0xff;
	assert.equal(getSessionSalt()?.[0], originalFirstByte, 'session salt should be copied defensively');

	const envelope = await encryptWithKey(plaintext, sessionKey, sessionSalt);
	assert.ok(
		sameBytes(getEnvelopeSalt(envelope), sessionSalt),
		'envelope salt should be the salt used to derive the session key'
	);
	assert.equal(await verifyPassword(envelope, password), true, 'password should unlock saved envelope');

	const rederivedKey = await deriveKeyFromEnvelope(password, envelope);
	assert.equal(await decryptWithKey(envelope, rederivedKey), plaintext);

	clearSessionKey();
	assert.equal(getSessionKey(), null);
	assert.equal(getSessionSalt(), null);
}

function testHydrationPersistenceGuard() {
	assert.equal(
		canAutoPersistProfile({ persistEnabled: true, storageHydrated: false, guestMode: false }),
		false,
		'Tauri startup should not auto-save before storage hydration'
	);
	assert.equal(
		canAutoPersistProfile({ persistEnabled: true, storageHydrated: true, guestMode: true }),
		false,
		'guest mode should not persist automatically'
	);
	assert.equal(
		canAutoPersistProfile({ persistEnabled: false, storageHydrated: true, guestMode: false }),
		false,
		'disabled persistence should be respected'
	);
	assert.equal(
		canAutoPersistProfile({ persistEnabled: true, storageHydrated: true, guestMode: false }),
		true,
		'hydrated non-guest profiles should persist'
	);
}

function testFirstLaunchIntroMigration() {
	const defaultProfile = createDefaultProfile();
	assert.equal(
		defaultProfile.settings.ui.firstLaunchIntroDismissed,
		false,
		'new profiles should show the first-launch introduction'
	);

	const oldProfile = structuredClone(defaultProfile);
	delete (oldProfile.settings.ui as Partial<typeof oldProfile.settings.ui>).firstLaunchIntroDismissed;
	const migratedOldProfile = migrateProfile(oldProfile);
	assert.equal(
		migratedOldProfile.settings.ui.firstLaunchIntroDismissed,
		false,
		'older profiles should receive the first-launch introduction flag'
	);

	const dismissedProfile = structuredClone(defaultProfile);
	dismissedProfile.settings.ui.firstLaunchIntroDismissed = true;
	const migratedDismissedProfile = migrateProfile(dismissedProfile);
	assert.equal(
		migratedDismissedProfile.settings.ui.firstLaunchIntroDismissed,
		true,
		'dismissed first-launch introduction should stay dismissed after migration'
	);
}

function testFirstLaunchIntroI18nCoverage() {
	const packs = {
		fr: EXTENDED_FR,
		en: EXTENDED_EN,
		es: EXTENDED_ES,
		ar: EXTENDED_AR,
		zh: EXTENDED_ZH,
		it: EXTENDED_IT,
		pt: EXTENDED_PT,
		de: EXTENDED_DE,
		hi: EXTENDED_HI,
		uk: EXTENDED_UK,
		tr: EXTENDED_TR
	};

	for (const [lang, pack] of Object.entries(packs)) {
		for (const key of INTRO_UI_KEYS) {
			assert.equal(
				typeof pack[key] === 'string' && pack[key].trim().length > 0,
				true,
				`${lang} should define ${key}`
			);
		}
	}
}

await testEncryptionSaltRoundTrip();
testHydrationPersistenceGuard();
testFirstLaunchIntroMigration();
testFirstLaunchIntroI18nCoverage();

console.log(
	'Regression tests passed (encryption salt + hydration persistence guard + first-launch intro migration/i18n).'
);
