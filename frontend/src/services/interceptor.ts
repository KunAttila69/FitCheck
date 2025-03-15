export const BASE_URL = "https://localhost:7293"

async function refreshAccessToken() {
    if(!localStorage.getItem("refresh")){
        throw new Error("No refresh token!")
    }

    try{
        const response = await fetch(BASE_URL + "/api/auth/refresh",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refresh: localStorage.getItem("refresh")
                })
            }
        )

        if(response.ok){
            console.log("Successfull access token refresh!")
            const data = await response.json()
            localStorage.setItem("access", data.access)
        }else{
            if(response.status === 401){
                console.warn("Refresh token expired!")
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
            }else{
                throw new Error("Failed to refresh token: STATUS "+ response.status)
            }
        }
    }catch(err){
        throw err
    }
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {

    if(!localStorage.getItem("access")){
        await refreshAccessToken()
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${localStorage.getItem("access")}`
    }

    try{
        const response = await fetch(url, {...options, headers})

        if(response.status === 401){
            console.warn("Access token expired!")
            await refreshAccessToken()
            const retryHeaders = {

                ...options.headers,
                Authorization: `Bearer ${localStorage.getItem("access")}`
            }

            return await fetch(url, {...options, headers: retryHeaders})
        }

        return response
    }catch(err){
        console.error(err)
        throw err
    }
}