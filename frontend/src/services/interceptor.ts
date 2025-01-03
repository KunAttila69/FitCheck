export const BASE_URL = ""

async function refreshAccessToken() {
    if(!localStorage.getItem("refresh")){
        throw new Error("No refresh token");
    }    

    try{
        const response = await fetch(BASE_URL + "/api/token/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh: localStorage.getItem("refresh")
            })
        })

        if(response.ok){
            console.log("Successful access token refresh!")
            const data = await response.json()
            localStorage.setItem("access", data.access)
        }else{
            if(response.status === 401){
                console.warn("Refresh token expired!");
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
            }else{
                throw new Error(`Failed refresh token: STATUS ${response.status}`)
            }
        }
    } catch(error){
        throw error
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

            return await fetch(url, {...options,headers: retryHeaders})
        }

        return response
    
    } catch(error){
        console.error(error)
        throw error
    }
}