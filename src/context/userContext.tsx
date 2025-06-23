import { createContext, useContext, useState } from "react";
import { UserLogin, useUserStore } from "../client/store/authuser";
import { FormUser } from "../types/types";

interface UserContextType {
    handleLogin: (data: UserLogin) => Promise<void>;
    handleSignUp: (data: FormUser) => Promise<void>
}
const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const { login, signUp } = useUserStore.getState();
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const handleLogin = async (data: UserLogin) => {
        await login(data)
        localStorage.setItem("token", useUserStore.getState().token || "");
        setToken(token);
    };

    const handleSignUp = async ( data: FormUser) => {
        await signUp(data);
        localStorage.setItem("token", useUserStore.getState().token || "");
        setToken(token);
    };

    return (
        <UserContext.Provider value={{ handleLogin, handleSignUp }}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useAuth must be used within a UserProvider");
    }
    return context;
}