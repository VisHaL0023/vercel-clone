/** @format */
import React, { useEffect } from "react";

import VercelSvg from "./svg/vercel-svg";
import { HiOutlineChevronUpDown } from "react-icons/hi2";

import { FiBell } from "react-icons/fi";
import { BsSlashLg } from "react-icons/bs";
import { FaEquals } from "react-icons/fa";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useGlobalContext } from "@/app/context/AuthContext";
import { tabNames } from "@/constant/tabName";
import { getCurrUser } from "@/lib/getSession";
import { useRouter } from "next/navigation";

type Props = {};

const pages = tabNames;

export default function Header() {
    const router = useRouter();
    const { user, setUser, setToken } = useGlobalContext();

    async function fetchData() {
        let token = localStorage.getItem("token");
        token = token ? token.replace(/^"|"$/g, "") : null;

        if (!token) {
            return;
        }
        const users = await getCurrUser(token);

        setToken(token);
        setUser(users);
    }

    useEffect(() => {
        fetchData();
    }, [setUser, setToken]);

    return (
        <div
            className=" px-8 pt-4 border-b border-gray-500"
            onClick={() => router.push("/")}
        >
            {/* first section */}
            <div className="flex justify-between  ">
                {/* left */}
                <div className="flex items-center gap-3  ">
                    <div className="cursor-pointers">
                        <VercelSvg />
                    </div>
                    {/* slash  */}
                    <BsSlashLg className="dark:text-gray-500" />

                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  h-5 w-5 rounded-full" />

                    <p className="font-bold">{user.firstName}</p>
                    <button
                        className=" p-2 text-xl transition-all hover:dark:bg-gray-800 py-3 rounded-md
        "
                    >
                        <HiOutlineChevronUpDown className="dark:text-gray-500" />
                    </button>
                </div>
                {/* right */}
                <div className=" flex gap-3  ">
                    {/* bell */}
                    <button className="border   h-9 w-9  flex items-center justify-center dark:border-gray-500 rounded-full dark:text-gray-500 dark:hover:text-white ">
                        <FiBell />
                    </button>
                    <button className="border   h-9 w-9  flex items-center justify-center dark:border-gray-500 rounded-full dark:text-gray-500 dark:hover:text-white ">
                        <FaEquals />
                    </button>
                    {/* equl */}
                </div>
            </div>

            {/* second section */}
            <section className="flex gap-4 overflow-auto scrollbar-hide">
                {pages.map((d, i) => (
                    <div
                        key={i}
                        className={cn("py-2 border-b-2  border-transparent", {
                            "dark:border-white": d.active,
                        })}
                    >
                        <Button
                            className={cn(
                                "hover:dark:bg-gray-900 text-gray-500",
                                {
                                    "dark:text-white": d.active,
                                }
                            )}
                            variant={"ghost"}
                            key={i}
                        >
                            {d.title}{" "}
                        </Button>
                    </div>
                ))}
            </section>
        </div>
    );
}
