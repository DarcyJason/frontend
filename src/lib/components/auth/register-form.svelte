<script lang="ts">
    import { cn } from "$lib/utils.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { writable } from "svelte/store";
    import type { HTMLAttributes } from "svelte/elements";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
    import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
    import { fade } from "svelte/transition";
    let { class: className, ...restProps }: HTMLAttributes<HTMLFormElement> =
        $props();

    let name = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    const error = writable("");
    const success = writable("");
    const loading = writable(false);

    function autoClear(store: typeof error | typeof success, ms = 5000) {
        setTimeout(() => store.set(""), ms);
    }

    async function handleRegister() {
        error.set("");
        success.set("");
        loading.set(true);
        try {
            const response = await fetch(
                "http://localhost:7878/api/v1/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        confirm_password: confirmPassword,
                    }),
                    credentials: "include",
                },
            );

            const data = await response.json();

            if (data.success) {
                success.set(data.success.message || "Registration successful");
                autoClear(success);
                setTimeout(() => (window.location.href = "/login"), 3000);
            } else if (data.error) {
                error.set(data.error.message || "Registration failed");
                autoClear(error);
            } else {
                error.set("Unexpected server response");
                autoClear(error);
            }
        } catch (e) {
            error.set((e as Error).message || "Network error");
            autoClear(error);
        } finally {
            loading.set(false);
        }
    }
</script>

<form class={cn("flex flex-col gap-6", className)} {...restProps}>
    <Field.Group>
        <div class="flex flex-col items-center gap-1 text-center">
            <h1 class="text-2xl font-bold">Create your account</h1>
            <p class="text-muted-foreground text-balance text-sm">
                Fill in the form below to create your account
            </p>
        </div>
        <Field.Field>
            <Field.Label for="name">Full Name</Field.Label>
            <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                bind:value={name}
            />
        </Field.Field>
        <Field.Field>
            <Field.Label for="email">Email</Field.Label>
            <Input
                id="email"
                type="email"
                placeholder="nobody@example.com"
                required
                bind:value={email}
            />
            <Field.Description>
                We'll use this to contact you. We will not share your email with
                anyone else.
            </Field.Description>
        </Field.Field>
        <Field.Field>
            <Field.Label for="password">Password</Field.Label>
            <Input
                id="password"
                type="password"
                required
                bind:value={password}
            />
            <Field.Description
                >Must be at least 8 characters long.</Field.Description
            >
        </Field.Field>
        <Field.Field>
            <Field.Label for="confirm-password">Confirm Password</Field.Label>
            <Input
                id="confirm-password"
                type="password"
                required
                bind:value={confirmPassword}
            />
            <Field.Description>Please confirm your password.</Field.Description>
        </Field.Field>
        <Field.Field>
            <Button type="submit" onclick={handleRegister}
                >Create Account</Button
            >
        </Field.Field>
        <Field.Field>
            <Field.Description class="px-6 text-center">
                Already have an account? <a href="/login">Sign in</a>
            </Field.Description>
        </Field.Field>
    </Field.Group>
</form>

<div class="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
    {#if $success}
        <div in:fade out:fade>
            <Alert.Root>
                <CheckCircle2Icon />
                <Alert.Title>{$success}</Alert.Title>
            </Alert.Root>
        </div>
    {/if}

    {#if $error}
        <div in:fade out:fade>
            <Alert.Root variant="destructive">
                <AlertCircleIcon />
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>{$error}</Alert.Description>
            </Alert.Root>
        </div>
    {/if}
</div>
