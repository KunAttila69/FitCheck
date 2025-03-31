import { authFetch, BASE_URL } from "./interceptor" 

/* Authentication Functions */
export async function loginUser(username: string, password: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
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
      const errorData = await response.json();
      console.error("Login error:", errorData);
      return { status: response.status, error: errorData.message || "Login failed." };
    }

    const tokens = await response.json();
    console.log("Response JSON:", tokens);
 
    if (!tokens.refreshToken || !tokens.accessToken) {
      console.error("Tokens are missing required fields!");
      return undefined;
    }



    localStorage.setItem("refresh", tokens.refreshToken);
    localStorage.setItem("access", tokens.accessToken);
    


    return { status: response.status, tokens };
  } catch (err) {
    console.error("Error during registration:", err);
    return { status: 500, error: "Network error. Please try again later." };
  }
}


export async function registerUser(username: string, email: string, password: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) { 
      const errorData = await response.json();
      console.error("Registration error:", errorData);
      return { status: response.status, error: errorData.message || "Registration failed." };
    }

    const data = await response.json();
    return { status: response.status, data };
  } catch (err) {
    console.error("Error during registration:", err);
    return { status: 500, error: "Network error. Please try again later." };
  }
}

export const handleLogout = () =>{
  localStorage.clear()
}

/* Data Functions */ 
export async function getUserProfile() {
  try{
    const response = await authFetch(`${BASE_URL}/api/profile`)
    const data = await response.json() 
    return data
  } catch(err){
    console.error("Error during fetch", err);
    return undefined
  }
}

export const fetchFeed = async (page = 1, pageSize = 10) => {
  try {
    const token = localStorage.getItem("access");

    if (!token) {
      throw new Error("No auth token found, please log in again.");
    }

    const response = await fetch(`${BASE_URL}/api/posts/get-feed?page=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
};

export const getFollowing = async () => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/follow/following`, {
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

export const getLeaderBoard = async () => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/leaderboard`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      } 
    });
 
    return response.json()
  } catch (err) {
    console.error("Error adding comment:", err);
    return null;
  }
}

export const getUserPosts = async (username: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/posts/user/${username}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      } 
    });
 
    return response.json()
  } catch (err) {
    console.error("Error fetching posts:", err);
    return null;
  }
}

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

/* Profile Functions */
export async function updateProfile(username: string,email: string , bio: string): Promise<boolean> {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }
    
    const newUsername = username == "" ? null : username

    const response = await fetch(`${BASE_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        newUsername,
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
 
export async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<boolean> {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }
 
    const response = await fetch(`${BASE_URL}/api/profile/change-password`, {
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

/* User Interaction Functions */
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
    
    if (await response.status === 204) {
      return true
    }
  } catch (err) {
    console.error("Error unfollowing:", err);
    return null;
  }
};

/* Post Functions */
export async function uploadPost(caption: string, files: File[]) {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const formData = new FormData();
    formData.append("caption", caption);
     
    files.forEach((file) => formData.append("Files", file));  

    const response = await fetch(`${BASE_URL}/api/posts/create-post`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to upload post");
    }

    return responseData;  
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export const likePost = async (postid: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/posts/${postid}/likes`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({}), 
    });
    console.log(response)
    console.log("Response Status:", response.status);

    const text = await response.text();
    console.log("Raw Response:", text);  
 
    try {
      return text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      return null;
    }

  } catch (err) {
    console.error("Error liking post:", err);
    return null;
  }
};


export const unlikePost = async (postid: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    } 

    const response = await fetch(`${BASE_URL}/api/posts/${postid}/likes`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
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

export const addComment = async (postId:string, text:string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }), 
    });

    console.log("Response Status:", response.status);

    const responseText = await response.text(); 
    return responseText ? JSON.parse(responseText) : {}; 

  } catch (err) {
    console.error("Error adding comment:", err);
    return null;
  }
}; 

export const getComments = async (postId:string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      } 
    });
 
    return response.json()
  } catch (err) {
    console.error("Error fetching comments:", err);
    return null;
  }
}

/* Notification Functions */
export const getNotifications = async () => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/notifications`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      } 
    }); 
    return response.json()
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return null;
  }
} 

export const markNotifications = async (notifications: any[]) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/notifications/mark-read`, {
      method: "POST", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationIds: notifications.map(notif => notif.id),
        markAll: true
      }),
    });
 

    return await response.json();
  } catch (err) {
    console.error("Error marking notifications:", err);
    return null;
  }
};

/* Moderator Functions */
export const flagPost = async (postId: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/moderator/posts/${postId}`, {
      method: "DELETE", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    return await response.json();
  } catch (err) {
    console.error("Error flaging post:", err);
    return null;
  }
};

export const flagComment = async (commentID: string) => {
  try {
    const token = localStorage.getItem("access");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/api/moderator/comments/${commentID}`, {
      method: "DELETE", 
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    return await response.json();
  } catch (err) {
    console.error("Error flaging comment:", err);
    return null;
  }
};