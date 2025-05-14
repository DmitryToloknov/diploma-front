import {useCallback, useState} from "react";
import {getAttemptApi} from "../Api.jsx";

export const useGetAttempt = () => {
    const [attempt, setAttempt] = useState([]);

    const [loadingAttempt, setLoadingAttempt] = useState(false);

    const getAttempt = useCallback(async (token, showAlert, id) => {
        setLoadingAttempt(true);
        const result = await getAttemptApi(token,  id);
        if (result.success) {
            setAttempt(result.data);
        } else {
            showAlert("danger", "Ошибка получения истории", result.error);
        }
        setLoadingAttempt(false);
    }, []);

    return {getAttempt, attempt, setAttempt, loadingAttempt};
};
