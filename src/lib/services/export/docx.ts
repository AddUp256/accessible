/** R?le : Service de export local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { createZipBlob } from './zip-store';
import { blocksToDocxDocumentXml, type DocumentBlock } from './document-content';

const DOCX_CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const DOCX_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const DOCX_DOCUMENT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

function textEncoder(value: string): Uint8Array {
	return new TextEncoder().encode(value);
}

export function buildDocxBlob(blocks: DocumentBlock[]): Blob {
	const documentXml = blocksToDocxDocumentXml(blocks);

	return createZipBlob([
		{ path: '[Content_Types].xml', data: textEncoder(DOCX_CONTENT_TYPES) },
		{ path: '_rels/.rels', data: textEncoder(DOCX_RELS) },
		{ path: 'word/document.xml', data: textEncoder(documentXml) },
		{ path: 'word/_rels/document.xml.rels', data: textEncoder(DOCX_DOCUMENT_RELS) }
	]);
}
