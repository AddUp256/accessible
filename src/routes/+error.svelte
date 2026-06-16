<script lang="ts">
	// R?le : Page d?erreur SvelteKit accessible, affich?e quand une route ?choue.

	import { page } from '$app/stores';
	import BiHeading from '$lib/components/ui/BiHeading.svelte';
	import BiText from '$lib/components/ui/BiText.svelte';

	let { status }: { status: number } = $props();
</script>

<svelte:head>
	<title>Page introuvable — Accessible</title>
</svelte:head>

<section class="card">
	<BiHeading fr="Page introuvable" key="error.notFound.title" />
	<p><BiText fr="Cette partie n'est pas encore disponible." key="error.notFound.body" /></p>
	<p><small>Code : {status} — {$page.url.pathname}</small></p>
	<a class="btn btn-primary" href="/"><BiText fr="Retour à l'accueil" key="common.backHome" inline /></a>
</section>
