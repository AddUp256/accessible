import { exportProfileJson } from '$lib/services/storage/local';
import type { AccessibleProfile } from '$lib/types/profile';
import { profileForExport } from './build-synthesis';
import { downloadTextFile, exportFilename } from './download';

export function downloadProfileJson(profile: AccessibleProfile) {
	const sanitized = profileForExport(profile);
	const content = exportProfileJson(sanitized);
	downloadTextFile(content, exportFilename('profil', 'json'));
}
