import { authFetch, BASE_URL } from "./interceptor" 

export async function loginUser(username: string, password: string) {
    try {
        const response = await fetch(BASE_URL + "/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const tokens = await response.json();
        console.log("Response JSON:", tokens);
 
        if (!tokens.refreshToken || !tokens.accessToken) {
            console.error("Tokens are missing required fields!");
            return undefined;
        }

        console.log(`Refresh: ${tokens.refreshToken}, \nAccess: ${tokens.accessToken}`);
        
        localStorage.setItem("refresh", tokens.refreshToken);
        localStorage.setItem("access", tokens.accessToken);
        
        return { status: response.status, tokens };
    } catch (err) {
        console.error("Login error:", err);
        return undefined;
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

export async function uploadPost(caption: string, files: File[]) {
    const token = localStorage.getItem("access");

    if (!token) {
        throw new Error("User not authenticated");
    }

    const formData = new FormData();
    formData.append("caption", caption);
    files.forEach(file => formData.append("files", file));

    try {
        const response = await fetch(BASE_URL + "/api/posts/create-post", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        const responseData = await response.json();
        console.log("Server response:", responseData);

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to upload post");
        }

        return responseData;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
}