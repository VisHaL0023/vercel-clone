/* eslint-disable react/no-unescaped-entities */
import React, { ChangeEvent, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { IoCreate } from "react-icons/io5";
import toast from "react-hot-toast";
import axiosInstance from "@/config/axiosInstance";
import { useGlobalContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";

type Props = {};

interface ProjectData {
    gitURL: string;
    name: string;
    customDomain: string;
}

const CreateProject = (props: Props) => {
    const { token } = useGlobalContext();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [projectData, setProjectData] = useState<ProjectData>({
        gitURL: "",
        name: "",
        customDomain: "",
    });

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setProjectData({
            ...projectData,
            [name]: value,
        });
    }

    const isValidURL: boolean = useMemo(() => {
        if (!projectData.gitURL || projectData.gitURL.trim() === "")
            return false;
        const regex = new RegExp(
            /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/
        );

        return regex.test(projectData.gitURL);
    }, [projectData.gitURL]);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!projectData.name) {
            toast.error("Please enter name");
            setIsLoading(false);
            return;
        }
        if (!isValidURL) {
            toast.error("Please enter vaild URL");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post(
                "project/create",
                projectData,
                {
                    headers: {
                        Authorisation: token,
                    },
                }
            );

            console.log("response", response);
            const projectId = response.data.data.id;

            toast.success("Project created");
            router.push(`/deploy/?id=${projectId}`);
        } catch (error: any) {
            const message = error.response.data.message;
            toast.error(message);
            console.log(error, "Something went worng");
        }
        setIsLoading(false);
    }

    return (
        <div>
            <div className="h-[400px] flex flex-row items-center justify-evenly mt-5">
                <div className="flex flex-col items-start justify-between gap-5">
                    <p className="text-4xl font-bold">
                        Let's build something new
                    </p>
                    <p className="text-base text-gray-300">
                        To deploy a new React/Vite Project, import an existing
                        Git
                        <br />
                        Repository or paste your gitHub repo URL.
                    </p>
                </div>
                <div className="flex flex-col items-start justify-center">
                    <div className="w-[500px] border border-gray-400 rounded-lg p-3 mt-5">
                        <form onSubmit={onSubmit}>
                            <CardHeader>
                                <CardTitle>Create project</CardTitle>
                                <CardDescription>
                                    Deploy your new project in one-click.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            name="name"
                                            className="mb-3"
                                            placeholder="Project name"
                                            type="text"
                                            value={projectData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">
                                            Custom Domain
                                        </Label>
                                        <Input
                                            name="customDomain"
                                            className="mb-3"
                                            placeholder="Enter Custom Domain if you want"
                                            type="text"
                                            value={projectData.customDomain}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">GitHub URL</Label>
                                        <Input
                                            name="gitURL"
                                            className="mb-3"
                                            placeholder="Enter GitHub URL"
                                            type="text"
                                            value={projectData.gitURL}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button
                                    className="border border-gray-400"
                                    variant={"default"}
                                    size={"xl"}
                                    disabled={isLoading}
                                >
                                    <IoCreate className="mr-3 h-5 w-5" />
                                    <p className="text-base">
                                        Create your project
                                    </p>
                                </Button>
                            </CardFooter>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;
