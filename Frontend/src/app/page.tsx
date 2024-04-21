import Header from "@/components/Header";
import ProjectSection from "@/components/ProjectSection";
import SearchSection from "@/components/SearchSection";
import Footer from "@/components/ui/Footer";

export default function Home() {
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
