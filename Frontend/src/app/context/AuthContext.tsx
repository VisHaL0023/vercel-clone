"use client";

import {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
} from "react";

interface ContextProps {
    user: any;
    setUser: Dispatch<SetStateAction<any>>;
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
}

const GlobalContext = createContext<ContextProps>({
    user: {},
    setUser: (): any => {},
    token: "",
    setToken: (): string => "",
});

interface GlobalContextProps {
    children: React.ReactNode; // Generic type for any valid React child
}

export const GlobalContextProvider = ({ children }: GlobalContextProps) => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState<string | null>("");

    return (
        <GlobalContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
