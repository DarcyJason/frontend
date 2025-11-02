<script lang="ts">
    import "../app.css";
    import favicon from "$lib/assets/favicon.svg";
    import { page } from "$app/state";

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{#if page.route.id === "/login" || page.route.id === "/register"}
    <header class="absolute top-0 left-0 p-4 md:p-6">
        <a href="/" aria-label="Back to homepage">
            <h1 class="text-2xl font-bold text-slate-800">Homeryland</h1>
        </a>
    </header>
{/if}

{@render children()}
