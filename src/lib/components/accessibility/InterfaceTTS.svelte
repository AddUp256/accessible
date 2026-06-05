<script lang="ts">
	import { resolveWebSpeechLocale } from '$lib/i18n';
	import { settings } from '$lib/stores/profile';
	import {
		speakableElementAt,
		textForElement,
		textInRect
	} from '$lib/modules/accessibility/interface-tts-read';
	import { tts } from '$lib/services/tts';

	const DOUBLE_MS = 400;
	const DOUBLE_DIST = 24;
	const DRAG_THRESHOLD = 8;

	let zoneRect = $state<{ left: number; top: number; width: number; height: number } | null>(
		null
	);

	let lastContextAt = 0;
	let lastContextX = 0;
	let lastContextY = 0;
	let suppressContextMenu = false;

	let dragState = {
		active: false,
		startX: 0,
		startY: 0,
		dragging: false
	};

	function ttsLang(): string {
		return resolveWebSpeechLocale($settings.ui.secondaryLanguage, $settings.ui.bilingualUi);
	}

	function speakText(text: string) {
		const trimmed = text.trim();
		if (!trimmed || !tts.isAvailable()) return;
		tts.stop();
		tts.speak(trimmed, { lang: ttsLang(), rate: $settings.reading.ttsRate || 1 });
	}

	function speakElementAt(x: number, y: number) {
		const el = speakableElementAt(x, y);
		if (!el) return;
		const text = textForElement(el);
		if (text) speakText(text);
	}

	function updateZoneOverlay(x1: number, y1: number, x2: number, y2: number) {
		const left = Math.min(x1, x2);
		const top = Math.min(y1, y2);
		zoneRect = {
			left,
			top,
			width: Math.abs(x2 - x1),
			height: Math.abs(y2 - y1)
		};
	}

	$effect(() => {
		if (typeof document === 'undefined' || !$settings.ui.interfaceTTS) {
			zoneRect = null;
			return;
		}

		document.documentElement.classList.add('interface-tts-active');

		const onPointerDown = (event: PointerEvent) => {
			if (event.button !== 2) return;
			const target = event.target as HTMLElement;
			if (
				target.closest(
					'[data-interface-tts-skip], textarea, input, select, [contenteditable="true"], .read-aloud'
				)
			) {
				return;
			}

			dragState = {
				active: true,
				startX: event.clientX,
				startY: event.clientY,
				dragging: false
			};
			zoneRect = null;
		};

		const onPointerMove = (event: PointerEvent) => {
			if (!dragState.active) return;

			const dx = event.clientX - dragState.startX;
			const dy = event.clientY - dragState.startY;

			if (!dragState.dragging && dx * dx + dy * dy >= DRAG_THRESHOLD * DRAG_THRESHOLD) {
				dragState.dragging = true;
			}

			if (dragState.dragging) {
				updateZoneOverlay(dragState.startX, dragState.startY, event.clientX, event.clientY);
			}
		};

		const onPointerUp = (event: PointerEvent) => {
			if (!dragState.active || event.button !== 2) return;

			if (dragState.dragging) {
				const text = textInRect(
					dragState.startX,
					dragState.startY,
					event.clientX,
					event.clientY
				);
				if (text) speakText(text);
				suppressContextMenu = true;
			}

			dragState = { active: false, startX: 0, startY: 0, dragging: false };
			zoneRect = null;
		};

		const onContextMenu = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				target.closest(
					'[data-interface-tts-skip], textarea, input, select, [contenteditable="true"], .read-aloud'
				)
			) {
				return;
			}

			event.preventDefault();

			if (suppressContextMenu) {
				suppressContextMenu = false;
				return;
			}

			if (dragState.dragging) return;

			const now = Date.now();
			const dist = Math.hypot(event.clientX - lastContextX, event.clientY - lastContextY);

			if (now - lastContextAt < DOUBLE_MS && dist < DOUBLE_DIST) {
				lastContextAt = 0;
				speakElementAt(event.clientX, event.clientY);
			} else {
				lastContextAt = now;
				lastContextX = event.clientX;
				lastContextY = event.clientY;
			}
		};

		document.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('pointermove', onPointerMove);
		document.addEventListener('pointerup', onPointerUp);
		document.addEventListener('contextmenu', onContextMenu, true);

		return () => {
			document.documentElement.classList.remove('interface-tts-active');
			document.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('pointermove', onPointerMove);
			document.removeEventListener('pointerup', onPointerUp);
			document.removeEventListener('contextmenu', onContextMenu, true);
			zoneRect = null;
		};
	});
</script>

{#if $settings.ui.interfaceTTS && zoneRect}
	<div
		class="interface-tts-zone"
		data-interface-tts-overlay
		style:left="{zoneRect.left}px"
		style:top="{zoneRect.top}px"
		style:width="{zoneRect.width}px"
		style:height="{zoneRect.height}px"
		aria-hidden="true"
	></div>
{/if}

<style>
	.interface-tts-zone {
		position: fixed;
		z-index: 9999;
		pointer-events: none;
		border: 2px dashed var(--color-accent, #2d5a3d);
		background: rgb(45 90 61 / 0.12);
		border-radius: 2px;
	}

	:global(html.interface-tts-active) {
		cursor: default;
	}
</style>
