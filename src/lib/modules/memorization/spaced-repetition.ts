/** R?le : Logique m?tier de m?morisation : fonctions pures ou r?gles locales testables hors interface. */
import type { Flashcard, FlashcardSchedule } from '$lib/types/profile';

export type ReviewRating = 'hard' | 'good' | 'easy';

export function isCardDue(schedule: FlashcardSchedule | undefined, now = new Date()): boolean {
	if (!schedule) return true;
	return new Date(schedule.nextReviewAt).getTime() <= now.getTime();
}

export function countDueCards(cards: Flashcard[], now = new Date()): number {
	return cards.filter((card) => isCardDue(card.schedule, now)).length;
}

export function filterDueCards(cards: Flashcard[], now = new Date()): Flashcard[] {
	return cards.filter((card) => isCardDue(card.schedule, now));
}

export function applyReview(
	schedule: FlashcardSchedule | undefined,
	rating: ReviewRating,
	now = new Date()
): FlashcardSchedule {
	let intervalDays = schedule?.intervalDays ?? 0;
	let repetitions = schedule?.repetitions ?? 0;

	switch (rating) {
		case 'hard':
			intervalDays = 1;
			repetitions = Math.max(0, repetitions - 1);
			break;
		case 'good':
			if (repetitions === 0) intervalDays = 1;
			else if (repetitions === 1) intervalDays = 3;
			else intervalDays = Math.max(intervalDays + 1, Math.round(intervalDays * 1.8));
			repetitions += 1;
			break;
		case 'easy':
			if (repetitions === 0) intervalDays = 4;
			else intervalDays = Math.max(intervalDays + 2, Math.round(intervalDays * 2.5));
			repetitions += 1;
			break;
	}

	const next = new Date(now);
	next.setHours(23, 59, 59, 999);
	next.setDate(next.getDate() + intervalDays);

	return {
		nextReviewAt: next.toISOString(),
		intervalDays,
		repetitions
	};
}

export function formatNextReview(schedule: FlashcardSchedule | undefined): string {
	if (!schedule) return 'À réviser';

	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const next = new Date(schedule.nextReviewAt);
	next.setHours(0, 0, 0, 0);

	const diffDays = Math.round((next.getTime() - now.getTime()) / 86_400_000);
	if (diffDays <= 0) return 'À réviser aujourd\'hui';
	if (diffDays === 1) return 'Demain';
	return `Dans ${diffDays} jours`;
}

export const REVIEW_RATING_LABELS: Record<
	ReviewRating,
	{ label: string; hint: string }
> = {
	hard: { label: 'Difficile', hint: 'Revoir demain' },
	good: { label: 'Correct', hint: 'Revoir plus tard' },
	easy: { label: 'Facile', hint: 'Revoir dans longtemps' }
};
