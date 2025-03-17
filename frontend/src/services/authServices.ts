import { authFetch, BASE_URL } from "./interceptor"
type LoginResponse = {
    refresh: string,
    access: string
}

export async function loginUser(username:string, password: string) {
    try{
        const response = await fetch(BASE_URL + "/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const tokens: LoginResponse = await response.json()

        localStorage.setItem("refresh", tokens.refresh)
        localStorage.setItem("access", tokens.access)
        return { status: response.status, tokens };
    }catch(err){
        console.error(err)
        return undefined
    }
}

export async function registerUser(username: string, email: string, password: string) {
    try {
        const response = await fetch(BASE_URL + "/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
            }),
        });

        if (!response.ok) { 
            const errorData = await response.json();
            console.error("Registration error:", errorData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return { status: response.status, data };
    } catch (err) {
        console.error("Error during registration:", err);
        return undefined;
    }
}

export async function getUserProfile() {
    try{
        const response = await authFetch(BASE_URL + "/api/profile")
        const data = await response.json()
        return data
    } catch(err){
        console.error("Error during fetch", err);
        return undefined
    }
}