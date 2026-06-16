/** R?le : Logique m?tier de accessibilit? globale : fonctions pures ou r?gles locales testables hors interface. */
const MAX_ELEMENT_CHARS = 600;
const SKIP_SELECTOR =
	'[data-interface-tts-skip], [data-interface-tts-overlay], script, style, noscript';

function rectsIntersect(
	a: DOMRect,
	b: { left: number; top: number; right: number; bottom: number }
): boolean {
	return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function normalizeText(text: string): string {
	return text.replace(/\s+/g, ' ').trim();
}

function isVisible(node: Node): boolean {
	if (!(node instanceof HTMLElement)) return true;
	if (node.closest('[aria-hidden="true"]')) return false;
	const style = window.getComputedStyle(node);
	return style.visibility !== 'hidden' && style.display !== 'none';
}

export function findReadTarget(element: Element): Element {
	if (element.closest(SKIP_SELECTOR)) return element;

	const interactive = element.closest(
		'button, a[href], input, select, textarea, [role="button"], [aria-label], label, h1, h2, h3, h4, h5, h6'
	);
	if (interactive && !interactive.closest(SKIP_SELECTOR)) return interactive;

	const block = element.closest('article, section, .card, nav li, p, td, th, li, [role="tab"]');
	if (block && !block.closest(SKIP_SELECTOR)) return block;

	return element;
}

export function textForElement(element: Element): string | null {
	const html = element as HTMLElement;
	const aria = html.getAttribute('aria-label')?.trim();
	if (aria) return aria.slice(0, MAX_ELEMENT_CHARS);

	if (html instanceof HTMLInputElement || html instanceof HTMLTextAreaElement) {
		const id = html.id;
		if (id) {
			const linked = document.querySelector(`label[for="${CSS.escape(id)}"]`);
			if (linked?.textContent?.trim()) {
				return normalizeText(linked.textContent).slice(0, MAX_ELEMENT_CHARS);
			}
		}
		if (html.placeholder?.trim()) return html.placeholder.trim();
		if (html.value?.trim()) return html.value.trim().slice(0, MAX_ELEMENT_CHARS);
	}

	if (html instanceof HTMLSelectElement) {
		const selected = html.options[html.selectedIndex]?.textContent?.trim();
		if (selected) return selected;
	}

	const title = html.getAttribute('title')?.trim();
	if (title) return title.slice(0, MAX_ELEMENT_CHARS);

	const text = normalizeText(html.textContent ?? '');
	if (!text) return null;
	return text.slice(0, MAX_ELEMENT_CHARS);
}

export function speakableElementAt(x: number, y: number): Element | null {
	const raw = document.elementFromPoint(x, y);
	if (!raw || raw.closest(SKIP_SELECTOR)) return null;
	return findReadTarget(raw);
}

export function textInRect(left: number, top: number, right: number, bottom: number): string {
	const bounds = {
		left: Math.min(left, right),
		top: Math.min(top, bottom),
		right: Math.max(left, right),
		bottom: Math.max(top, bottom)
	};

	if (bounds.right - bounds.left < 12 || bounds.bottom - bounds.top < 12) {
		return '';
	}

	const parts: string[] = [];
	const seen = new Set<string>();
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

	while (walker.nextNode()) {
		const node = walker.currentNode;
		const parent = node.parentElement;
		if (!parent || parent.closest(SKIP_SELECTOR) || !isVisible(parent)) continue;

		const content = node.textContent?.trim();
		if (!content) continue;

		const range = document.createRange();
		range.selectNodeContents(node);
		const rects = range.getClientRects();

		for (const rect of rects) {
			if (!rectsIntersect(rect, bounds)) continue;
			if (seen.has(content)) break;
			seen.add(content);
			parts.push(content);
			break;
		}
	}

	return normalizeText(parts.join(' ')).slice(0, 4000);
}
