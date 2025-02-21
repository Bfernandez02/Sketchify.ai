import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut, signInWithCredential, OAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { router } from 'expo-router';
import { AuthContextType, User } from '@/types/auth';

const defaultContext: AuthContextType = {
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
    signInWithApple: async () => {},
    logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "YOUR_ANDROID_CLIENT_ID",
        clientId: "813596022105-hh0nt3tla212fb3ggdf937mv75hq3rse.apps.googleusercontent.com",
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                
                if (!userDoc.exists()) {
                    await setDoc(doc(db, 'users', firebaseUser.uid), {
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        createdAt: new Date().toISOString(),
                    });
                }

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).catch((error) => {
                console.error("Firebase sign-in error:", error);
            });
        }
    }, [response]);

    const signInWithGoogle = async (): Promise<void> => {
        try {
            const result = await promptAsync();
            if (result.type === 'error') {
                throw new Error(result.error?.message || 'Google Sign-In failed');
            }
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    };

    const signInWithApple = async (): Promise<void> => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const { identityToken } = credential;
            if (identityToken) {
                const provider = new OAuthProvider('apple.com');
                const oAuthCredential = provider.credential({
                    idToken: identityToken,
                    rawNonce: undefined,
                });
                await signInWithCredential(auth, oAuthCredential);
            }
        } catch (error) {
            console.error('Apple sign in error:', error);
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            router.replace('/');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        signInWithGoogle,
        signInWithApple,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};