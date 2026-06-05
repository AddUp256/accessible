import {
	ARASAAC_API_BASE,
	ARASAAC_LOCALE,
	arasaacPictogramImageUrl
} from '$lib/config/arasaac';

export interface ArasaacSearchResult {
	id: number;
	label: string;
	keywords: string[];
	imageUrl: string;
}

type ArasaacApiKeyword = { keyword?: string };
type ArasaacApiPictogram = { _id?: number; keywords?: ArasaacApiKeyword[] };

function labelFromPictogram(item: ArasaacApiPictogram): string {
	const keywords = item.keywords ?? [];
	for (const entry of keywords) {
		if (entry.keyword?.trim()) return entry.keyword.trim();
	}
	return 'Pictogramme';
}

function parseResults(data: unknown): ArasaacSearchResult[] {
	if (!Array.isArray(data)) return [];

	return data
		.filter((item): item is ArasaacApiPictogram => typeof item === 'object' && item !== null)
		.filter((item) => typeof item._id === 'number')
		.map((item) => {
			const id = item._id as number;
			const keywords = (item.keywords ?? [])
				.map((entry) => entry.keyword?.trim())
				.filter((keyword): keyword is string => Boolean(keyword));

			return {
				id,
				label: labelFromPictogram(item),
				keywords,
				imageUrl: arasaacPictogramImageUrl(id)
			};
		});
}

export async function searchArasaacPictograms(
	query: string
): Promise<{ ok: true; results: ArasaacSearchResult[] } | { ok: false; error: string }> {
	const trimmed = query.trim();
	if (!trimmed) {
		return { ok: false, error: 'Entrez un mot à chercher.' };
	}

	if (typeof navigator !== 'undefined' && !navigator.onLine) {
		return {
			ok: false,
			error: 'Recherche ARASAAC indisponible hors ligne. Connectez-vous à Internet.'
		};
	}

	const encoded = encodeURIComponent(trimmed);
	const url = `${ARASAAC_API_BASE}/pictograms/${ARASAAC_LOCALE}/search/${encoded}`;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			return { ok: false, error: 'ARASAAC n\'a pas répondu. Réessayez plus tard.' };
		}

		const data: unknown = await response.json();
		const results = parseResults(data).slice(0, 24);

		if (results.length === 0) {
			return { ok: false, error: 'Aucun pictogramme trouvé pour ce mot.' };
		}

		return { ok: true, results };
	} catch {
		return {
			ok: false,
			error: 'Impossible de contacter ARASAAC. Vérifiez votre connexion.'
		};
	}
}
