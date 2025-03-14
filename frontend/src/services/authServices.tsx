const BASE_URL = "https://localhost:7293"

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

        const tokens: LoginResponse = await response.json()

        localStorage.setItem("refresh", tokens.refresh)
        localStorage.setItem("access", tokens.access)
        return tokens
    }catch(err){
        console.error(err)
        return undefined
    }
}