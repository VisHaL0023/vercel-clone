"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Input } from "@/components/ui/input";

interface Props {
    setVarriant: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SignUp: React.FC<Props> = ({ setVarriant }) => {
    const [sendOTP, setSendOTP] = useState<boolean>(false);

    const toggleVariant = useCallback(() => {
        setVarriant((currentVariant) =>
            currentVariant === "email" ? "authProvider" : "email"
        );
    }, []);
    return (
        <div className="h-[400px] mt-10 flex flex-col items-center gap-3 justify-center">
            <p className="text-3xl font-bold">Sign up to Vercel</p>

            <div className="mt-5 flex flex-col gap-3 justify-center items-center">
                {!sendOTP ? (
                    <>
                        <Input
                            className="mb-3"
                            placeholder="First name"
                            type="text"
                        />
                        <Input
                            className="mb-3"
                            placeholder="Last name"
                            type="text"
                        />
                        <Input
                            className="mb-3"
                            placeholder="Email address"
                            type="email"
                        />
                        <Input
                            className="mb-3"
                            placeholder="Password"
                            type="password"
                        />
                    </>
                ) : (
                    <Input
                        className="mb-3"
                        placeholder="Enter OTP"
                        type="text"
                        max={6}
                        min={6}
                    />
                )}
                <Button
                    className="border border-gray-400"
                    variant={"default"}
                    size={"xl"}
                >
                    <CiMail className="mr-3 h-5 w-5" />
                    <p className="text-base">
                        {!sendOTP
                            ? "Create your vercel account"
                            : "Enter your OTP and continue"}
                    </p>
                </Button>
                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={toggleVariant}
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

export default SignUp;
