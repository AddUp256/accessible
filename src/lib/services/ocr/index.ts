import { browser } from '$app/environment';
import { get } from 'svelte/store';

import { isTauriRuntime } from '$lib/services/storage/tauri';
import { settings } from '$lib/stores/profile';

import { tauriIsTesseractAvailable, tauriOcrExtractText } from './tauri';

import { DYNAMIC_FR } from '$lib/i18n/ui-dynamic';

import type { OcrOptions, OcrResult, OcrService, OcrSourceKind } from './types';

import { OCR_ACCEPTED_IMAGE_TYPES } from './types';

const WEB_STUB_REASON = DYNAMIC_FR['dyn.service.ocrWebStub'];
const TESSERACT_INSTALL_REASON = DYNAMIC_FR['dyn.service.ocrTesseractMissing'];
const PDF_WEB_STUB_REASON = DYNAMIC_FR['dyn.service.ocrPdfWebStub'];
const WEB_OCR_INTERNET_REASON =
	"L'OCR image du navigateur doit pouvoir charger son moteur au premier lancement. Activez Internet ou utilisez l'application installée.";

function detectSourceKind(file: File): OcrSourceKind | null {
	if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
		return 'pdf';
	}

	if (
		file.type.startsWith('image/') ||
		OCR_ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof OCR_ACCEPTED_IMAGE_TYPES)[number])
	) {
		return 'image';
	}

	const lower = file.name.toLowerCase();

	if (/\.(jpe?g|png|webp|gif|bmp|tiff?)$/.test(lower)) {
		return 'image';
	}

	return null;
}

async function prepareBrowserImageForOcr(file: File): Promise<File | Blob> {
	if (!browser || !file.type.startsWith('image/')) return file;

	try {
		const bitmap = await createImageBitmap(file);
		const targetWidth = Math.min(Math.max(bitmap.width * 2, 1400), 2600);
		const scale = Math.max(1, targetWidth / bitmap.width);
		const width = Math.round(bitmap.width * scale);
		const height = Math.round(bitmap.height * scale);
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext('2d', { willReadFrequently: true });
		if (!context) return file;

		context.fillStyle = '#ffffff';
		context.fillRect(0, 0, width, height);
		context.imageSmoothingEnabled = true;
		context.imageSmoothingQuality = 'high';
		context.drawImage(bitmap, 0, 0, width, height);
		bitmap.close();

		const image = context.getImageData(0, 0, width, height);
		const data = image.data;
		for (let index = 0; index < data.length; index += 4) {
			const gray = data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114;
			const contrasted = Math.max(0, Math.min(255, (gray - 128) * 1.2 + 128));
			data[index] = contrasted;
			data[index + 1] = contrasted;
			data[index + 2] = contrasted;
			data[index + 3] = 255;
		}
		context.putImageData(image, 0, 0);

		const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
		return blob ?? file;
	} catch {
		return file;
	}
}

class StubOcrService implements OcrService {
	isAvailable() {
		return false;
	}

	getUnavailableReason() {
		return WEB_STUB_REASON;
	}

	async extractText(file: File): Promise<OcrResult> {
		const sourceKind = detectSourceKind(file);

		if (!sourceKind) {
			return {
				ok: false,
				error: 'Format non pris en charge. Utilisez une image (JPG, PNG…) ou un PDF.'
			};
		}

		if (sourceKind === 'pdf') {
			return { ok: false, error: PDF_WEB_STUB_REASON, sourceKind: 'pdf' };
		}

		return { ok: false, error: WEB_STUB_REASON, sourceKind: 'image' };
	}
}

class WebOcrService implements OcrService {
	isAvailable() {
		return browser;
	}

	getUnavailableReason() {
		if (!browser) return WEB_STUB_REASON;
		if (get(settings).ui.internetEnabled === false) return WEB_OCR_INTERNET_REASON;
		return null;
	}

	async extractText(file: File, options: OcrOptions = {}): Promise<OcrResult> {
		const sourceKind = detectSourceKind(file);

		if (!sourceKind) {
			return {
				ok: false,
				error: 'Format non pris en charge. Utilisez une image (JPG, PNG…) ou un PDF.'
			};
		}

		if (sourceKind === 'pdf') {
			return { ok: false, error: PDF_WEB_STUB_REASON, sourceKind: 'pdf' };
		}

		if (get(settings).ui.internetEnabled === false) {
			return { ok: false, error: WEB_OCR_INTERNET_REASON, sourceKind: 'image' };
		}

		let worker: Awaited<ReturnType<(typeof import('tesseract.js'))['createWorker']>> | null = null;
		try {
			const { createWorker, PSM } = await import('tesseract.js');
			worker = await createWorker(options.lang ?? 'fra');
			await worker.setParameters({
				preserve_interword_spaces: '1',
				tessedit_pageseg_mode: PSM.SINGLE_BLOCK
			});
			const preparedFile = await prepareBrowserImageForOcr(file);
			const result = await worker.recognize(preparedFile);
			const text = result.data.text.trim();

			if (!text) {
				return {
					ok: false,
					error: "Aucun texte détecté dans l'image.",
					sourceKind
				};
			}

			return { ok: true, text, sourceKind };
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Impossible de lancer l'OCR image dans le navigateur.";
			return { ok: false, error: message, sourceKind };
		} finally {
			await worker?.terminate().catch(() => undefined);
		}
	}
}

class TauriOcrService implements OcrService {
	private tesseractReady: boolean | null = null;

	isAvailable() {
		return browser && isTauriRuntime() && this.tesseractReady !== false;
	}

	getUnavailableReason() {
		if (!browser || !isTauriRuntime()) return WEB_STUB_REASON;
		if (this.tesseractReady === false) return TESSERACT_INSTALL_REASON;
		return null;
	}

	private async ensureTesseractReady(): Promise<boolean> {
		if (this.tesseractReady !== null) return this.tesseractReady;

		this.tesseractReady = await tauriIsTesseractAvailable();
		return this.tesseractReady;
	}

	async extractText(file: File, options: OcrOptions = {}): Promise<OcrResult> {
		const sourceKind = detectSourceKind(file);

		if (!sourceKind) {
			return {
				ok: false,
				error: 'Format non pris en charge. Utilisez une image (JPG, PNG…) ou un PDF.'
			};
		}

		if (!(await this.ensureTesseractReady())) {
			return { ok: false, error: TESSERACT_INSTALL_REASON, sourceKind };
		}

		try {
			const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
			const text = await tauriOcrExtractText(bytes, file.name, options.lang ?? 'fra');
			const trimmed = text.trim();

			if (!trimmed) {
				return {
					ok: false,
					error:
						sourceKind === 'pdf'
							? 'Aucun texte détecté dans le PDF.'
							: 'Aucun texte détecté dans l\'image.',
					sourceKind
				};
			}

			return { ok: true, text: trimmed, sourceKind };
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Impossible de lire le texte dans le fichier.';
			return { ok: false, error: message, sourceKind };
		}
	}
}

function createOcrService(): OcrService {
	if (browser && isTauriRuntime()) {
		return new TauriOcrService();
	}

	if (browser) return new WebOcrService();

	return new StubOcrService();
}

/** Tesseract.js dans le navigateur, Tesseract système via Tauri, ou stub SSR. */
export const ocr: OcrService = createOcrService();

export {
	OCR_ACCEPTED_EXTENSIONS,
	OCR_ACCEPTED_IMAGE_TYPES,
	type OcrOptions,
	type OcrResult,
	type OcrService,
	type OcrSourceKind
} from './types';
