import React from "react";

type Props = {
    status: string;
};

const Dot = (props: Props) => {
    return (
        <>
            {props.status === "READY" && (
                <div className="w-3 h-3 rounded-full bg-green-600" />
            )}
            {props.status === "QUEUED" && (
                <div className="w-3 h-3 rounded-full bg-yellow-600" />
            )}
            {props.status === "NOT_STARTED" && (
                <div className="w-3 h-3 rounded-full bg-gray-600" />
            )}
            {props.status === "FAIL" && (
                <div className="w-3 h-3 rounded-full bg-red-600" />
            )}
            {props.status === "IN_PROGRESS" && (
                <div className="w-3 h-3 rounded-full bg-blue-600" />
            )}
        </>
    );
};

export default Dot;
