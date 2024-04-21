"use client";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Input } from "@/components/ui/input";

interface Props {
    setVarriant: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Email: React.FC<Props> = ({ setVarriant }) => {
    const toggleVariant = useCallback((val: string) => {
        setVarriant(val);
    }, []);
    return (
        <div className="h-[400px] mt-10 flex flex-col items-center gap-3 justify-center">
            <p className="text-3xl font-bold">Log in to Vercel</p>

            <div className="mt-5 flex flex-col gap-3 justify-center items-center">
                <Input className="mb-3" placeholder="Email address" />

                <Button
                    className="border border-gray-400"
                    variant={"default"}
                    size={"xl"}
                >
                    <CiMail className="mr-3 h-5 w-5" />
                    <p className="text-base">Continue with Email</p>
                </Button>

                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={() => toggleVariant("authProvider")}
                >
                    <p className="text-base mt-3 underline text-blue-700">
                        Log in with GitHub
                    </p>
                    <FaArrowRight className="mt-3 mr-3 text-blue-700" />
                </div>
            </div>
        </div>
    );
};

export default Email;
