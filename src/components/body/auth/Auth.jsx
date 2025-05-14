import React, {useState} from 'react';
import classes from './Auth.module.css'
import {SERVER_URL} from "../../../utils/constant.js";
import {useAuth} from "../../auth-context/AuthProvider.jsx";

export default function Auth() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const {setToken, closeModal, isModalOpen, setAuth, setRefresh} = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const close = () => {
        setLogin('');
        setPassword('');
        setErrorMessage('');
        closeModal();
    };

    const clickClose = (e) => {
        if (e.target === e.currentTarget) {
            close(); // Закрытие модального окна, если кликнули за пределы окна
        }
    };

    const handleLogin = async () => {
        if (!login || !password) {
            setErrorMessage('Пожалуйста, заполните все поля!');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(SERVER_URL + "auth/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({login, password})
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data);
                return;
            }
            setAuth(true);
            setToken(data.accessToken);
            setRefresh(true);
            close();
        } catch (error) {
            console.log(error);
            setErrorMessage('Ошибка #500, обратитесь к администратору сайта!');
        } finally {
            setIsLoading(false);
        }
    }
    if (!isModalOpen) {
        return null;
    }

    return (
        <div className={classes.modal} onClick={clickClose}>
            <div className={classes.auth}>
                <div className={classes.title}>
                    Авторизация
                </div>
                <div className={classes.info}>{errorMessage}</div>
                <div className={classes.blockInput}>
                    <input className={classes.input} type="text" value={login} placeholder="Логин"
                           onChange={e => setLogin(e.target.value)}/>
                </div>
                <div className={classes.blockInput}>
                    <input className={classes.input} type="password" value={password} placeholder="Пароль"
                           onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className={classes.button}>
                    <button className={classes.buttonAuth} disabled={isLoading} onClick={handleLogin}>
                        {isLoading ? (
                            <div className={classes.loader}></div> // Анимация загрузки
                        ) : (
                            'войти'
                        )}</button>
                </div>
            </div>
        </div>
    )
}