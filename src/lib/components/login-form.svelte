<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import {
        FieldGroup,
        Field,
        FieldLabel,
        FieldDescription,
        FieldSeparator,
    } from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import type { HTMLAttributes } from "svelte/elements";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
    import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";
    let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
        $props();

    const id = $props.id();
    let email = $state("");
    let password = $state("");
    const error = writable("");
    const success = writable("");
    const loading = writable(false);

    function autoClear(store: typeof error | typeof success, ms = 5000) {
        setTimeout(() => store.set(""), ms);
    }
    async function handleLogin() {
        error.set("");
        success.set("");
        loading.set(true);
        try {
            const response = await fetch(
                "http://localhost:7878/api/v1/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: "include",
                },
            );
            const data = await response.json();
            if (data.success) {
                if (data.success.data.need_verification) {
                    success.set(
                        data.success.message || "Registration successful",
                    );
                    autoClear(success);
                    setTimeout(
                        () => (window.location.href = "/verify-email"),
                        1500,
                    );
                } else {
                    success.set(
                        data.success.message || "Need to verify your email",
                    );
                    autoClear(success);
                    setTimeout(
                        () => (window.location.href = "/dashboard"),
                        1500,
                    );
                }
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

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
    <Card.Root class="overflow-hidden p-0">
        <Card.Content class="grid p-0 md:grid-cols-2">
            <form class="p-6 md:p-8">
                <FieldGroup>
                    <div class="flex flex-col items-center gap-2 text-center">
                        <h1 class="text-2xl font-bold">Welcome back</h1>
                        <p class="text-muted-foreground text-balance">
                            Login to your Homeryland account
                        </p>
                    </div>
                    <Field>
                        <FieldLabel for="email-{id}">Email</FieldLabel>
                        <Input
                            id="email-{id}"
                            type="email"
                            placeholder="m@example.com"
                            required
                            bind:value={email}
                        />
                    </Field>
                    <Field>
                        <div class="flex items-center">
                            <FieldLabel for="password-{id}">Password</FieldLabel
                            >
                            <a
                                href="##"
                                class="ml-auto text-sm underline-offset-2 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password-{id}"
                            type="password"
                            required
                            bind:value={password}
                        />
                    </Field>
                    <Field>
                        <Button type="submit" onclick={handleLogin}
                            >Login</Button
                        >
                    </Field>
                    <FieldDescription class="text-center">
                        Don't have an account? <a href="/register">Sign up</a>
                    </FieldDescription>
                </FieldGroup>
            </form>
            <div class="bg-muted relative hidden md:block">
                <img
                    src="login.jpg"
                    alt="placeholder"
                    class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </Card.Content>
    </Card.Root>
    <FieldDescription class="px-6 text-center">
        By clicking continue, you agree to our <a href="##">Terms of Service</a>
        and
        <a href="##">Privacy Policy</a>.
    </FieldDescription>
</div>

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
