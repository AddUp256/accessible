/** R?le : Service de export local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { escapeXml } from './xml-escape';

export interface DocumentBlock {
	type: 'heading' | 'paragraph' | 'bullet';
	level?: number;
	text: string;
}

export function noteToBlocks(note: {
	title: string;
	body: string;
	format?: 'simple' | 'cornell';
	cornellCue?: string;
	cornellSummary?: string;
}): DocumentBlock[] {
	const blocks: DocumentBlock[] = [{ type: 'heading', level: 1, text: note.title || 'Note' }];

	if (note.format === 'cornell') {
		if (note.cornellCue?.trim()) {
			blocks.push({ type: 'heading', level: 2, text: 'Mots-clés / questions' });
			blocks.push({ type: 'paragraph', text: note.cornellCue.trim() });
		}
		if (note.body.trim()) {
			blocks.push({ type: 'heading', level: 2, text: 'Notes' });
			for (const line of note.body.trim().split('\n')) {
				if (line.trim()) blocks.push({ type: 'paragraph', text: line.trim() });
			}
		}
		if (note.cornellSummary?.trim()) {
			blocks.push({ type: 'heading', level: 2, text: 'Résumé' });
			blocks.push({ type: 'paragraph', text: note.cornellSummary.trim() });
		}
		return blocks;
	}

	for (const line of note.body.trim().split('\n')) {
		blocks.push({ type: 'paragraph', text: line.trim() || ' ' });
	}

	return blocks;
}

export function mindMapToBlocks(map: { title: string; nodes: { id: string; label: string; parentId: string | null }[] }): DocumentBlock[] {
	const blocks: DocumentBlock[] = [{ type: 'heading', level: 1, text: map.title || 'Carte mentale' }];
	const byParent = new Map<string | null, typeof map.nodes>();

	for (const node of map.nodes) {
		const siblings = byParent.get(node.parentId) ?? [];
		siblings.push(node);
		byParent.set(node.parentId, siblings);
	}

	function walk(parentId: string | null, depth: number) {
		const children = byParent.get(parentId) ?? [];
		for (const child of children) {
			blocks.push({ type: 'bullet', level: depth + 1, text: child.label });
			walk(child.id, depth + 1);
		}
	}

	walk(null, 0);
	return blocks;
}

export function synthesisToBlocks(input: {
	title: string;
	disclaimer: string;
	sections: { heading: string; lines: string[] }[];
}): DocumentBlock[] {
	const blocks: DocumentBlock[] = [
		{ type: 'heading', level: 1, text: input.title },
		{ type: 'paragraph', text: input.disclaimer }
	];

	for (const section of input.sections) {
		blocks.push({ type: 'heading', level: 2, text: section.heading });
		for (const line of section.lines) {
			blocks.push({ type: 'paragraph', text: line });
		}
	}

	return blocks;
}

export function blocksToPlainText(blocks: DocumentBlock[]): string {
	return blocks
		.map((block) => {
			if (block.type === 'bullet') {
				return `${'  '.repeat(Math.max(0, (block.level ?? 1) - 1))}- ${block.text}`;
			}
			if (block.type === 'heading') {
				return block.text;
			}
			return block.text;
		})
		.join('\n');
}

function odtParagraph(text: string, style?: 'Heading' | 'Text' | 'List') {
	const escaped = escapeXml(text);
	if (style === 'Heading') {
		return `<text:h text:style-name="Heading" text:outline-level="1">${escaped}</text:h>`;
	}
	if (style === 'List') {
		return `<text:list-item><text:p text:style-name="List">${escaped}</text:p></text:list-item>`;
	}
	return `<text:p text:style-name="Text">${escaped}</text:p>`;
}

export function blocksToOdtContentXml(blocks: DocumentBlock[]): string {
	const bodyParts: string[] = [];
	let listOpen = false;

	for (const block of blocks) {
		if (block.type === 'bullet') {
			if (!listOpen) {
				bodyParts.push('<text:list text:style-name="List">');
				listOpen = true;
			}
			bodyParts.push(odtParagraph(block.text, 'List'));
			continue;
		}

		if (listOpen) {
			bodyParts.push('</text:list>');
			listOpen = false;
		}

		if (block.type === 'heading') {
			bodyParts.push(
				`<text:h text:style-name="Heading" text:outline-level="${block.level ?? 1}">${escapeXml(block.text)}</text:h>`
			);
		} else {
			bodyParts.push(odtParagraph(block.text, 'Text'));
		}
	}

	if (listOpen) bodyParts.push('</text:list>');

	return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opentocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opentocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opentocument:xmlns:style:1.0" office:version="1.2">
  <office:automatic-styles>
    <style:style style:name="Text" style:family="paragraph"><style:text-properties fo:font-size="12pt" xmlns:fo="urn:oasis:names:tc:opentocument:xmlns:xsl-fo-compatible:1.0"/></style:style>
    <style:style style:name="Heading" style:family="paragraph"><style:text-properties fo:font-size="16pt" fo:font-weight="bold" xmlns:fo="urn:oasis:names:tc:opentocument:xmlns:xsl-fo-compatible:1.0"/></style:style>
    <style:style style:name="List" style:family="paragraph"><style:text-properties fo:font-size="12pt" xmlns:fo="urn:oasis:names:tc:opentocument:xmlns:xsl-fo-compatible:1.0"/></style:style>
  </office:automatic-styles>
  <office:body><office:text>${bodyParts.join('')}</office:text></office:body>
</office:document-content>`;
}

function docxParagraph(text: string, style?: 'Heading1' | 'Heading2' | 'ListParagraph' | 'Normal') {
	const escaped = escapeXml(text);
	const styleXml = style ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : '';
	return `<w:p>${styleXml}<w:r><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
}

export function blocksToDocxDocumentXml(blocks: DocumentBlock[]): string {
	const bodyParts = blocks.map((block) => {
		if (block.type === 'heading') {
			return docxParagraph(block.text, block.level === 1 ? 'Heading1' : 'Heading2');
		}
		if (block.type === 'bullet') {
			return docxParagraph(block.text, 'ListParagraph');
		}
		return docxParagraph(block.text, 'Normal');
	});

	return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${bodyParts.join('')}<w:sectPr/></w:body>
</w:document>`;
}
