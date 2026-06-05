export type OcrSourceKind = 'image' | 'pdf';

export interface OcrSuccess {
	ok: true;
	text: string;
	sourceKind: OcrSourceKind;
}

export interface OcrFailure {
	ok: false;
	error: string;
	sourceKind?: OcrSourceKind;
}

export type OcrResult = OcrSuccess | OcrFailure;

export interface OcrOptions {
	lang?: string;
}

export interface OcrService {
	isAvailable(): boolean;
	getUnavailableReason(): string | null;
	extractText(file: File, options?: OcrOptions): Promise<OcrResult>;
}

export const OCR_ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/bmp',
	'image/tiff'
] as const;

export const OCR_ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.gif,.bmp,.tif,.tiff,.pdf';
