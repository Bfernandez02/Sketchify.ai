export interface UserData {
  uid: string;
  name: string;
  email: string;
  bio?: string;
  profileImage?: string;
  bannerImage?: string;
  createdAt: string;
  updatedAt: string;
  savedPosts?: string[];
}
export interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    logout: () => Promise<void>;
}

