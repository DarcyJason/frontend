<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
</script>

<div class="grid place-items-center h-screen">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title>Sign up to Homeryland</Card.Title>
        </Card.Header>
        <Card.Content>
            <form>
                <div class="flex flex-col gap-6">
                    <div class="grid gap-2">
                        <label for="username">Username</label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <label for="confirm_password"
                                >Confirm Password</label
                            >
                        </div>
                        <Input id="confirm_password" type="password" required />
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
            <Button type="submit" class="w-full">Login</Button>
        </Card.Footer>
    </Card.Root>
</div>
