import { jsPDF } from 'jspdf';
import type { AccessibleProfile } from '$lib/types/profile';
import {
	buildPDFSynthesis,
	medicalLabelsForExport,
	PDF_DISCLAIMER,
	PDF_TITLE,
	toolLabels
} from './build-synthesis';
import { downloadBlob, exportFilename } from './download';

const MARGIN = 20;
const LINE_HEIGHT = 7;
const PAGE_WIDTH = 210;

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number): number {
	const lines = doc.splitTextToSize(text, maxWidth);
	doc.text(lines, x, y);
	return y + lines.length * LINE_HEIGHT;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
	doc.setFont('helvetica', 'bold');
	doc.setFontSize(12);
	return addWrappedText(doc, title, MARGIN, y, PAGE_WIDTH - MARGIN * 2);
}

function addBody(doc: jsPDF, text: string, y: number): number {
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	return addWrappedText(doc, text, MARGIN, y, PAGE_WIDTH - MARGIN * 2);
}

function addBulletList(doc: jsPDF, items: string[], y: number): number {
	if (items.length === 0) {
		return addBody(doc, '— Aucune entrée —', y);
	}
	let cursor = y;
	for (const item of items) {
		cursor = addBody(doc, `• ${item}`, cursor);
		cursor += 2;
		if (cursor > 280) {
			doc.addPage();
			cursor = MARGIN;
		}
	}
	return cursor;
}

function ensureSpace(doc: jsPDF, y: number, needed = 20): number {
	if (y + needed > 285) {
		doc.addPage();
		return MARGIN;
	}
	return y;
}

export function downloadProfilePdf(profile: AccessibleProfile, appVersion = '0.0.1') {
	const synthesis = buildPDFSynthesis(profile, appVersion);
	const doc = new jsPDF({ unit: 'mm', format: 'a4' });

	let y = MARGIN;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(14);
	y = addWrappedText(doc, PDF_TITLE, MARGIN, y, PAGE_WIDTH - MARGIN * 2);
	y += 4;

	doc.setFont('helvetica', 'bold');
	doc.setFontSize(11);
	y = addWrappedText(doc, PDF_DISCLAIMER, MARGIN, y, PAGE_WIDTH - MARGIN * 2);
	y += 6;

	y = addBody(doc, `Date : ${synthesis.generalInfo.date}`, y);
	y = addBody(doc, `Application : Accessible v${synthesis.generalInfo.appVersion}`, y);
	y += 4;

	y = ensureSpace(doc, y);
	y = addSectionTitle(doc, 'Difficultés déclarées', y + LINE_HEIGHT);
	y = addBulletList(doc, synthesis.declaredDifficulties, y + 2);

	const medicalLabels = medicalLabelsForExport(profile);
	if (medicalLabels.length > 0) {
		y = ensureSpace(doc, y + 6);
		y = addSectionTitle(doc, 'Profils médicaux ou administratifs déclarés', y + LINE_HEIGHT);
		y += 2;
		y = addBody(
			doc,
			'Information déclarée par la personne. Accessible ne vérifie pas et ne pose pas de diagnostic.',
			y
		);
		y = addBulletList(doc, medicalLabels, y + 2);
	}

	y = ensureSpace(doc, y + 6);
	y = addSectionTitle(doc, 'Réglages utiles validés', y + LINE_HEIGHT);
	y = addBulletList(
		doc,
		synthesis.usefulSettings.map((s) => `${s.label} : ${s.value}`),
		y + 2
	);

	if (synthesis.rejectedSettings.length > 0) {
		y = ensureSpace(doc, y + 6);
		y = addSectionTitle(doc, 'Réglages refusés ou gênants', y + LINE_HEIGHT);
		y = addBulletList(
			doc,
			synthesis.rejectedSettings.map((s) => s.value),
			y + 2
		);
	}

	y = ensureSpace(doc, y + 6);
	y = addSectionTitle(doc, 'Outils activés', y + LINE_HEIGHT);
	y = addBulletList(doc, toolLabels(profile), y + 2);

	if (synthesis.specialistsToDiscuss.length > 0) {
		y = ensureSpace(doc, y + 6);
		y = addSectionTitle(doc, 'Pistes à discuter avec des professionnels', y + LINE_HEIGHT);
		y = addBulletList(doc, synthesis.specialistsToDiscuss, y + 2);
	}

	if (synthesis.accommodationsToDiscuss.length > 0) {
		y = ensureSpace(doc, y + 6);
		y = addSectionTitle(doc, 'Aménagements à discuter', y + LINE_HEIGHT);
		y = addBulletList(doc, synthesis.accommodationsToDiscuss, y + 2);
	}

	const enriched = synthesis.enrichedSections;
	if (enriched) {
		if (enriched.glossary.length > 0) {
			y = ensureSpace(doc, y + 6);
			y = addSectionTitle(doc, 'Glossaire personnel', y + LINE_HEIGHT);
			y = addBulletList(doc, enriched.glossary, y + 2);
		}

		if (enriched.communicationCards.length > 0) {
			y = ensureSpace(doc, y + 6);
			y = addSectionTitle(doc, 'Cartes de communication (aperçu)', y + LINE_HEIGHT);
			y = addBulletList(doc, enriched.communicationCards, y + 2);
		}

		if (enriched.notesSummary.length > 0) {
			y = ensureSpace(doc, y + 6);
			y = addSectionTitle(doc, 'Notes récentes', y + LINE_HEIGHT);
			y = addBulletList(doc, enriched.notesSummary, y + 2);
		}

		if (enriched.visualRoutines.length > 0) {
			y = ensureSpace(doc, y + 6);
			y = addSectionTitle(doc, 'Routines visuelles', y + LINE_HEIGHT);
			y = addBulletList(doc, enriched.visualRoutines, y + 2);
		}

		if (enriched.fleLexiconSample.length > 0) {
			y = ensureSpace(doc, y + 6);
			y = addSectionTitle(doc, 'Lexique FLE (extrait)', y + LINE_HEIGHT);
			y = addBulletList(doc, enriched.fleLexiconSample, y + 2);
		}
	}

	y = ensureSpace(doc, y + 10);
	y = addBody(
		doc,
		'Document préparatoire généré localement. Il décrit des besoins et préférences, pas un diagnostic.',
		y
	);

	const blob = doc.output('blob');
	downloadBlob(blob, exportFilename('synthese', 'pdf'));
}
