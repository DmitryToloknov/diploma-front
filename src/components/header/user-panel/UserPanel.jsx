import classes from './UserPanel.module.css'
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import {MY, NEWS, SERVER_URL} from "../../../utils/constant.js";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {UserLabel} from "@gravity-ui/uikit";

export default function UserPanel() {
    const { setToken, setAuth, isAuth, openModal, accessToken, setIsAuth, setRefresh} = useAuth();
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();
    function clickHandler(href) {
        navigate(href);
    }
    useEffect(() => {
        if (isAuth) {
            getFullName();
        }
    }, [isAuth]);

    const handleExit = async () => {
        try {
            await fetch(SERVER_URL + "auth/revoke", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    token: accessToken,
                }),
            });
            setAuth(false);
            setToken(null);
            setRefresh(false);
            navigate(NEWS);
        } catch (error) {
            console.log(error);
        }
    }

    const getFullName = async () => {
        try {
            const response = await fetch(SERVER_URL + "user/full-name", {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                setIsAuth(false);
                setToken('')
                console.log("Ошибка #5001, обратитесь к админестратору");
            }
            const fullName = await response.json();
            setFullName(`${fullName.name} ${fullName.surname}`);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {isAuth ? (
                <div className={classes.userBlock}>
                    <div onClick={() => clickHandler(MY)} className={classes.name}>
                        <UserLabel view={"clear"} type="person" size={"xs"}>{fullName}</UserLabel>
                    </div>
                    <div className={classes.auth} onClick={handleExit}>Выйти</div>
                </div>

            ) : (<div className={classes.userBlock}>
                    <div className={classes.auth} onClick={openModal}>Вход</div>
                </div>
                    )}
                </div>

            );
            }