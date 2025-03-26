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


export const fetchFeed = async () => {
    try {
      const token = localStorage.getItem("access");
  
      if (!token) {
        throw new Error("No auth token found, please log in again.");
      }
  
      const response = await fetch(BASE_URL + "/api/posts/get-feed", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }, 
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status}`);
      }
  
      const data = await response.json();
      return (data || []);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  export async function updateProfile(username: string,email: string , bio: string): Promise<boolean> {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("User not authenticated");
      }
  
      const response = await fetch(BASE_URL + "/api/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          bio
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating profile:", errorData);
        return false;
      }
  
      const data = await response.json();
      console.log("Profile updated:", data);
      return true;
    } catch (err) {
      console.error("Error during profile update:", err);
      return false;
    }
  }
  
 export async function changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("User not authenticated");
      }
  
      const response = await fetch(BASE_URL + "/api/profile/change-password", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error changing password:", errorData);
        return false;
      }
  
      const data = await response.json();
      console.log("Password changed:", data);
      return true;
    } catch (err) {
      console.error("Error during password change:", err);
      return false;
    }
  }
  

  export async function uploadAvatar(avatarFile: FormData): Promise<boolean> {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        throw new Error("User not authenticated");
      }
   
  
      const response = await fetch(BASE_URL + "/api/profile/upload-avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` 
        },
        body: avatarFile
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error uploading avatar:", errorData);
        return false;
      }
  
      const data = await response.json();
      console.log("Avatar uploaded:", data);
      return true;
    } catch (err) {
      console.error("Error during avatar upload:", err);
      return false;
    }
  }

export const handleLogout = () =>{
  localStorage.clear()
}

export const getFollowing = async () => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(BASE_URL + "/api/follow/following", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch following");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching following:", err);
    return [];
  }
};

export const getProfile = async (username: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/profile/${username}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
 

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
};

export const addFollow = async (userid: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/follow/${userid}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to follow: ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};

  } catch (err) {
    console.error("Error following:", err);
    return null;
  }
};


export const deleteFollow = async (userid: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/follow/${userid}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to unfollow: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error unfollowing:", err);
    return null;
  }
};

export const likePost = async (postid: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const postIdNumber = Number(postid);
    if (isNaN(postIdNumber)) {
      throw new Error("Invalid post ID format");
    }

    const response = await fetch(`${BASE_URL}/api/posts/${postIdNumber}/likes`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("Response Status:", response.status);
 
    const text = await response.text(); 
    return text ? JSON.parse(text) : {};

  } catch (err) {
    console.error("Error liking post:", err);
    return null;
  }
};
