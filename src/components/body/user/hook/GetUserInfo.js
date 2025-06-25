import {useCallback, useState} from "react";
import {getUserInfoApi} from "../Api.js";

export const useGetUserInfo = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loaded, setLoaded] = useState(false);

    const getUserInfo = useCallback(async (token, showAlert) => {
        const result = await getUserInfoApi(token);
        if (result.success) {
            setUserInfo(result.data);
            setLoaded(true)
        } else {
            showAlert("danger", "Ошибка получения информации о пользователе", result.error);
        }
    }, []);

    return { getUserInfo, userInfo: userInfo, userLoaded: loaded };
};
