import { browser } from '$app/environment';

import { isTauriRuntime } from '$lib/services/storage/tauri';

import { DYNAMIC_FR } from '$lib/i18n/ui-dynamic';

import { tauriGetWhisperStatus, tauriTranscribeMediaFile } from './tauri';

import type {
	TranscriptionOptions,
	TranscriptionResult,
	TranscriptionService
} from './types';

const WEB_STUB_REASON = DYNAMIC_FR['dyn.service.transcriptionWebStub'];
const WHISPER_INSTALL_REASON = DYNAMIC_FR['dyn.service.whisperCliMissing'];

class StubTranscriptionService implements TranscriptionService {
	isAvailable() {
		return false;
	}

	getUnavailableReason() {
		return WEB_STUB_REASON;
	}

	async transcribe(_file: File, _options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
		return { ok: false, error: WEB_STUB_REASON };
	}
}

class TauriTranscriptionService implements TranscriptionService {
	private whisperReady: boolean | null = null;
	private unavailableReason: string | null = null;

	isAvailable() {
		return browser && isTauriRuntime() && this.whisperReady === true;
	}

	getUnavailableReason() {
		if (!browser || !isTauriRuntime()) return WEB_STUB_REASON;
		if (this.whisperReady === false) {
			return this.unavailableReason ?? WHISPER_INSTALL_REASON;
		}
		return null;
	}

	private async ensureWhisperReady(): Promise<boolean> {
		if (this.whisperReady !== null) return this.whisperReady;

		const status = await tauriGetWhisperStatus();
		this.whisperReady = status.available;
		this.unavailableReason = status.reason ?? WHISPER_INSTALL_REASON;
		return this.whisperReady;
	}

	async transcribe(file: File, options: TranscriptionOptions = {}): Promise<TranscriptionResult> {
		if (!(await this.ensureWhisperReady())) {
			return {
				ok: false,
				error: this.getUnavailableReason() ?? WHISPER_INSTALL_REASON
			};
		}

		try {
			const bytes = Array.from(new Uint8Array(await file.arrayBuffer()));
			const result = await tauriTranscribeMediaFile(bytes, file.name, options.lang ?? 'fr');
			const text = result.text.trim();

			if (!text) {
				return { ok: false, error: 'Aucune parole détectée dans ce fichier.' };
			}

			return {
				ok: true,
				text,
				segments: result.segments ?? []
			};
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Impossible de transcrire ce fichier.';
			return { ok: false, error: message };
		}
	}
}

function createTranscriptionService(): TranscriptionService {
	if (browser && isTauriRuntime()) {
		return new TauriTranscriptionService();
	}
	return new StubTranscriptionService();
}

/** Whisper via Tauri ; stub explicite en navigateur. */
export const transcription: TranscriptionService = createTranscriptionService();

export type {
	TranscriptSegment,
	TranscriptionOptions,
	TranscriptionResult,
	TranscriptionService
} from './types';

export {
	findActiveSegment,
	formatSrtTimestamp,
	importTranscriptContent,
	parseSrt,
	segmentsToPlainText,
	segmentsToSrt
} from './srt';
