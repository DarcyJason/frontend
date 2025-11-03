<script module></script>

<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { writable } from "svelte/store";

    let username = $state("");
    let email = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    const error = writable("");
    const success = writable("");
    const loading = writable(false);

    async function handleRegister() {
        error.set("");
        success.set("");
        loading.set(true);
        try {
            const response = await fetch(
                "http://localhost:7878/api/v1/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: username,
                        email: email,
                        password: password,
                        confirm_password: confirmPassword,
                    }),
                    credentials: "include",
                },
            );
            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || "Registration failed");
            }
            const data = await response.json();
            success.set(data.message || "Registration successful");
            window.location.href = "/login";
        } catch (e) {
            error.set((e as Error).message);
        } finally {
            loading.set(false);
        }
    }
</script>

<div class="grid place-items-center h-screen">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title>Sign up to Homeryland</Card.Title>
        </Card.Header>
        <Card.Content>
            <form onsubmit={handleRegister}>
                <div class="flex flex-col gap-6">
                    <div class="grid gap-2">
                        <label for="username">Username</label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            required
                            bind:value={username}
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            bind:value={email}
                        />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            bind:value={password}
                        />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <label for="confirm_password"
                                >Confirm Password</label
                            >
                        </div>
                        <Input
                            id="confirm_password"
                            type="password"
                            required
                            bind:value={confirmPassword}
                        />
                        <a
                            href="/login"
                            class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                            Already have an account?
                        </a>
                    </div>
                </div>
            </form>
        </Card.Content>
        <Card.Footer class="flex-col gap-2">
            <Button type="submit" class="w-full">Sign up</Button>
        </Card.Footer>
    </Card.Root>
</div>
