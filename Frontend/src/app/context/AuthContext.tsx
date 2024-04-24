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

export const GlobalContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, setToken] = useState<string | null>("");

    return (
        <GlobalContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
