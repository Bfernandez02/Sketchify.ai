import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/authContext";
import ACL from "@/components/ACL";
import React, { useEffect } from "react";
import Router from "next/router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import "@/styles/globals.css";
import "@/styles/utility-classes.css";

export default function App({ Component, pageProps }) {
	useEffect(() => {
		const handleStart = () => nProgress.start();
		const handleStop = () => nProgress.done();

		Router.events.on("routeChangeStart", handleStart);
		Router.events.on("routeChangeComplete", handleStop);
		Router.events.on("routeChangeError", handleStop);

		return () => {
			Router.events.off("routeChangeStart", handleStart);
			Router.events.off("routeChangeComplete", handleStop);
			Router.events.off("routeChangeError", handleStop);
		};
	}, []);

	return (
		<>
			<Toaster />
			<AuthProvider>
				<ACL>
					<Navbar />
					<Component {...pageProps} />
					<Footer />
				</ACL>
			</AuthProvider>
		</>
	);
}
