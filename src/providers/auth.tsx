import AuthApi from '@/api/auth'
import type { LoginPayload, User } from '@/api/types/auth'
import * as React from 'react'

export interface AuthContextType {
    isAuthenticated: boolean
    login: (payload: LoginPayload) => Promise<void>
    logout: () => Promise<void>
    user: User | null
}

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const AuthContext = React.createContext<AuthContextType | null>(null)

const key = 'tanstack.auth.user'
const tokenKey = 'accessToken'

function getStoredUser(): User | null {
    try {
        return JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
        return null;
    }
}

function setStoredUser(user: User | null): void {
    if (user) {
        localStorage.setItem(tokenKey, user.token);
        localStorage.setItem(key, JSON.stringify(user));
    } else {
        localStorage.removeItem(key);
        localStorage.removeItem(tokenKey);
    }
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(getStoredUser())
    const isAuthenticated = !!user

    const logout = React.useCallback(async () => {
        setStoredUser(null)
        setUser(null)
        // Get the current path and query parameters
        const currentPathWithParams = window.location.pathname + window.location.search;
        // Encode the path and query parameters
        const redirectUrl = encodeURIComponent(currentPathWithParams);
        // Add query params to the login URL
        window.location.href = `/auth?redirect=${redirectUrl}`;

    }, [])


    const login = React.useCallback(
        async (payload: LoginPayload) => {
            try {
                // Call login API
                const response = await AuthApi.login(payload);
                const user = response.data.data.user;
                // Update state
                setStoredUser(user);
                setUser(user);

                // Handle redirect (if "?redirect=" is present in the current URL)
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get("redirect");
                if (redirect) {
                    window.location.href = decodeURIComponent(redirect);
                } else {
                    window.location.href = "/"; // default route
                }
            } catch (error: any) {
                console.error("Login failed:", error);
                // Optionally show error toast/alert
            }
        },
        []
    );


    React.useEffect(() => {
        setUser(getStoredUser())
    }, [])

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}