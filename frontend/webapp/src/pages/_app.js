import "@/styles/globals.css";
import "@/styles/utility-classes.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
