/** R?le : Service de export local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { createZipBlob } from './zip-store';
import { blocksToOdtContentXml, type DocumentBlock } from './document-content';

const ODT_MIMETYPE = 'application/vnd.oasis.opendocument.text';

const ODT_MANIFEST = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opentocument:xmlns:manifest:1.0" manifest:version="1.2">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.text"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;

const ODT_STYLES = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opentocument:xmlns:office:1.0" office:version="1.2">
  <office:styles/>
</office:document-styles>`;

const ODT_META = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opentocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opentocument:xmlns:meta:1.0" office:version="1.2">
  <office:meta><meta:generator>Accessible</meta:generator></office:meta>
</office:document-meta>`;

function textEncoder(value: string): Uint8Array {
	return new TextEncoder().encode(value);
}

export function buildOdtBlob(blocks: DocumentBlock[]): Blob {
	const contentXml = blocksToOdtContentXml(blocks);

	return createZipBlob([
		{ path: 'mimetype', data: textEncoder(ODT_MIMETYPE), uncompressed: true },
		{ path: 'META-INF/manifest.xml', data: textEncoder(ODT_MANIFEST) },
		{ path: 'content.xml', data: textEncoder(contentXml) },
		{ path: 'styles.xml', data: textEncoder(ODT_STYLES) },
		{ path: 'meta.xml', data: textEncoder(ODT_META) }
	]);
}

export function buildOdtBlobFromBlocks(blocks: DocumentBlock[]): Blob {
	return buildOdtBlob(blocks);
}
