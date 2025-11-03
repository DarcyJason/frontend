<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { writable } from "svelte/store";

    let email = $state("");
    let password = $state("");
    const error = writable("");
    const loading = writable(false);

    async function handleLogin() {
        error.set("");
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
            if (!response.ok) {
                throw new Error("Invalid email or password");
            }
            const authHeader = response.headers.get("Authorization");
            if (!authHeader) {
                throw new Error("No authorization header found");
            }
            const accessToken = authHeader.replace("Bearer", "");
            localStorage.setItem("access_token", accessToken);
            window.location.href = "/dashboard";
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
            <Card.Title>Login to your account</Card.Title>
            <Card.Action>
                <Button variant="link" href="/register">Sign Up</Button>
            </Card.Action>
        </Card.Header>
        <Card.Content>
            <form onsubmit={handleLogin}>
                <div class="flex flex-col gap-6">
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
                            <a
                                href="##"
                                class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            bind:value={password}
                        />
                    </div>
                </div>
            </form>
        </Card.Content>
        <Card.Footer class="flex-col gap-2">
            <Button type="submit" class="w-full">Login</Button>
        </Card.Footer>
    </Card.Root>
</div>
