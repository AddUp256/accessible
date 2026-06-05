import { browser } from '$app/environment';

export interface SpeechVoiceOption {
	uri: string;
	name: string;
	lang: string;
	local: boolean;
}

function voiceScore(voice: SpeechVoiceOption, preferredLang: string): number {
	const lang = preferredLang.toLowerCase();
	const vlang = voice.lang.toLowerCase();
	let score = 0;
	if (vlang.startsWith(lang)) score += 10;
	if (vlang.includes(lang.split('-')[0] ?? lang)) score += 5;
	if (voice.local) score += 3;
	if (/google|microsoft|natural|premium|enhanced/i.test(voice.name)) score += 2;
	return score;
}

export function listSpeechVoices(preferredLang = 'fr-FR'): SpeechVoiceOption[] {
	if (!browser || !('speechSynthesis' in window)) return [];

	const voices = speechSynthesis
		.getVoices()
		.map((v) => ({
			uri: v.voiceURI,
			name: v.name,
			lang: v.lang,
			local: v.localService
		}))
		.sort((a, b) => voiceScore(b, preferredLang) - voiceScore(a, preferredLang));

	return voices;
}

export function ensureVoicesLoaded(preferredLang = 'fr-FR'): Promise<SpeechVoiceOption[]> {
	if (!browser || !('speechSynthesis' in window)) return Promise.resolve([]);

	const existing = listSpeechVoices(preferredLang);
	if (existing.length > 0) return Promise.resolve(existing);

	return new Promise((resolve) => {
		const onVoices = () => {
			speechSynthesis.removeEventListener('voiceschanged', onVoices);
			resolve(listSpeechVoices(preferredLang));
		};
		speechSynthesis.addEventListener('voiceschanged', onVoices);
		setTimeout(() => {
			speechSynthesis.removeEventListener('voiceschanged', onVoices);
			resolve(listSpeechVoices(preferredLang));
		}, 800);
	});
}

export function defaultVoiceUri(preferredLang = 'fr-FR'): string | null {
	const voices = listSpeechVoices(preferredLang);
	return voices[0]?.uri ?? null;
}
