/** R?le : Service de transcription m?dia : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import type { TranscriptSegment } from './types';

function pad(value: number, length: number): string {
	return String(value).padStart(length, '0');
}

export function formatSrtTimestamp(ms: number): string {
	const hours = Math.floor(ms / 3_600_000);
	const minutes = Math.floor((ms % 3_600_000) / 60_000);
	const seconds = Math.floor((ms % 60_000) / 1000);
	const millis = ms % 1000;
	return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)},${pad(millis, 3)}`;
}

export function segmentsToSrt(segments: TranscriptSegment[]): string {
	return segments
		.map((segment, index) => {
			const start = formatSrtTimestamp(segment.startMs);
			const end = formatSrtTimestamp(Math.max(segment.endMs, segment.startMs + 1));
			return `${index + 1}\n${start} --> ${end}\n${segment.text.trim()}\n`;
		})
		.join('\n')
		.trim();
}

export function segmentsToPlainText(segments: TranscriptSegment[]): string {
	return segments
		.map((segment) => segment.text.trim())
		.filter(Boolean)
		.join('\n')
		.trim();
}

export function parseSrt(content: string): TranscriptSegment[] {
	const normalized = content.replace(/\r\n/g, '\n').trim();
	if (!normalized) return [];

	const segments: TranscriptSegment[] = [];

	for (const block of normalized.split(/\n\n+/)) {
		const lines = block.split('\n').filter(Boolean);
		if (lines.length < 2) continue;

		const timingLine = lines.find((line) => line.includes('-->'));
		if (!timingLine) continue;

		const [startRaw, endRaw] = timingLine.split('-->').map((part) => part.trim());
		const startMs = parseSrtTimestamp(startRaw);
		const endMs = parseSrtTimestamp(endRaw);
		if (startMs === null || endMs === null) continue;

		const timingIndex = lines.indexOf(timingLine);
		const text = lines.slice(timingIndex + 1).join(' ').trim();
		if (!text) continue;

		segments.push({ startMs, endMs, text });
	}

	return segments;
}

function parseSrtTimestamp(value: string): number | null {
	const match = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/.exec(value.trim());
	if (!match) return null;

	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	const seconds = Number(match[3]);
	const millis = Number(match[4]);

	return hours * 3_600_000 + minutes * 60_000 + seconds * 1000 + millis;
}

export function findActiveSegment(
	segments: TranscriptSegment[],
	currentTimeMs: number
): TranscriptSegment | null {
	return (
		segments.find(
			(segment) => currentTimeMs >= segment.startMs && currentTimeMs <= segment.endMs
		) ?? null
	);
}

export function importTranscriptContent(content: string): {
	text: string;
	segments: TranscriptSegment[];
} {
	const trimmed = content.trim();
	if (!trimmed) {
		return { text: '', segments: [] };
	}

	if (trimmed.includes('-->')) {
		const segments = parseSrt(trimmed);
		return {
			text: segmentsToPlainText(segments) || trimmed,
			segments
		};
	}

	return { text: trimmed, segments: [] };
}
