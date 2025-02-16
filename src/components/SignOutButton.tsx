"use client";

import { Button } from "@/components/ui/button";
import {signOut} from "@/actions/auth";

export function SignOutButton() {
    return (
        <form
            action={async () => {
                await signOut();
            }}
        >
            <Button type="submit" variant="destructive" className="w-full">
                Sign Out
            </Button>
        </form>
    );
}
