/** R?le : Service de export local : isole les acc?s navigateur, Tauri ou fichiers locaux. */
/** ?chappe le texte destin? aux corps de documents XML. */
export function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
