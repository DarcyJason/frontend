<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import { cn, type WithElementRef } from "$lib/utils.js";
    import { Field, FieldLabel } from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
    import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { fade } from "svelte/transition";
    import { writable } from "svelte/store";
    let {
        ref = $bindable(null),
        class: className,
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
    const id = $props.id();

    let email = $state("");
    const error = writable("");
    const success = writable("");
    const loading = writable(false);

    function autoClear(store: typeof error | typeof success, ms = 5000) {
        setTimeout(() => store.set(""), ms);
    }

    async function handleForgetPassword() {
        error.set("");
        success.set("");
        loading.set(true);
        try {
            const response = await fetch(
                "http://localhost:7878/api/v1/auth/forget-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                    credentials: "include",
                },
            );
            const data = await response.json();
            if (data.success) {
                success.set(
                    data.success.message ||
                        "A reset password email has sent to your email",
                );
                autoClear(success);
                setTimeout(
                    () => (window.location.href = "/reset-password"),
                    3000,
                );
            } else if (data.error) {
                error.set(data.error.message || "Something went wrong");
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

<div
    class="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
>
    <Card.Root class="mx-auto w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">Forget password</Card.Title>
            <Card.Description
                >Enter your email below to get a email code in your email</Card.Description
            >
        </Card.Header>
        <Card.Content>
            <div
                class={cn("flex flex-col gap-6", className)}
                bind:this={ref}
                {...restProps}
            >
                <form>
                    <Field>
                        <FieldLabel for="email-{id}">Email</FieldLabel>
                        <Input
                            id="email-{id}"
                            type="email"
                            placeholder="user@example.com"
                            required
                            bind:value={email}
                        />
                    </Field>
                    <br />
                    <Field>
                        <Button type="submit" onclick={handleForgetPassword}
                            >Login</Button
                        >
                    </Field>
                </form>
            </div>
        </Card.Content>
    </Card.Root>
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
