<script lang="ts">
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';
	import BilingualText from '$lib/components/ui/BilingualText.svelte';
	import {
		DEFAULT_CUSTOM_MINUTES,
		TIMER_PRESETS,
		type TimerKind
	} from '$lib/config/timer-presets';
	import {
		formatTimer,
		minutesToSeconds,
		parseCustomMinutes
	} from '$lib/modules/organizer/timer';
	import { profileStore, settings } from '$lib/stores/profile';
	import {
		bilingualUi,
		dynamicMessage,
		timerFinishedDynamicMessage,
		configLabel,
		TIMER_I18N_KEYS
	} from '$lib/i18n';

	const TIMER_ALARM_ACCEPT = 'audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm';

	let totalSeconds = $state(minutesToSeconds(DEFAULT_CUSTOM_MINUTES));
	let remainingSeconds = $state(minutesToSeconds(DEFAULT_CUSTOM_MINUTES));
	let running = $state(false);
	let finished = $state(false);
	let activeKind = $state<TimerKind>('custom');
	let customMinutes = $state(String(DEFAULT_CUSTOM_MINUTES));
	let status = $state('');
	let customAlarmLabel = $state('');

	let timerId: ReturnType<typeof setInterval> | undefined;
	let alarmAudio: HTMLAudioElement | null = null;

	const startBtnLabel = $derived(
		finished
			? bilingualUi('Recommencer', 'mod.organize.timer.restart', $settings.ui)
			: bilingualUi('Démarrer', 'mod.organize.timer.start', $settings.ui)
	);

	function clearTimer() {
		if (timerId) clearInterval(timerId);
		timerId = undefined;
	}

	function playBeep() {
		try {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.frequency.value = 880;
			gain.gain.value = 0.15;
			osc.start();
			osc.stop(ctx.currentTime + 0.35);
			setTimeout(() => void ctx.close(), 500);
		} catch {
			/* ignore */
		}
	}

	function playTimerAlarm() {
		if (!$settings.sensory.sounds || typeof window === 'undefined') return;

		const url = $settings.sensory.timerAlarmDataUrl;
		if (url) {
			try {
				alarmAudio?.pause();
				alarmAudio = new Audio(url);
				void alarmAudio.play();
				return;
			} catch {
				/* fallback beep */
			}
		}
		playBeep();
	}

	async function onAlarmFileSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;

		customAlarmLabel = file.name;
		const reader = new FileReader();
		reader.onload = () => {
			const dataUrl = typeof reader.result === 'string' ? reader.result : null;
			if (!dataUrl) return;
			profileStore.updateSettings({ sensory: { timerAlarmDataUrl: dataUrl } });
			status = dynamicMessage('dyn.timer.alarmLoaded', $settings.ui, { name: file.name });
		};
		reader.readAsDataURL(file);
	}

	function clearCustomAlarm() {
		customAlarmLabel = '';
		profileStore.updateSettings({ sensory: { timerAlarmDataUrl: null } });
		status = dynamicMessage('dyn.timer.alarmCleared', $settings.ui);
	}

	function selectPreset(seconds: number, kind: TimerKind) {
		clearTimer();
		running = false;
		finished = false;
		totalSeconds = seconds;
		remainingSeconds = seconds;
		activeKind = kind;
		status = '';
	}

	function applyCustomDuration() {
		const minutes = parseCustomMinutes(customMinutes);
		if (minutes === null) {
			status = dynamicMessage('dyn.timer.invalidMinutes', $settings.ui);
			return;
		}
		selectPreset(minutesToSeconds(minutes), 'custom');
	}

	function start() {
		if (remainingSeconds <= 0) {
			remainingSeconds = totalSeconds;
		}
		finished = false;
		running = true;
		status = dynamicMessage('dyn.timer.running', $settings.ui);
		clearTimer();
		timerId = setInterval(() => {
			if (remainingSeconds <= 1) {
				remainingSeconds = 0;
				running = false;
				finished = true;
				status = timerFinishedDynamicMessage(activeKind, $settings.ui);
				playTimerAlarm();
				clearTimer();
				return;
			}
			remainingSeconds -= 1;
		}, 1000);
	}

	function pause() {
		running = false;
		clearTimer();
		status = dynamicMessage('dyn.timer.paused', $settings.ui);
	}

	function reset() {
		clearTimer();
		running = false;
		finished = false;
		remainingSeconds = totalSeconds;
		status = '';
	}

	$effect(() => {
		return () => clearTimer();
	});
</script>

<section class="focus-timer card" aria-labelledby="timer-heading">
	<BiHeading fr="Minuteur" key="mod.organize.timer.title" level={3} id="timer-heading" />
	<p class="timer-hint">
		<BiText
			fr="Travail par étapes : focus, puis pause. Activez les sons dans les réglages pour une alerte à la fin."
			key="mod.organize.timer.hint"
		/>
	</p>

	<div class="timer-presets" role="group" aria-label="Durées prédéfinies">
		{#each TIMER_PRESETS as preset}
			<button
				type="button"
				class="btn btn-secondary"
				class:btn-primary={totalSeconds === preset.seconds && activeKind === preset.kind}
				onclick={() => selectPreset(preset.seconds, preset.kind)}
				title={configLabel(preset.hint, TIMER_I18N_KEYS[preset.id].hint, $settings.ui)}
			>
				{configLabel(preset.label, TIMER_I18N_KEYS[preset.id].label, $settings.ui)}
			</button>
		{/each}
	</div>

	<div class="timer-custom">
		<label for="custom-minutes">
			<BiText fr="Durée personnalisée (minutes)" key="mod.organize.timer.custom" inline />
		</label>
		<div class="timer-custom-row">
			<input
				id="custom-minutes"
				type="number"
				min="1"
				max="180"
				bind:value={customMinutes}
			/>
			<button type="button" class="btn btn-secondary" onclick={applyCustomDuration}>
				<BiText fr="Appliquer" key="mod.organize.timer.apply" inline />
			</button>
		</div>
	</div>

	<div class="timer-alarm-setup">
		<label class="btn btn-secondary timer-alarm-upload">
			<BiText fr="Choisir un son de fin" key="mod.organize.timer.alarmChoose" inline />
			<input type="file" accept={TIMER_ALARM_ACCEPT} onchange={onAlarmFileSelected} />
		</label>
		{#if $settings.sensory.timerAlarmDataUrl}
			<button type="button" class="btn btn-secondary" onclick={clearCustomAlarm}>
				<BiText fr="Son par défaut" key="mod.organize.timer.alarmReset" inline />
			</button>
			{#if customAlarmLabel}
				<span class="timer-alarm-name">{customAlarmLabel}</span>
			{/if}
		{/if}
	</div>

	<p
		class="timer-display"
		class:timer-display--finished={finished}
		aria-live="polite"
		aria-atomic="true"
	>
		{formatTimer(remainingSeconds)}
	</p>

	<div class="timer-actions">
		{#if running}
			<button type="button" class="btn btn-primary btn-lg" onclick={pause}>
				<BiText fr="Pause" key="mod.organize.timer.pause" inline />
			</button>
		{:else}
			<button type="button" class="btn btn-primary btn-lg" onclick={start}>
				<BilingualText
					primary={startBtnLabel.primary}
					secondary={startBtnLabel.secondary}
					inline
				/>
			</button>
		{/if}
		<button type="button" class="btn btn-secondary" onclick={reset}>
			<BiText fr="Réinitialiser" key="mod.organize.timer.reset" inline />
		</button>
	</div>

	{#if status}
		<p class="timer-status" role="status">{status}</p>
	{/if}

	{#if finished && activeKind === 'focus'}
		<p class="timer-tip">
			<BiText
				fr="Astuce : lancez une pause de 5 minutes avant la prochaine étape."
				key="mod.organize.timer.tip"
			/>
		</p>
	{/if}
</section>

<style>
	.timer-hint {
		margin: 0 0 var(--space-md);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.timer-presets {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.timer-custom label {
		display: block;
		font-weight: 600;
		margin-bottom: var(--space-xs);
	}

	.timer-custom-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		margin-bottom: var(--space-md);
	}

	.timer-custom-row input {
		width: 6rem;
		min-height: var(--btn-min-height);
		padding: var(--space-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font: inherit;
	}

	.timer-alarm-setup {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.timer-alarm-upload input {
		display: none;
	}

	.timer-alarm-name {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.timer-display {
		font-size: clamp(2.5rem, 8vw, 4rem);
		font-weight: 700;
		text-align: center;
		margin: var(--space-lg) 0;
		font-variant-numeric: tabular-nums;
	}

	.timer-display--finished {
		color: var(--color-accent, #2d5a3d);
	}

	.timer-actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-sm);
		justify-content: center;
	}

	.timer-status,
	.timer-tip {
		margin-top: var(--space-md);
		text-align: center;
		font-size: var(--font-size-sm);
	}

	.timer-tip {
		color: var(--color-text-muted);
	}
</style>
