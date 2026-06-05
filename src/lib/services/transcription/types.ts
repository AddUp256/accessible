export interface TranscriptSegment {
	startMs: number;
	endMs: number;
	text: string;
}

export interface TranscriptionSuccess {
	ok: true;
	text: string;
	segments: TranscriptSegment[];
}

export interface TranscriptionFailure {
	ok: false;
	error: string;
}

export type TranscriptionResult = TranscriptionSuccess | TranscriptionFailure;

export interface TranscriptionOptions {
	lang?: string;
}

export interface TranscriptionService {
	isAvailable(): boolean;
	getUnavailableReason(): string | null;
	transcribe(file: File, options?: TranscriptionOptions): Promise<TranscriptionResult>;
}
