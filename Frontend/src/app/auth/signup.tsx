"use client";
import React, { useCallback, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { Input } from "@/components/ui/input";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

interface Props {
    setVarriant: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    otp: string;
}

const SignUp: React.FC<Props> = ({ setVarriant }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sendOTP, setSendOTP] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        otp: "",
    });

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    }

    async function sendOtp(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (
            !userData.firstName ||
            !userData.lastName ||
            !userData.email ||
            !userData.password
        ) {
            toast.error("All fields required");
            return;
        }

        try {
            const response = await axiosInstance.post("auth/sendotp", {
                email: userData.email,
            });
            console.log("otp response", response);
            toast.success("OTP sent");
            setSendOTP(true);
        } catch (error) {
            console.log("Error while sending OTP");
        }
        setIsLoading(false);
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (
            !userData.firstName ||
            !userData.lastName ||
            !userData.email ||
            !userData.password ||
            !userData.otp
        ) {
            toast.error("All fields required");
            return;
        }

        try {
            const response = await axiosInstance.post("auth/signup", userData);
            console.log("response", response);
            toast.success("User created");
            setVarriant("email");
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
        setIsLoading(false);
    }

    const toggleVariant = useCallback(() => {
        setVarriant((currentVariant) =>
            currentVariant === "email" ? "authProvider" : "email"
        );
    }, []);

    return (
        <div className="h-[400px] mt-10 flex flex-col items-center gap-3 justify-center">
            <p className="text-3xl font-bold">
                {!sendOTP ? "Sign up to Vercel" : "Enter your OTP"}
            </p>

            <form
                className="mt-5 flex flex-col gap-3 justify-center items-center"
                onSubmit={!sendOTP ? sendOtp : onSubmit}
            >
                {!sendOTP ? (
                    <>
                        <Input
                            name="firstName"
                            className="mb-3"
                            placeholder="First name"
                            type="text"
                            value={userData.firstName}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="lastName"
                            className="mb-3"
                            placeholder="Last name"
                            type="text"
                            value={userData.lastName}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="email"
                            className="mb-3"
                            placeholder="Email address"
                            type="email"
                            value={userData.email}
                            onChange={handleInputChange}
                        />
                        <Input
                            name="password"
                            className="mb-3"
                            placeholder="Password"
                            type="password"
                            value={userData.password}
                            onChange={handleInputChange}
                        />
                    </>
                ) : (
                    <Input
                        name="otp"
                        className="mb-3"
                        placeholder="Enter OTP"
                        type="text"
                        max={6}
                        min={6}
                        value={userData.otp}
                        onChange={handleInputChange}
                    />
                )}
                <Button
                    className="border border-gray-400"
                    variant={"default"}
                    size={"xl"}
                    disabled={isLoading}
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
            </form>
        </div>
    );
};

export default SignUp;
