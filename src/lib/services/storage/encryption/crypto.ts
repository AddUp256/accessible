import { ENVELOPE_FORMAT, PBKDF2_ITERATIONS, type EncryptedEnvelope } from './types';

const SALT_BYTES = 16;
const NONCE_BYTES = 12;

function bytesToBase64(bytes: Uint8Array): string {
	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]!);
	}
	return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export function randomBytes(length: number): Uint8Array {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return bytes;
}

function asBufferSource(bytes: Uint8Array): ArrayBuffer {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	return copy.buffer;
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveKey']
	);

	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: asBufferSource(salt),
			iterations: PBKDF2_ITERATIONS,
			hash: 'SHA-256'
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

export async function encryptWithKey(
	plaintext: string,
	key: CryptoKey,
	salt: Uint8Array
): Promise<EncryptedEnvelope> {
	const nonce = randomBytes(NONCE_BYTES);
	const ciphertext = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: asBufferSource(nonce) },
		key,
		new TextEncoder().encode(plaintext)
	);

	return {
		format: ENVELOPE_FORMAT,
		kdf: 'PBKDF2-SHA256',
		iterations: PBKDF2_ITERATIONS,
		salt: bytesToBase64(salt),
		nonce: bytesToBase64(nonce),
		ciphertext: bytesToBase64(new Uint8Array(ciphertext))
	};
}

export async function decryptWithKey(
	envelope: EncryptedEnvelope,
	key: CryptoKey
): Promise<string> {
	const plaintext = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: asBufferSource(base64ToBytes(envelope.nonce)) },
		key,
		asBufferSource(base64ToBytes(envelope.ciphertext))
	);
	return new TextDecoder().decode(plaintext);
}

export async function deriveKeyFromEnvelope(
	password: string,
	envelope: EncryptedEnvelope
): Promise<CryptoKey> {
	return deriveKey(password, getEnvelopeSalt(envelope));
}

export function getEnvelopeSalt(envelope: EncryptedEnvelope): Uint8Array {
	return base64ToBytes(envelope.salt);
}

export function createSalt(): Uint8Array {
	return randomBytes(SALT_BYTES);
}

export function envelopeToJson(envelope: EncryptedEnvelope): string {
	return JSON.stringify(envelope);
}

export function parseEnvelopeJson(raw: string): unknown {
	return JSON.parse(raw) as unknown;
}

export function isEncryptedEnvelope(value: unknown): value is EncryptedEnvelope {
	if (typeof value !== 'object' || value === null) return false;
	const record = value as Record<string, unknown>;
	return (
		record.format === ENVELOPE_FORMAT &&
		record.kdf === 'PBKDF2-SHA256' &&
		typeof record.iterations === 'number' &&
		typeof record.salt === 'string' &&
		typeof record.nonce === 'string' &&
		typeof record.ciphertext === 'string'
	);
}

export async function verifyPassword(envelope: EncryptedEnvelope, password: string): Promise<boolean> {
	try {
		const key = await deriveKeyFromEnvelope(password, envelope);
		await decryptWithKey(envelope, key);
		return true;
	} catch {
		return false;
	}
}
