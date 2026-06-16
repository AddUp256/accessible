/** R?le : Service de reconnaissance de texte : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { invoke } from '@tauri-apps/api/core';

export async function tauriIsTesseractAvailable(): Promise<boolean> {
	return invoke<boolean>('is_tesseract_available');
}

export async function tauriIsTesseractLanguageAvailable(lang = 'fra'): Promise<boolean> {
	return invoke<boolean>('is_tesseract_language_available', { lang });
}

export async function tauriOcrExtractText(
	imageBytes: number[],
	filename: string,
	lang = 'fra'
): Promise<string> {
	return invoke<string>('ocr_extract_text', { imageBytes, filename, lang });
}
