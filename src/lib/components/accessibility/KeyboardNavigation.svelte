<script lang="ts">
	// R?le : Composant Svelte de accessibilit? globale : encapsule l?affichage et les interactions r?utilisables.

	import { settings } from '$lib/stores/profile';

	const SCAN_INTERVAL_MS = 2200;

	function getFocusableElements(): HTMLElement[] {
		if (typeof document === 'undefined') return [];
		const selector =
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
		return [...document.querySelectorAll<HTMLElement>(selector)].filter(
			(el) => !el.closest('[aria-hidden="true"]') && el.offsetParent !== null
		);
	}

	$effect(() => {
		if (typeof document === 'undefined') return;

		const root = document.documentElement;
		root.classList.toggle('keyboard-nav-enhanced', $settings.ui.keyboardNavigation);
		root.classList.toggle('motor-scan-mode', $settings.motor.scanMode);

		return () => {
			root.classList.remove('keyboard-nav-enhanced');
			root.classList.remove('motor-scan-mode');
		};
	});

	$effect(() => {
		if (typeof document === 'undefined' || !$settings.motor.scanMode) return;

		let index = 0;
		let timer: ReturnType<typeof setInterval> | null = null;

		const focusNext = () => {
			const items = getFocusableElements();
			if (items.length === 0) return;
			index = (index + 1) % items.length;
			items[index]?.focus();
		};

		timer = setInterval(focusNext, SCAN_INTERVAL_MS);

		const onKeyDown = (event: KeyboardEvent) => {
			const items = getFocusableElements();
			if (items.length === 0) return;

			if (event.key === 'Enter' || event.key === ' ') {
				const active = document.activeElement as HTMLElement | null;
				if (active && items.includes(active)) {
					event.preventDefault();
					active.click();
				}
			}

			if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
				event.preventDefault();
				index = (index + 1) % items.length;
				items[index]?.focus();
			}

			if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
				event.preventDefault();
				index = (index - 1 + items.length) % items.length;
				items[index]?.focus();
			}
		};

		document.addEventListener('keydown', onKeyDown);

		return () => {
			if (timer) clearInterval(timer);
			document.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

<style>
	:global(.keyboard-nav-enhanced :focus-visible) {
		outline: 3px solid var(--color-accent);
		outline-offset: 3px;
	}

	:global(.motor-scan-mode :focus) {
		outline: 4px solid var(--color-accent);
		outline-offset: 4px;
		box-shadow: 0 0 0 6px rgb(45 90 61 / 0.25);
	}
</style>
