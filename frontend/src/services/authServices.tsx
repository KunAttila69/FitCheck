import { authFetch, BASE_URL } from "./interceptor"

type LoginResponse = {
    refresh: string,
    access: string
}

export async function loginUser(username: string, password: string) {
    try {
        const response = await fetch(BASE_URL + "/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Login failed!");
        }

        const tokens: LoginResponse = await response.json();
        localStorage.setItem("refresh", tokens.refresh);
        localStorage.setItem("access", tokens.access);
        return tokens;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}


export async function getUserProfile(){
    try{
        const response = await authFetch(BASE_URL + "/api/userProfile")
        const data = await response.json()

        return data
    }catch(error){
        console.error("Error during data fetch", error);
        return undefined
    }
}

interface Props {
    username: String,
    email: String,
    password: String,
}

export const registerUser = async ({username, email, password} : Props) => {
    try {
        const response = await fetch(BASE_URL + "/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to register user");
        }

        return await response.json();
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};
