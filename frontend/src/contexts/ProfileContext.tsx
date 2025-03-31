import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserProfile } from "../services/authServices";

interface UserProfile {
    id: string | null;
    username: string | null;
    bio: string
    email: string | null;
    profilePictureUrl: string | null;
    roles: string[]
    fetchProfile: () => Promise<void>
}

interface ProfileContextType {
  profile: UserProfile | null;
  fetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res) {
        setProfile(res);  
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
