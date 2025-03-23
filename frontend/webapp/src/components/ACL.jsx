import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/authContext";

const config = {
  mustNotBeLoggedIn: ["/sign-in", "/sign-up"],
  protectedRoutes: ["/profile/edit"],
};

const ACL = ({ children }) => {
  const router = useRouter();
  const { currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeError", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    // check if the user is not logged in and trying to access a protected route
    if (config.protectedRoutes.includes(router.pathname) && !currentUser) {
      router.push("/sign-in");
      toast.error("You must be logged in to access this page", {id: "unauth"});
      setIsLoading(true);
      return;
    }

    // check if the user is logged in and trying to access a route that requires them to be logged out
    if (config.mustNotBeLoggedIn.includes(router.pathname) && currentUser) {
      router.push("/");
      setIsLoading(true);
      toast.error("You are already logged in", {id: "auth"});
      return;
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return children;
};

export default ACL;
