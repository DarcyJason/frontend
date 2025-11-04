<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";
    import { page } from "$app/state";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<header class="absolute top-0 left-0 p-4 md:p-6">
    <a href="/" aria-label="Back to homepage">
        <h1 class="text-2xl font-bold text-slate-800">Homeryland</h1>
    </a>
</header>

<div class="grid place-items-center h-screen">
    {@render children()}
</div>
