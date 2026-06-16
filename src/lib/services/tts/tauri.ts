/** R?le : Service de lecture vocale : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { invoke } from '@tauri-apps/api/core';

export interface PiperStatus {
	available: boolean;
	reason: string | null;
}

export interface PiperSynthResult {
	wavPath: string;
}

export interface PiperVoice {
	id: string;
	label: string;
	lang: string;
	path: string;
	available: boolean;
}

export interface EspeakStatus {
	available: boolean;
	reason: string | null;
}

export interface EspeakSynthResult {
	wavPath: string;
}

export async function tauriGetPiperStatus(): Promise<PiperStatus> {
	return invoke<PiperStatus>('get_piper_status');
}

export async function tauriListPiperVoices(): Promise<PiperVoice[]> {
	return invoke<PiperVoice[]>('list_piper_voices_cmd');
}

export async function tauriPiperSynthesize(
	text: string,
	rate = 1,
	modelPath?: string
): Promise<PiperSynthResult> {
	return invoke<PiperSynthResult>('piper_synthesize', {
		text,
		rate,
		modelPath: modelPath?.trim() || null
	});
}

export async function tauriGetEspeakStatus(): Promise<EspeakStatus> {
	return invoke<EspeakStatus>('get_espeak_status');
}

export async function tauriEspeakSynthesize(text: string, rate = 1): Promise<EspeakSynthResult> {
	return invoke<EspeakSynthResult>('espeak_synthesize', { text, rate });
}
