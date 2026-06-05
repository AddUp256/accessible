<script lang="ts">
	import { settings } from '$lib/stores/profile';
	import { confirmDynamicMessage, type DynamicKey } from '$lib/i18n';

	const HOLD_MS = 450;

	$effect(() => {
		if (typeof document === 'undefined') return;

		const onDblClick = (event: MouseEvent) => {
			if ($settings.motor.singleClickMode) event.preventDefault();
		};

		const onClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (target.closest('[data-extended-skip]')) return;

			if ($settings.sensory.sounds && target.closest('.btn, button, a[href]')) {
				playUiSound();
			}

			if ($settings.motor.confirmBeforeAction) {
				const confirmed = target.closest('[data-confirm-key], [data-confirm-action]');
				if (confirmed) {
					const key = confirmed.getAttribute('data-confirm-key');
					const message = key
						? confirmDynamicMessage(key as DynamicKey)
						: (confirmed.getAttribute('data-confirm-action') ??
							confirmDynamicMessage('dyn.common.confirmAction'));
					if (!confirm(message)) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			}
		};

		let holdTarget: HTMLElement | null = null;
		let holdTimer: ReturnType<typeof setTimeout> | null = null;

		const clearHold = () => {
			if (holdTimer) clearTimeout(holdTimer);
			holdTarget?.classList.remove('btn-holding');
			holdTarget = null;
			holdTimer = null;
		};

		const onPointerDown = (event: PointerEvent) => {
			if (!$settings.motor.extendedClickTime) return;
			const target = (event.target as HTMLElement)?.closest(
				'.btn, button, a[href], [role="button"]'
			) as HTMLElement | null;
			if (!target || target.hasAttribute('disabled')) return;

			event.preventDefault();
			event.stopPropagation();
			clearHold();
			holdTarget = target;
			target.classList.add('btn-holding');

			holdTimer = setTimeout(() => {
				target.classList.remove('btn-holding');
				target.dataset.extendedSkip = '1';
				target.click();
				delete target.dataset.extendedSkip;
				clearHold();
			}, HOLD_MS);
		};

		document.addEventListener('dblclick', onDblClick);
		document.addEventListener('click', onClick, true);
		document.addEventListener('pointerdown', onPointerDown, true);
		document.addEventListener('pointerup', clearHold, true);
		document.addEventListener('pointercancel', clearHold, true);
		document.addEventListener('pointerleave', clearHold, true);

		return () => {
			document.removeEventListener('dblclick', onDblClick);
			document.removeEventListener('click', onClick, true);
			document.removeEventListener('pointerdown', onPointerDown, true);
			document.removeEventListener('pointerup', clearHold, true);
			document.removeEventListener('pointercancel', clearHold, true);
			document.removeEventListener('pointerleave', clearHold, true);
			clearHold();
		};
	});

	function playUiSound() {
		if (typeof window === 'undefined') return;
		try {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.frequency.value = 520;
			gain.gain.value = 0.04;
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + 0.05);
			void ctx.close();
		} catch {
			/* ignore */
		}
	}
</script>

<style>
	:global(.btn-holding) {
		outline: 3px solid var(--color-accent);
		outline-offset: 2px;
		animation: hold-pulse 0.45s linear;
	}

	@keyframes hold-pulse {
		from {
			box-shadow: 0 0 0 0 rgb(45 90 61 / 0.45);
		}
		to {
			box-shadow: 0 0 0 10px rgb(45 90 61 / 0);
		}
	}
</style>
