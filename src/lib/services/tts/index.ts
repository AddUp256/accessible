import { convertFileSrc } from '@tauri-apps/api/core';

import { browser } from '$app/environment';
import { get } from 'svelte/store';

import { isTauriRuntime } from '$lib/services/storage/tauri';
import { settings } from '$lib/stores/profile';



import { DYNAMIC_FR } from '$lib/i18n/ui-dynamic';



import {

	tauriEspeakSynthesize,

	tauriGetEspeakStatus,

	tauriGetPiperStatus,

	tauriPiperSynthesize

} from './tauri';

import type { TTSOptions, TTSEngine, TTSService } from './types';
import { prepareTextForSpeech } from './prepare-text';



const STUB_REASON = DYNAMIC_FR['dyn.service.ttsStub'];

const PIPER_STUB_REASON = DYNAMIC_FR['dyn.service.ttsPiperStub'];

const ESPEAK_STUB_REASON = DYNAMIC_FR['dyn.service.ttsEspeakStub'];



class StubTTSService implements TTSService {

	isAvailable() {

		return false;

	}



	getUnavailableReason() {

		return STUB_REASON;

	}



	getEngineStatus() {

		return {

			web: false,

			piper: false,

			piperReason: PIPER_STUB_REASON,

			espeak: false,

			espeakReason: ESPEAK_STUB_REASON

		};

	}



	speak(_text: string, options?: TTSOptions) {

		options?.onError?.(STUB_REASON);

		return false;

	}



	stop() {}



	getIsSpeaking() {

		return false;

	}

}



class WebSpeechTTSService implements TTSService {

	private utterance: SpeechSynthesisUtterance | null = null;



	isAvailable() {

		return browser && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

	}



	getUnavailableReason() {

		if (!browser) return STUB_REASON;

		if (!this.isAvailable()) return STUB_REASON;

		return null;

	}



	getEngineStatus() {

		return {

			web: this.isAvailable(),

			piper: false,

			piperReason: PIPER_STUB_REASON,

			espeak: false,

			espeakReason: ESPEAK_STUB_REASON

		};

	}



	speak(text: string, options: TTSOptions = {}) {

		const trimmed = text.trim();

		if (!trimmed) {

			options.onError?.('Aucun texte à lire.');

			return false;

		}



		if (!this.isAvailable()) {

			options.onError?.(this.getUnavailableReason() ?? STUB_REASON);

			return false;

		}



		this.stop();



		const utterance = new SpeechSynthesisUtterance(prepareTextForSpeech(trimmed));

		utterance.lang = options.lang ?? 'fr-FR';

		utterance.rate = options.rate ?? 1;

		if (options.voiceUri && browser && 'speechSynthesis' in window) {
			const voice = speechSynthesis.getVoices().find((v) => v.voiceURI === options.voiceUri);
			if (voice) utterance.voice = voice;
		}



		utterance.onstart = () => options.onStart?.();

		utterance.onend = () => {

			this.utterance = null;

			options.onEnd?.();

		};

		utterance.onerror = () => {

			this.utterance = null;

			options.onError?.('La lecture vocale a été interrompue.');

		};



		this.utterance = utterance;

		speechSynthesis.speak(utterance);

		return true;

	}



	stop() {

		if (!browser || !('speechSynthesis' in window)) return;

		speechSynthesis.cancel();

		this.utterance = null;

	}



	getIsSpeaking() {

		if (!browser || !('speechSynthesis' in window)) return false;

		return speechSynthesis.speaking;

	}

}



type LocalEngine = 'piper' | 'espeak';



export class TauriTTSService implements TTSService {

	private web = new WebSpeechTTSService();

	private audio: HTMLAudioElement | null = null;

	private piperReady: boolean | null = null;

	private piperReason: string | null = PIPER_STUB_REASON;

	private espeakReady: boolean | null = null;

	private espeakReason: string | null = ESPEAK_STUB_REASON;

	private speaking = false;



	isAvailable() {

		return this.web.isAvailable() || this.piperReady === true || this.espeakReady === true;

	}



	getUnavailableReason() {

		if (this.web.isAvailable()) return null;

		if (this.piperReady === true || this.espeakReady === true) return null;

		return this.piperReason ?? this.espeakReason ?? STUB_REASON;

	}



	getEngineStatus() {

		return {

			web: this.web.isAvailable(),

			piper: this.piperReady === true,

			piperReason: this.piperReason,

			espeak: this.espeakReady === true,

			espeakReason: this.espeakReason

		};

	}



	async refreshEngineStatus(): Promise<void> {

		if (!browser || !isTauriRuntime()) return;

		const [piper, espeak] = await Promise.all([tauriGetPiperStatus(), tauriGetEspeakStatus()]);

		this.piperReady = piper.available;

		this.piperReason = piper.reason;

		this.espeakReady = espeak.available;

		this.espeakReason = espeak.reason;

	}



	async refreshPiperStatus(): Promise<void> {

		await this.refreshEngineStatus();

	}



	private resolveLocalEngine(engine: TTSEngine | undefined): LocalEngine | null {

		if (engine === 'piper') return this.piperReady ? 'piper' : null;

		if (engine === 'espeak') return this.espeakReady ? 'espeak' : null;

		if (engine === 'web') return null;

		if (this.piperReady) return 'piper';

		if (this.espeakReady) return 'espeak';

		return null;

	}



	speak(text: string, options: TTSOptions = {}) {

		const trimmed = text.trim();

		if (!trimmed) {

			options.onError?.('Aucun texte à lire.');

			return false;

		}



		const localEngine = this.resolveLocalEngine(options.engine);

		if (localEngine) {

			void this.speakWithLocalEngine(localEngine, trimmed, options);

			return true;

		}



		if (options.engine === 'piper') {

			options.onError?.(this.piperReason ?? PIPER_STUB_REASON);

			return false;

		}

		if (options.engine === 'espeak') {

			options.onError?.(this.espeakReason ?? ESPEAK_STUB_REASON);

			return false;

		}



		return this.web.speak(trimmed, options);

	}



	private async speakWithLocalEngine(localEngine: LocalEngine, text: string, options: TTSOptions) {

		this.stop();

		try {

			if (this.piperReady === null || this.espeakReady === null) {

				await this.refreshEngineStatus();

			}



			const spoken = prepareTextForSpeech(text);

			const result =

				localEngine === 'piper'

					? await tauriPiperSynthesize(
							spoken,
							options.rate ?? 1,
							get(settings).reading.piperModelPath || undefined
						)

					: await tauriEspeakSynthesize(spoken, options.rate ?? 1);



			const audio = new Audio(convertFileSrc(result.wavPath));

			this.audio = audio;

			this.speaking = true;



			audio.onplay = () => options.onStart?.();

			audio.onended = () => {

				this.audio = null;

				this.speaking = false;

				options.onEnd?.();

			};

			audio.onerror = () => {

				this.audio = null;

				this.speaking = false;

				options.onError?.('Impossible de lire le fichier audio synthétisé.');

			};



			await audio.play();

		} catch (error) {

			this.speaking = false;

			options.onError?.(

				error instanceof Error ? error.message : 'La synthèse vocale a échoué.'

			);

		}

	}



	stop() {

		this.web.stop();

		if (this.audio) {

			this.audio.pause();

			this.audio.currentTime = 0;

			this.audio = null;

		}

		this.speaking = false;

	}



	getIsSpeaking() {

		return this.speaking || this.web.getIsSpeaking();

	}

}



function createTTSService(): TTSService {

	if (browser && isTauriRuntime()) {

		const service = new TauriTTSService();

		void service.refreshEngineStatus();

		return service;

	}

	if (browser && 'speechSynthesis' in window) {

		return new WebSpeechTTSService();

	}

	return new StubTTSService();

}



/** Web Speech API, Piper / eSpeak NG (Tauri) ou stub explicite. */

export const tts: TTSService = createTTSService();



export { TTS_DEFAULT_RATE, TTS_MIN_RATE, TTS_MAX_RATE } from './types';

export type { TTSEngine, TTSOptions, TTSService } from './types';

