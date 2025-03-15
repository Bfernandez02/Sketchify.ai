import "@/styles/globals.css";
import "@/styles/utility-classes.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/authContext";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster />

      <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </>
  );
}
