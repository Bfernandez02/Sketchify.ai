import React, { useContext, useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null);
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [isEmailUser, setIsEmailUser] = useState(false);
	const [isGoogleUser, setIsGoogleUser] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			initializeUser(user).then(() => setLoading(false));
		});
		return unsubscribe;
	}, []);

	async function initializeUser(user) {
		if (!user) {
			setCurrentUser(null);
			setUserLoggedIn(false);
			return;
		}

		let additionalData = {}; // Extra fields from Firestore (users collection)

		try {
			const userDoc = await getDoc(doc(db, "users", user.uid));
			if (userDoc.exists()) {
				additionalData = userDoc.data();
			}
		} catch (error) {
			console.error("Error fetching user data:", error);
		}

		const formattedUser = {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL,
			provider: user.providerData[0]?.providerId,
			emailVerified: user.emailVerified,
			savedPosts : additionalData.savedPosts || [], // Initialize savedPosts to an empty array if not present
			...additionalData, // Merge Firestore user collection fields
		};

		setCurrentUser(formattedUser);
		setUserLoggedIn(true);
		setIsEmailUser(
			user.providerData.some((p) => p.providerId === "password")
		);
		setIsGoogleUser(
			user.providerData.some(
				(p) => p.providerId === GoogleAuthProvider.PROVIDER_ID
			)
		);
	}

	const value = {
		userLoggedIn,
		isEmailUser,
		isGoogleUser,
		currentUser,
		setCurrentUser,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
