/** @format */

import React, { useEffect, useState } from "react";
import SearchSection from "./SearchSection";
import AllProjects from "./AllProjects";
import CreateProject from "./CreateProject";

type Props = {};

export default function ProjectSection({}: Props) {
    const [currSection, setCurrSection] = useState<string>("allproject");

    useEffect(() => {}, [currSection]);

    return (
        <div className="max-w-8xl  px-8 flex flex-col gap-5 mx-auto w-full">
            <SearchSection setCurrSection={setCurrSection} />
            {currSection === "allproject" ? <AllProjects /> : <CreateProject />}
        </div>
    );
}
