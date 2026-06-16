/** R?le : Logique m?tier de compr?hension des consignes : fonctions pures ou r?gles locales testables hors interface. */
export type InstructionStepKind = 'numbered' | 'bullet' | 'sentence' | 'line';

export interface InstructionStep {
	index: number;
	text: string;
	kind: InstructionStepKind;
}

function stripListPrefix(line: string): string {
	return line.replace(/^\s*(?:\d+[\.\)\-]|[-*•–])\s*/, '').trim();
}

function detectLineKind(line: string): InstructionStepKind {
	if (/^\s*\d+[\.\)\-]/.test(line)) return 'numbered';
	if (/^\s*[-*•–]/.test(line)) return 'bullet';
	return 'line';
}

export function breakdownInstruction(text: string): InstructionStep[] {
	const trimmed = text.trim();
	if (!trimmed) return [];

	const lines = trimmed.split(/\n+/).map((line) => line.trim()).filter(Boolean);

	if (lines.length === 1) {
		return trimmed
			.split(/(?<=[.!?…])\s+/)
			.map((part) => part.trim())
			.filter(Boolean)
			.map((part, index) => ({
				index: index + 1,
				text: part,
				kind: 'sentence' as const
			}));
	}

	return lines.map((line, index) => ({
		index: index + 1,
		text: stripListPrefix(line),
		kind: detectLineKind(line)
	}));
}

export function extractDeadlineHint(text: string): string | null {
	const deadlinePatterns = [
		/(?:date limite|rendre|remettre|pour le|avant le|deadline)\s*[:\s].{3,80}/i,
		/(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)[^.!?\n]{0,60}/i,
		/\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)[^.!?\n]{0,40}/i
	];

	for (const pattern of deadlinePatterns) {
		const match = text.match(pattern);
		if (match) return match[0].trim();
	}

	return null;
}

export function stepKindLabel(kind: InstructionStepKind): string {
	switch (kind) {
		case 'numbered':
			return 'Étape numérotée';
		case 'bullet':
			return 'Point à traiter';
		case 'sentence':
			return 'Phrase';
		default:
			return 'Ligne';
	}
}
