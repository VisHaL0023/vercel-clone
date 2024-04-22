"use client";
import Header from "@/components/Header";
import ProjectSection from "@/components/ProjectSection";
import SearchSection from "@/components/SearchSection";
import Footer from "@/components/ui/Footer";
import { getSession } from "@/lib/getSession";
import { useRouter } from "next/navigation";

export default function Home() {
    const session = getSession();
    const router = useRouter();

    console.log("session", session);

    if (!session) {
        console.log("Redirecting to login page...");
        router.push("/auth");
        console.log("After redirection");
        return null;
    }

    return (
        <div className="min-h-screen w-full flex gap-7 flex-col  ">
            <Header />
            <section className="max-w-8xl  px-8 flex flex-col gap-7 mx-auto w-full">
                <SearchSection />
                <ProjectSection />
            </section>
            <Footer />
        </div>
    );
}
