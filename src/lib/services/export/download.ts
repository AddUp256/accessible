/** Téléchargement côté navigateur — aucun serveur distant. */
export function downloadTextFile(content: string, filename: string, mimeType = 'application/json;charset=utf-8') {
	const blob = new Blob([content], { type: mimeType });
	downloadBlob(blob, filename);
}

export function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.rel = 'noopener';
	anchor.click();
	URL.revokeObjectURL(url);
}

export function exportFilename(prefix: string, extension: string): string {
	const date = new Date().toISOString().slice(0, 10);
	return `accessible-${prefix}-${date}.${extension}`;
}
