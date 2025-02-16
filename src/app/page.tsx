import { SessionProvider } from "next-auth/react";
import HomeContent from "@/components/HomePageContent";

export default function Home() {
    return (
        <SessionProvider>
            <HomeContent />
        </SessionProvider>
    );
}
