import Header from "./components/header/Header.jsx";
import Body from "./components/body/Body.jsx";
import Auth from "./components/body/auth/Auth.jsx";
import Refresh from "./components/auth-context/Refresh.jsx";
import React from "react";

export default function App() {

    return (
        <>
            <Refresh />
            <Header />
            <Body />
            <Auth />
        </>
    )
}


