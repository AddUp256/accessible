export type TTSEngine = 'auto' | 'web' | 'piper' | 'espeak';

export interface TTSOptions {
	rate?: number;
	lang?: string;
	engine?: TTSEngine;
	/** Web Speech voiceURI — prioritaire si défini. */
	voiceUri?: string;
	onStart?: () => void;
	onEnd?: () => void;
	onError?: (message: string) => void;
}
export interface TTSService {
	isAvailable(): boolean;
	getUnavailableReason(): string | null;
	getEngineStatus?(): {
		web: boolean;
		piper: boolean;
		piperReason: string | null;
		espeak: boolean;
		espeakReason: string | null;
	};
	refreshEngineStatus?(): Promise<void>;
	/** @deprecated use refreshEngineStatus */
	refreshPiperStatus?(): Promise<void>;
	speak(text: string, options?: TTSOptions): boolean;
	stop(): void;
	getIsSpeaking(): boolean;
}

export const TTS_DEFAULT_RATE = 1;
export const TTS_MIN_RATE = 0.5;
export const TTS_MAX_RATE = 2;
