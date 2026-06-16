/** R?le : Service de export local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
export interface ZipEntry {
	path: string;
	data: Uint8Array;
	/** Le mimetype ODT doit rester non compress? au d?but de l?archive. */
	uncompressed?: boolean;
}

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let i = 0; i < 256; i += 1) {
		let crc = i;
		for (let j = 0; j < 8; j += 1) {
			crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
		}
		table[i] = crc >>> 0;
	}
	return table;
})();

function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (const byte of data) {
		crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function utf8Bytes(value: string): Uint8Array {
	return new TextEncoder().encode(value);
}

function writeUint16(view: DataView, offset: number, value: number) {
	view.setUint16(offset, value, true);
}

function writeUint32(view: DataView, offset: number, value: number) {
	view.setUint32(offset, value, true);
}

/** Minimal ZIP (store only) — sufficient for ODT and DOCX packages. */
export function createZipBlob(entries: ZipEntry[]): Blob {
	const localParts: Uint8Array[] = [];
	const centralParts: Uint8Array[] = [];
	let offset = 0;

	for (const entry of entries) {
		const pathBytes = utf8Bytes(entry.path);
		const data = entry.data;
		const checksum = crc32(data);
		const localHeader = new Uint8Array(30 + pathBytes.length);
		const localView = new DataView(localHeader.buffer);

		writeUint32(localView, 0, 0x04034b50);
		writeUint16(localView, 4, 20);
		writeUint16(localView, 6, entry.uncompressed ? 0 : 0);
		writeUint16(localView, 8, 0);
		writeUint16(localView, 10, 0);
		writeUint32(localView, 12, checksum);
		writeUint32(localView, 16, data.length);
		writeUint32(localView, 20, data.length);
		writeUint16(localView, 24, pathBytes.length);
		writeUint16(localView, 26, 0);
		localHeader.set(pathBytes, 30);

		localParts.push(localHeader, data);

		const centralHeader = new Uint8Array(46 + pathBytes.length);
		const centralView = new DataView(centralHeader.buffer);
		writeUint32(centralView, 0, 0x02014b50);
		writeUint16(centralView, 4, 20);
		writeUint16(centralView, 6, 20);
		writeUint16(centralView, 8, entry.uncompressed ? 0 : 0);
		writeUint16(centralView, 10, 0);
		writeUint16(centralView, 12, 0);
		writeUint32(centralView, 16, checksum);
		writeUint32(centralView, 20, data.length);
		writeUint32(centralView, 24, data.length);
		writeUint16(centralView, 28, pathBytes.length);
		writeUint16(centralView, 30, 0);
		writeUint16(centralView, 32, 0);
		writeUint16(centralView, 34, 0);
		writeUint16(centralView, 36, 0);
		writeUint32(centralView, 38, 0);
		writeUint32(centralView, 42, offset);
		centralHeader.set(pathBytes, 46);
		centralParts.push(centralHeader);

		offset += localHeader.length + data.length;
	}

	const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
	const centralStart = offset;
	const endRecord = new Uint8Array(22);
	const endView = new DataView(endRecord.buffer);
	writeUint32(endView, 0, 0x06054b50);
	writeUint16(endView, 4, 0);
	writeUint16(endView, 6, 0);
	writeUint16(endView, 8, entries.length);
	writeUint16(endView, 10, entries.length);
	writeUint32(endView, 12, centralSize);
	writeUint32(endView, 16, centralStart);
	writeUint16(endView, 20, 0);

	const totalSize =
		localParts.reduce((sum, part) => sum + part.length, 0) +
		centralSize +
		endRecord.length;
	const archive = new Uint8Array(totalSize);
	let cursor = 0;

	for (const part of localParts) {
		archive.set(part, cursor);
		cursor += part.length;
	}
	for (const part of centralParts) {
		archive.set(part, cursor);
		cursor += part.length;
	}
	archive.set(endRecord, cursor);

	return new Blob([archive], { type: 'application/zip' });
}
