import {useEffect} from 'react';
import {SERVER_URL} from "../../utils/constant.js";
import {useAuth} from "./AuthProvider.jsx";

export default function Refresh() {
    const { setToken, setAuth, setRefresh, isRefresh, setWasRefreshed } = useAuth();

    const runFunction  = async  () => {
        try {
            const response = await  fetch(SERVER_URL+"auth/refresh", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const data = await  response.json();
            if (response.ok) {
                setAuth(true);
                setToken(data.accessToken);
            }

        } catch (error) {
            setRefresh(false);
            console.error('Ошибка при запросе токена:', error);
        }
        setWasRefreshed();
    };

    useEffect(() => {
        if (isRefresh) {
            runFunction();
            const intervalId = setInterval(runFunction, 240000);
            return () => clearInterval(intervalId);
        }
    }, [isRefresh]);
    return null;
}