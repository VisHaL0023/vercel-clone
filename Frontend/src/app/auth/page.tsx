"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Auth/Navbar";
import Footer from "@/components/ui/Footer";
import AuthProvider from "./authProvider";
import Email from "./email";
import SignUp from "./signup";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/getSession";

type Props = {};

const Page = (props: Props) => {
    const [varriant, setVarriant] = useState<string | undefined>(
        "authProvider"
    );
    const session = getSession();
    const router = useRouter();

    if (session) {
        router.push("/");
    }

    useEffect(() => {}, [varriant]);

    return (
        <div className="">
            <Navbar />
            {varriant === "authProvider" ? (
                <AuthProvider setVarriant={setVarriant} />
            ) : varriant === "signup" ? (
                <SignUp setVarriant={setVarriant} />
            ) : (
                <Email setVarriant={setVarriant} />
            )}
            <Footer />
        </div>
    );
};

export default Page;
