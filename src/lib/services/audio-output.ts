/** R?le : Service de service applicatif : isole les acc?s navigateur, Tauri ou fichiers locaux. */
import { browser } from '$app/environment';

export interface AudioOutputDevice {
	deviceId: string;
	label: string;
}

export function supportsAudioOutputSelection(): boolean {
	return (
		browser &&
		typeof HTMLMediaElement !== 'undefined' &&
		'setSinkId' in HTMLMediaElement.prototype
	);
}

function stopStream(stream: MediaStream) {
	for (const track of stream.getTracks()) {
		track.stop();
	}
}

export async function requestAudioDeviceLabels(): Promise<boolean> {
	if (!browser || !navigator.mediaDevices?.getUserMedia) return false;

	try {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		stopStream(stream);
		return true;
	} catch {
		return false;
	}
}

export async function listAudioOutputDevices(): Promise<AudioOutputDevice[]> {
	const defaultDevice: AudioOutputDevice = {
		deviceId: '',
		label: 'Haut-parleur système'
	};

	if (!browser || !navigator.mediaDevices?.enumerateDevices) {
		return [defaultDevice];
	}

	const devices = await navigator.mediaDevices.enumerateDevices();
	const outputs = devices
		.filter((device) => device.kind === 'audiooutput' && device.deviceId !== 'default')
		.map((device, index) => ({
			deviceId: device.deviceId,
			label: device.label || `Haut-parleur ${index + 1}`
		}));

	return [defaultDevice, ...outputs];
}

export async function applyAudioOutputDevice(
	audio: HTMLAudioElement,
	deviceId: string
): Promise<boolean> {
	if (!supportsAudioOutputSelection() || !deviceId) return false;

	const element = audio as HTMLAudioElement & {
		setSinkId?: (sinkId: string) => Promise<void>;
	};

	if (!element.setSinkId) return false;

	await element.setSinkId(deviceId);
	return true;
}
