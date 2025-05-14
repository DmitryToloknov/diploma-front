import {useCallback, useState} from "react";
import {getAttemptsApi} from "../Api.jsx";

export const useGetAttempts = () => {
    const [attempts, setAttempts] = useState([]);

    const getAttempts = useCallback(async (token, showAlert, taskId, courseId) => {
        const result = await getAttemptsApi(token,  taskId, courseId);
        if (result.success) {
            setAttempts(result.data);
        } else {
            showAlert("danger", "Ошибка получения истории", result.error);
        }

    }, []);

    return {getAttempts, attempts};
};
