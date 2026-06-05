import { breakdownInstruction } from './instruction-breakdown';
import { simplifyWithFalcEngine, type FalcOptions } from './falc-engine';

export interface ExplainAlternatelyResult {
	bullets: string[];
	fullText: string;
}

/** Reformulation FALC forte en points simples — bouton « Expliquer autrement ». */
export function explainAlternately(
	text: string,
	options: Pick<FalcOptions, 'glossary' | 'useFleLexicon'> = {}
): ExplainAlternatelyResult | null {
	const trimmed = text.trim();
	if (!trimmed) return null;

	const falcOpts = {
		...options,
		level: 'strong' as const,
		useFleLexicon: options.useFleLexicon ?? true
	};

	const steps = breakdownInstruction(trimmed);
	const bullets = steps.map((step) => simplifyWithFalcEngine(step.text, falcOpts).text);

	const fullText =
		bullets.length > 1
			? bullets.map((bullet, index) => `${index + 1}. ${bullet}`).join('\n')
			: simplifyWithFalcEngine(trimmed, falcOpts).text;

	return { bullets, fullText };
}
