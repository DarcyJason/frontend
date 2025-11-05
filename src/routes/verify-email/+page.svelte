<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
    import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
    import { writable } from "svelte/store";
    import { fade } from "svelte/transition";

    let email = "";
    let token = "";
    const error = writable("");
    const success = writable("");
    const loading = writable(false);

    function autoClear(store: typeof error | typeof success, ms = 5000) {
        setTimeout(() => store.set(""), ms);
    }

    async function handleVerifyEmail() {
        try {
            const response = await fetch(
                "http://localhost:7878/api/v1/auth/verify-email",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, email_token: token }),
                    credentials: "include",
                },
            );

            const data = await response.json();

            if (data.success) {
                success.set(data.success.message || "Verification successful");
                autoClear(success);
                setTimeout(() => (window.location.href = "/login"), 1500);
            } else if (data.error) {
                error.set(data.error.message || "Verification failed");
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

<div class="grid place-items-center h-screen">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title>Verification</Card.Title>
            <Card.Description></Card.Description>
        </Card.Header>
        <Card.Content>
            <form>
                <div class="flex flex-col gap-6">
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            required
                            bind:value={email}
                        />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Verification token</Label>
                            <a
                                href="##"
                                class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                                Haven't received it?
                            </a>
                        </div>
                        <Input
                            id="token"
                            type="text"
                            required
                            bind:value={token}
                        />
                    </div>
                </div>
            </form>
        </Card.Content>
        <Card.Footer class="flex-col gap-2">
            <Button type="submit" class="w-full" onclick={handleVerifyEmail}
                >Verify</Button
            >
        </Card.Footer>
    </Card.Root>

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
</div>
