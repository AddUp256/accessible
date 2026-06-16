/** R?le : Service de stockage local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
export const ENVELOPE_FORMAT = 'accessible-encrypted-v1' as const;
export const PBKDF2_ITERATIONS = 310_000;

export interface EncryptedEnvelope {
	format: typeof ENVELOPE_FORMAT;
	kdf: 'PBKDF2-SHA256';
	iterations: number;
	salt: string;
	nonce: string;
	ciphertext: string;
}

export type StorageEncryptionState = 'empty' | 'plain' | 'encrypted';
