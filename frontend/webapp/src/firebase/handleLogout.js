import { auth } from "./config";
import Router from "next/router";
export default function handleLogout() {
    auth.signOut();
    Router.push("/");
}