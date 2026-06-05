import { invoke } from '@tauri-apps/api/core';

import type { TranscriptSegment } from './types';

export interface WhisperStatusDto {
	available: boolean;
	reason?: string | null;
}

export interface TranscriptionResultDto {
	text: string;
	segments: TranscriptSegment[];
}

export async function tauriGetWhisperStatus(): Promise<WhisperStatusDto> {
	return invoke<WhisperStatusDto>('get_whisper_status');
}

export async function tauriIsWhisperAvailable(): Promise<boolean> {
	return invoke<boolean>('is_whisper_available');
}

export async function tauriTranscribeMediaFile(
	mediaBytes: number[],
	filename: string,
	lang = 'fr'
): Promise<TranscriptionResultDto> {
	return invoke<TranscriptionResultDto>('transcribe_media_file', {
		mediaBytes,
		filename,
		lang
	});
}
