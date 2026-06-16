/** R?le : Service de stockage local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
let sessionKey: CryptoKey | null = null;
let sessionSalt: Uint8Array | null = null;

export function isSessionUnlocked(): boolean {
	return sessionKey !== null;
}

export function getSessionKey(): CryptoKey | null {
	return sessionKey;
}

export function getSessionSalt(): Uint8Array | null {
	return sessionSalt;
}

export function setSessionKey(key: CryptoKey, salt: Uint8Array): void {
	sessionKey = key;
	sessionSalt = new Uint8Array(salt);
}

export function clearSessionKey(): void {
	sessionKey = null;
	sessionSalt = null;
}
