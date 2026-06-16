/** R?le : Service de export local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import type { AccessibleProfile, FlashcardDeck, MindMap, Note } from '$lib/types/profile';

import { buildAnkiCsvBytes } from './anki';
import { buildDocxBlob } from './docx';
import {
	blocksToPlainText,
	mindMapToBlocks,
	noteToBlocks,
	synthesisToBlocks
} from './document-content';
import { downloadBlob, downloadTextFile, exportFilename } from './download';
import { buildOdtBlob } from './odt';
import { buildPDFSynthesis, PDF_DISCLAIMER, PDF_TITLE } from './build-synthesis';

function safeFilename(value: string): string {
	return value
		.trim()
		.replace(/[^\w\s-àâäéèêëïîôùûüç.-]/gi, '')
		.replace(/\s+/g, '-')
		.slice(0, 48) || 'export';
}

export function downloadDeckAnkiCsv(deck: FlashcardDeck) {
	const bytes = buildAnkiCsvBytes(deck);
	downloadBlob(
		new Blob([new Uint8Array(bytes)], { type: 'text/csv;charset=utf-8' }),
		exportFilename(safeFilename(deck.title), 'csv')
	);
}

export function downloadNoteOdt(note: Note) {
	const blocks = noteToBlocks(note);
	downloadBlob(
		buildOdtBlob(blocks),
		exportFilename(safeFilename(note.title || 'note'), 'odt')
	);
}

export function downloadNoteDocx(note: Note) {
	const blocks = noteToBlocks(note);
	downloadBlob(
		buildDocxBlob(blocks),
		exportFilename(safeFilename(note.title || 'note'), 'docx')
	);
}

export function downloadMindMapOdt(map: MindMap) {
	const blocks = mindMapToBlocks(map);
	downloadBlob(
		buildOdtBlob(blocks),
		exportFilename(safeFilename(map.title || 'carte-mentale'), 'odt')
	);
}

export function downloadMindMapDocx(map: MindMap) {
	const blocks = mindMapToBlocks(map);
	downloadBlob(
		buildDocxBlob(blocks),
		exportFilename(safeFilename(map.title || 'carte-mentale'), 'docx')
	);
}

export function downloadMindMapOutline(map: MindMap) {
	const text = blocksToPlainText(mindMapToBlocks(map));
	downloadTextFile(text, exportFilename(safeFilename(map.title || 'carte-mentale'), 'txt'), 'text/plain;charset=utf-8');
}

export function downloadProfileOdt(profile: AccessibleProfile) {
	const synthesis = buildPDFSynthesis(profile);
	const blocks = synthesisToBlocks({
		title: PDF_TITLE,
		disclaimer: PDF_DISCLAIMER,
		sections: [
			{ heading: 'Réglages utiles', lines: synthesis.usefulSettings.map((item) => `${item.label} : ${item.value}`) },
			{
				heading: 'Aménagements suggérés',
				lines: synthesis.accommodationsToDiscuss
			},
			{
				heading: 'Recommandations',
				lines: synthesis.specialistsToDiscuss
			}
		]
	});

	downloadBlob(buildOdtBlob(blocks), exportFilename('synthese', 'odt'));
}

export function downloadProfileDocx(profile: AccessibleProfile) {
	const synthesis = buildPDFSynthesis(profile);
	const blocks = synthesisToBlocks({
		title: PDF_TITLE,
		disclaimer: PDF_DISCLAIMER,
		sections: [
			{ heading: 'Réglages utiles', lines: synthesis.usefulSettings.map((item) => `${item.label} : ${item.value}`) },
			{
				heading: 'Aménagements suggérés',
				lines: synthesis.accommodationsToDiscuss
			},
			{
				heading: 'Recommandations',
				lines: synthesis.specialistsToDiscuss
			}
		]
	});

	downloadBlob(buildDocxBlob(blocks), exportFilename('synthese', 'docx'));
}
