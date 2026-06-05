import { invoke } from '@tauri-apps/api/core';

export interface DictationStatus {
	available: boolean;
	reason: string | null;
}

export async function tauriGetDictationStatus(): Promise<DictationStatus> {
	return invoke<DictationStatus>('get_dictation_status');
}

export async function tauriDictationRecognizeOnce(lang?: string): Promise<string> {
	return invoke<string>('dictation_recognize_once', { lang: lang ?? null });
}
