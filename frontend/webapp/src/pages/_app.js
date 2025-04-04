import "@/styles/globals.css";
import "@/styles/utility-classes.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/authContext";
import ACL from "@/components/ACL";
import React from "react";

export default function App({ Component, pageProps }) {
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
