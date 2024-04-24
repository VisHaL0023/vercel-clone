"use client";
import Header from "@/components/Header";
import Footer from "@/components/ui/Footer";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useGlobalContext } from "../context/AuthContext";
import axiosInstance from "@/config/axiosInstance";
import { getToken } from "@/lib/getSession";
import { Fira_Code } from "next/font/google";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { extractRepoInfo } from "@/lib/helper";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {};
const firaCode = Fira_Code({ subsets: ["latin"] });

interface ProjectData {
    id: string;
    name: string;
    gitURL: string;
    subDomain: string;
    customDomain: string;
    createdAt: string;
}

const Page = (props: Props) => {
    const token = getToken();
    const { user } = useGlobalContext();
    const logContainerRef = useRef<HTMLElement>(null);

    const [projectData, setProjectData] = useState<ProjectData>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLogging, setIsLogging] = useState<boolean>(false);
    const [deployementId, setDeploymentId] = useState<string>("");
    const [isDone, setDone] = useState<Boolean>(false);
    const [deployPreviewURL, setDeployPreviewURL] = useState<
        string | undefined
    >();

    const searchParam = useSearchParams();
    const projectId = searchParam.get("id");

    async function fetchProjectData() {
        try {
            const response = await axiosInstance.post(
                "getproject",
                { id: projectId },
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );
            setProjectData(response.data.data);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }

    const handleClickDeploy = useCallback(async () => {
        if (!projectId) {
            toast.error("Project ID required");
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axiosInstance.post(
                "project/deploy",
                { projectId: projectId },
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );

            if (data && data.data) {
                const { deployementId, url } = data.data;
                setDeploymentId(deployementId);
                const { owner, repoName } = extractRepoInfo(url);
                setDeployPreviewURL(owner + "/" + repoName);
                setLogs([{ log: "Please wait, starting your build..." }]);
                setIsLogging(true);
            }

            console.log("response", data.data);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }, [projectId]);

    async function handleLogs() {
        if (!deployementId) {
            toast.error("Deployment ID not found");
            return;
        }
        try {
            const { data } = await axiosInstance.post(
                "project/logs",
                { deployementId: deployementId },
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );
            setLogs((prevLogs) => {
                // Filter out logs that are already present in the state
                const newLogs = data?.logs.filter(
                    (log: any) =>
                        !prevLogs.some((prevLog) => prevLog.log === log.log)
                );
                // Concatenate the new logs with the existing logs
                return [...prevLogs, ...newLogs];
            });

            logContainerRef.current?.scrollIntoView({ behavior: "smooth" });
            console.log("data", data);
            console.log("logs", logs);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
    }

    useEffect(() => {
        let intervalId: any;
        if (isLogging) {
            intervalId = setInterval(async () => {
                await handleLogs();
                logs.map((log) => {
                    if (log.log === "Done") {
                        clearInterval(intervalId);
                        setIsLogging(false);
                        setDone(true);
                    }
                });
            }, 3000);
        }
        return () => clearInterval(intervalId);
    }, [isLogging, logs]);

    useEffect(() => {
        fetchProjectData();
    }, []);

    useEffect(() => {}, [isDone]);

    return (
        <div>
            <div className="min-h-screen w-full flex gap-7 flex-col  ">
                <Header />
                <div className="flex items-start justify-between">
                    <CardHeader className="ml-2">
                        <CardTitle className="text-4xl ">
                            {`You're almost done`}
                        </CardTitle>
                        <CardDescription className="text-base">
                            Please follow the steps to configure your Project
                            and deploy it.
                        </CardDescription>
                    </CardHeader>
                    <div className="flex items-center justify-between gap-4 mr-5">
                        <Button
                            className="border border-gray-400 rounded-r-sm"
                            variant={"ghost"}
                        >
                            Repository
                        </Button>
                        <Button>Vist</Button>
                        {/* {!deployPreviewURL && (
                            <Card className="mt-2 bg-slate-900 px-2 rounded-lg">
                                {isDone ? (
                                    <div className="w-full">
                                        <CardContent>
                                            Preview URL:{" "}
                                            <a
                                                target="_blank"
                                                // className="text-sky-400 bg-sky-950 px-3 py-2 rounded-lg ml-3"
                                                href={deployPreviewURL}
                                            >
                                                {deployPreviewURL}
                                            </a>
                                        </CardContent>
                                    </div>
                                ) : (
                                    <p>
                                        Please wait while we deploying your
                                        project...
                                    </p>
                                )}
                            </Card>
                        )} */}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="w-[600px] mt-1 border rounded-lg border-gray-400 px-4 pt-6 ml-4">
                            <form>
                                <CardContent>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Name</Label>
                                            <Label htmlFor="name">
                                                {projectData?.name}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Sub Domain</Label>
                                            <Label htmlFor="name">
                                                {projectData?.subDomain}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Custom Domain</Label>
                                            <Label htmlFor="name">
                                                {projectData?.customDomain ? (
                                                    projectData?.customDomain
                                                ) : (
                                                    <Label className="text-gray-400">
                                                        Did not provided
                                                    </Label>
                                                )}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Created by</Label>
                                            <Label htmlFor="name">
                                                {user.firstName}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Deployed URL</Label>
                                            <Label htmlFor="name">
                                                {projectData?.createdAt}
                                            </Label>
                                        </div>
                                        <div className="flex space-y-1.5 items-center justify-between">
                                            <Label>Git URL</Label>
                                            <Label htmlFor="name">
                                                {projectData?.gitURL}
                                            </Label>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end mt-3">
                                    <Button
                                        className="border border-gray-400"
                                        variant={"default"}
                                        size={"default"}
                                        disabled={isLoading}
                                        onClick={handleClickDeploy}
                                    >
                                        <Label className="text-base">
                                            Deploy
                                        </Label>
                                    </Button>
                                </CardFooter>
                            </form>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        {logs.length > 0 && (
                            <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
                                <div
                                    className={`${firaCode.className} text-sm w-[400px] text-green-500 logs-container mt-5 border-green-500 border-2 rounded-lg p-4 h-[300px] overflow-y-auto`}
                                >
                                    <pre className="flex flex-col gap-1">
                                        {logs.map((log: any, i) => (
                                            <code
                                                ref={
                                                    logs.length - 1 === i
                                                        ? logContainerRef
                                                        : undefined
                                                }
                                                key={i}
                                            >
                                                {log && `> ${log.log}`}
                                            </code>
                                        ))}
                                    </pre>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Page;
