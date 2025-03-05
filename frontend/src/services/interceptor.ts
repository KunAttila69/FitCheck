export const BASE_URL = "https://localhost:7293"

async function refreshAccessToken() {
    if(!localStorage.getItem("refresh")){
        throw new Error("No refresh token");
    }    

    try{
        const response = await fetch(BASE_URL + "/api/auth/refresh", {
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
    if (!localStorage.getItem("access")) {
        try {
            await refreshAccessToken();
        } catch {
            console.error("Authentication required");
            return Promise.reject(new Error("Authentication required"));
        }
    }

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${localStorage.getItem("access")}`);

    try {
        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            console.warn("Access token expired!");
            try {
                await refreshAccessToken();
                headers.set("Authorization", `Bearer ${localStorage.getItem("access")}`);
                return await fetch(url, { ...options, headers });
            } catch {
                console.error("Re-authentication failed.");
                return Promise.reject(new Error("Re-authentication failed"));
            }
        }

        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
