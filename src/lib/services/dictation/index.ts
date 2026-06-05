import { browser } from '$app/environment';

import {
	resolveDictationLang,
	webSpeechLocaleForDictation,
	type DictationLangCode
} from '$lib/i18n/voice-alignment';

import { isTauriRuntime } from '$lib/services/storage/tauri';

import { tauriDictationRecognizeOnce, tauriGetDictationStatus } from './tauri';



export type DictationLang = DictationLangCode;



export interface DictationCapabilities {

	webSpeech: boolean;

	tauriNative: boolean;

	any: boolean;

}



function webSpeechAvailable(): boolean {

	return (

		typeof window !== 'undefined' &&

		('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

	);

}



export async function getDictationCapabilities(): Promise<DictationCapabilities> {

	const webSpeech = webSpeechAvailable();

	let tauriNative = false;



	if (browser && isTauriRuntime()) {

		try {

			const status = await tauriGetDictationStatus();

			tauriNative = status.available;

		} catch {

			tauriNative = false;

		}

	}



	return {

		webSpeech,

		tauriNative,

		any: webSpeech || tauriNative

	};

}



export { resolveDictationLang } from '$lib/i18n/voice-alignment';



export async function recognizeOnce(lang: DictationLang = 'fr'): Promise<string> {

	if (browser && isTauriRuntime()) {

		try {

			const status = await tauriGetDictationStatus();

			if (status.available) {

				return await tauriDictationRecognizeOnce(lang);

			}

		} catch (error) {

			const message = error instanceof Error ? error.message : String(error);

			throw new Error(message);

		}

	}



	if (!webSpeechAvailable()) {

		throw new Error('DICTATION_UNAVAILABLE');

	}



	return recognizeWithWebSpeech(lang);

}



function recognizeWithWebSpeech(lang: DictationLang): Promise<string> {

	return new Promise((resolve, reject) => {

		const win = window as typeof window & {

			webkitSpeechRecognition?: new () => WebSpeechRecognition;

			SpeechRecognition?: new () => WebSpeechRecognition;

		};

		type WebSpeechRecognition = {

			lang: string;

			interimResults: boolean;

			onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;

			onerror: (() => void) | null;

			onend: (() => void) | null;

			start: () => void;

			stop: () => void;

		};



		const Ctor = win.webkitSpeechRecognition ?? win.SpeechRecognition;

		if (!Ctor) {

			reject(new Error('DICTATION_UNAVAILABLE'));

			return;

		}



		const recognition = new Ctor();

		recognition.lang = webSpeechLocaleForDictation(lang);

		recognition.interimResults = false;



		recognition.onresult = (event) => {

			const transcript = event.results[0]?.[0]?.transcript?.trim();

			if (transcript) resolve(transcript);

			else reject(new Error('DICTATION_EMPTY'));

		};

		recognition.onerror = () => reject(new Error('DICTATION_UNAVAILABLE'));

		recognition.onend = () => {};

		recognition.start();

	});

}


