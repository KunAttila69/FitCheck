import { authFetch, BASE_URL } from "./interceptor"

type LoginResponse = {
    refresh: string,
    access: string
}

export async function loginUser(username: string, password: string){
    try{
        const response = await fetch(BASE_URL + "/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        const tokens : LoginResponse = await response.json()

        localStorage.setItem("refresh", tokens.refresh)
        localStorage.setItem("access", tokens.access)
        return tokens
    } catch(error) {
        console.error(error)
        return undefined
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