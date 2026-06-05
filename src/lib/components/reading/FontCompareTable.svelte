<script lang="ts">
	import { FONT_COMPARE_TABLE } from '$lib/config/fonts-catalog';
	import { readingSettingsToStyle } from '$lib/modules/reading/font-stacks';
	import type { ReadingSettings } from '$lib/types/profile';

	let {
		settings
	}: {
		settings: ReadingSettings;
	} = $props();
</script>

<table class="compare-table" style={readingSettingsToStyle(settings)}>
	<thead>
		<tr>
			{#each FONT_COMPARE_TABLE.headers as header}
				<th scope="col">{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each FONT_COMPARE_TABLE.rows as row}
			<tr>
				{#each row as cell}
					<td>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.compare-table {
		width: 100%;
		border-collapse: collapse;
		padding: var(--space-md);
		border-radius: var(--radius);
	}

	.compare-table th,
	.compare-table td {
		border: 1px solid var(--color-border);
		padding: var(--space-sm) var(--space-md);
		text-align: left;
		vertical-align: top;
	}

	.compare-table th {
		font-weight: 600;
		background: color-mix(in srgb, currentColor 6%, transparent);
	}
</style>
