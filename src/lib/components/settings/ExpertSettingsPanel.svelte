<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import { bilingualLabel, type UiKey } from '$lib/i18n';
	import { profileStore, settings } from '$lib/stores/profile';
	import { isExpertDetail } from '$lib/utils/detail-level';
	import type {
		CommunicationSettings,
		MotorSettings,
		ReadingSettings,
		SensorySettings,
		UISettings,
		WritingSettings
	} from '$lib/types/profile';

	const expert = $derived(isExpertDetail($profileStore));

	const buttonSizes: { value: UISettings['buttonSize']; fr: string; key: UiKey }[] = [
		{ value: 'normal', fr: 'Normal', key: 'size.normal' },
		{ value: 'large', fr: 'Grand', key: 'size.large' },
		{ value: 'veryLarge', fr: 'Très grand', key: 'size.veryLarge' }
	];

	const notificationLevels: { value: SensorySettings['notifications']; fr: string; key: UiKey }[] =
		[
			{ value: 'off', fr: 'Désactivées', key: 'notify.off' },
			{ value: 'minimal', fr: 'Minimales', key: 'notify.minimal' },
			{ value: 'normal', fr: 'Normales', key: 'notify.normal' }
		];

	function patchUi(partial: Partial<UISettings>) {
		profileStore.updateSettings({ ui: partial });
	}

	function patchReading(partial: Partial<ReadingSettings>) {
		profileStore.updateSettings({ reading: partial });
	}

	function patchWriting(partial: Partial<WritingSettings>) {
		profileStore.updateSettings({ writing: partial });
	}

	function patchSensory(partial: Partial<SensorySettings>) {
		profileStore.updateSettings({ sensory: partial });
	}

	function patchMotor(partial: Partial<MotorSettings>) {
		if (partial.largeButtons === true) {
			profileStore.updateSettings({ motor: partial, ui: { buttonSize: 'veryLarge' } });
			return;
		}
		profileStore.updateSettings({ motor: partial });
	}

	function patchCommunication(partial: Partial<CommunicationSettings>) {
		profileStore.updateSettings({ communication: partial });
	}
</script>

{#if expert}
	<section class="card expert-settings" id="expert" aria-labelledby="expert-settings-heading">
		<BiHeading
			fr="Réglages avancés (mode expert)"
			key="panel.expert.title"
			level={3}
			id="expert-settings-heading"
		/>
		<p class="expert-hint">
			<BiText
				fr="Ces options sont réservées au mode expert. Elles restent enregistrées même si vous changez de mode."
				key="panel.expert.hint"
			/>
		</p>

		<h4><BiText fr="Interface" key="panel.expert.section.interface" inline /></h4>
		<label class="expert-field">
			<span><BiText fr="Taille des boutons" key="panel.expert.buttonSize" inline /></span>
			<select
				value={$settings.ui.buttonSize}
				onchange={(e) => patchUi({ buttonSize: e.currentTarget.value as UISettings['buttonSize'] })}
			>
				{#each buttonSizes as size}
					<option value={size.value}>{bilingualLabel(size.fr, size.key, $settings.ui)}</option>
				{/each}
			</select>
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.ui.animations}
				onchange={(e) => patchUi({ animations: e.currentTarget.checked })}
			/>
			<BiText fr="Animations de l'interface" key="panel.expert.animations" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.ui.keyboardNavigation}
				onchange={(e) => patchUi({ keyboardNavigation: e.currentTarget.checked })}
			/>
			<BiText fr="Navigation clavier renforcée" key="panel.expert.keyboardNav" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.ui.interfaceTTS}
				onchange={(e) => patchUi({ interfaceTTS: e.currentTarget.checked })}
			/>
			<BiText fr="Lecture vocale de l'interface (expérimental)" key="panel.expert.interfaceTTS" inline />
		</label>
		{#if $settings.ui.interfaceTTS}
			<p class="expert-hint">
				<BiText
					fr="Double-clic droit sur un élément pour le lire. Maintenez le clic droit et glissez pour lire une zone."
					key="panel.expert.interfaceTTSHint"
				/>
			</p>
		{/if}

		<h4><BiText fr="Typographie lecture" key="panel.expert.section.typography" inline /></h4>
		<label class="expert-field">
			<span
				><BiText fr="Espacement des lettres" key="panel.expert.letterSpacing" inline />
				({$settings.reading.letterSpacing} em)</span
			>
			<input
				type="range"
				min="0"
				max="0.3"
				step="0.01"
				value={$settings.reading.letterSpacing}
				oninput={(e) => patchReading({ letterSpacing: Number(e.currentTarget.value) })}
			/>
		</label>

		<label class="expert-field">
			<span
				><BiText fr="Espacement des mots" key="panel.expert.wordSpacing" inline />
				({$settings.reading.wordSpacing} px)</span
			>
			<input
				type="range"
				min="0"
				max="12"
				step="1"
				value={$settings.reading.wordSpacing}
				oninput={(e) => patchReading({ wordSpacing: Number(e.currentTarget.value) })}
			/>
		</label>

		<label class="expert-field">
			<span
				><BiText fr="Largeur max. du texte" key="panel.expert.maxColumnWidth" inline />
				({$settings.reading.maxColumnWidth} car.)</span
			>
			<input
				type="range"
				min="40"
				max="90"
				step="1"
				value={$settings.reading.maxColumnWidth}
				oninput={(e) => patchReading({ maxColumnWidth: Number(e.currentTarget.value) })}
			/>
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.reading.readingMask}
				onchange={(e) => patchReading({ readingMask: e.currentTarget.checked })}
			/>
			<BiText fr="Masque de lecture (ligne active)" key="panel.expert.readingMask" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.reading.syllableHighlight}
				onchange={(e) => patchReading({ syllableHighlight: e.currentTarget.checked })}
			/>
			<BiText fr="Surlignage des syllabes" key="panel.expert.syllableHighlight" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.reading.graphemeHighlight}
				onchange={(e) => patchReading({ graphemeHighlight: e.currentTarget.checked })}
			/>
			<BiText fr="Surlignage des graphèmes" key="panel.expert.graphemeHighlight" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.reading.mutedLetters}
				onchange={(e) => patchReading({ mutedLetters: e.currentTarget.checked })}
			/>
			<BiText fr="Atténuer les lettres muettes" key="panel.expert.mutedLetters" inline />
		</label>

		<h4><BiText fr="Écriture" key="panel.expert.section.writing" inline /></h4>
		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.writing.readBack}
				onchange={(e) => patchWriting({ readBack: e.currentTarget.checked })}
			/>
			<BiText fr="Relecture automatique après saisie" key="panel.expert.readBack" inline />
		</label>

		<h4><BiText fr="Sensibilité sensorielle" key="panel.expert.section.sensory" inline /></h4>
		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.sensory.sounds}
				onchange={(e) => patchSensory({ sounds: e.currentTarget.checked })}
			/>
			<BiText fr="Sons de l'interface" key="panel.expert.sounds" inline />
		</label>

		<label class="expert-field">
			<span><BiText fr="Notifications" key="panel.expert.notifications" inline /></span>
			<select
				value={$settings.sensory.notifications}
				onchange={(e) => {
					const notifications = e.currentTarget.value as SensorySettings['notifications'];
					patchSensory({ notifications });
					if (
						notifications !== 'off' &&
						typeof Notification !== 'undefined' &&
						Notification.permission === 'default'
					) {
						void Notification.requestPermission();
					}
				}}
			>
				{#each notificationLevels as level}
					<option value={level.value}>{bilingualLabel(level.fr, level.key, $settings.ui)}</option>
				{/each}
			</select>
		</label>

		<h4><BiText fr="Accessibilité motrice" key="panel.expert.section.motor" inline /></h4>
		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.motor.largeButtons}
				onchange={(e) => patchMotor({ largeButtons: e.currentTarget.checked })}
			/>
			<BiText fr="Gros boutons" key="panel.expert.largeButtons" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.motor.extendedClickTime}
				onchange={(e) => patchMotor({ extendedClickTime: e.currentTarget.checked })}
			/>
			<BiText fr="Temps de clic augmenté" key="panel.expert.extendedClickTime" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.motor.confirmBeforeAction}
				onchange={(e) => patchMotor({ confirmBeforeAction: e.currentTarget.checked })}
			/>
			<BiText fr="Confirmer avant les actions importantes" key="panel.expert.confirmBeforeAction" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.motor.singleClickMode}
				onchange={(e) => patchMotor({ singleClickMode: e.currentTarget.checked })}
			/>
			<BiText fr="Mode clic unique (sans double-clic)" key="panel.expert.singleClickMode" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.motor.dictationEnabled}
				onchange={(e) => patchMotor({ dictationEnabled: e.currentTarget.checked })}
			/>
			<BiText fr="Dictée vocale activée" key="panel.expert.dictationEnabled" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.motor.scanMode}
				onchange={(e) => patchMotor({ scanMode: e.currentTarget.checked })}
			/>
			<BiText
				fr="Mode balayage (focus automatique + flèches)"
				key="panel.expert.scanMode"
				inline
			/>
		</label>

		<h4><BiText fr="Communication" key="panel.expert.section.communication" inline /></h4>
		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.communication.pictogramsEnabled}
				onchange={(e) => patchCommunication({ pictogramsEnabled: e.currentTarget.checked })}
			/>
			<BiText fr="Pictogrammes activés par défaut" key="panel.expert.pictogramsEnabled" inline />
		</label>

		<label class="expert-check">
			<input
				type="checkbox"
				checked={$settings.communication.communicationCardsEnabled}
				onchange={(e) => patchCommunication({ communicationCardsEnabled: e.currentTarget.checked })}
			/>
			<BiText
				fr="Cartes de communication activées par défaut"
				key="panel.expert.communicationCardsEnabled"
				inline
			/>
		</label>
	</section>
{:else}
	<section class="card expert-settings expert-settings--locked" aria-labelledby="expert-locked-heading">
		<BiHeading fr="Réglages avancés" key="panel.expert.locked.title" level={3} id="expert-locked-heading" />
		<p class="expert-hint">
			<BiText
				fr="Le mode expert affiche tous les réglages (typographie fine, moteur TTS, stockage détaillé, accessibilité motrice). Activez-le dans « Mode d'utilisation » ci-dessus."
				key="panel.expert.locked.hint"
			/>
		</p>
	</section>
{/if}

<style>
	.expert-settings h4 {
		margin: var(--space-lg) 0 var(--space-sm);
		font-size: var(--font-size-base);
	}

	.expert-settings h4:first-of-type {
		margin-top: var(--space-md);
	}

	.expert-hint {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-md);
	}

	.expert-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin-bottom: var(--space-md);
	}

	.expert-field select,
	.expert-field input[type='range'] {
		min-height: var(--btn-min-height);
		font-size: var(--font-size-base);
	}

	.expert-check {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: var(--btn-min-height);
		cursor: pointer;
		margin-bottom: var(--space-sm);
	}

	.expert-settings--locked {
		border-style: dashed;
	}
</style>
