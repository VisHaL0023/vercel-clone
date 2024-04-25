import React from "react";
import DarkModeBtn from "../DarkModeBtn";
import VercelSvg from "../svg/vercel-svg";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Label } from "./label";

type Props = {};

export default function Footer({}: Props) {
    return (
        <div className="p-8 border-t border-gray-400 flex justify-between gap-3 flex-col">
            {/* top section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <VercelSvg />
                    <Label>© 2024</Label>
                    <Label className="text-blue-700">All systems normal</Label>
                </div>
                <div>
                    <DarkModeBtn />
                </div>
            </div>
            <div className="flex items-center flex-wrap justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                    <p>
                        <FaGithub />
                    </p>
                    <p>
                        <FaXTwitter />
                    </p>
                </div>

                <Label>Home</Label>
                <Label>Documentation</Label>
                <Label>Guides</Label>
                <Label>Help</Label>
                <Label>Contact sales</Label>
                <Label>Blog</Label>
                <Label>Changelog</Label>
                <Label>Pricing</Label>
                <Label>Legal</Label>
            </div>
        </div>
    );
}
