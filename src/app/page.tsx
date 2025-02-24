import { SessionProvider } from "next-auth/react";
import HomeContent from "@/components/HomePageContent";
import {Toaster} from "@/components/ui/sonner";

export default function Home() {
    return (
        <SessionProvider>
            <HomeContent />
            <Toaster position="top-right" expand={true}
                     toastOptions={{
                         className: "!absolute !right-0 !top-0 !m-0",
                     }}/>
        </SessionProvider>
    );
}
