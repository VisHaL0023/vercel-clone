"use client";
import Header from "@/components/Header";
import ProjectSection from "@/components/ProjectSection";
import Footer from "@/components/ui/Footer";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/getSession";

export default function Home() {
    const token = getToken();
    const router = useRouter();

    if (!token) {
        router.push("/auth");
        return null;
    }

    return (
        <div className="min-h-screen w-full flex gap-7 flex-col  ">
            <Header />
            <section>
                <ProjectSection />
            </section>
            <Footer />
        </div>
    );
}
