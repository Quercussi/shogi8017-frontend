import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                action={async () => {
                    "use server";
                    await signIn("github");
                }}
            >
                <Button type="submit" className="px-8 py-4 text-lg">
                    Login
                </Button>
            </form>
        </div>
    );
}