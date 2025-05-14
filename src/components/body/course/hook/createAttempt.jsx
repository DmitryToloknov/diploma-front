import {addAttemptApi} from "../Api.jsx";
import {useCallback, useState} from "react";

export const useCreateAttempt = () => {
    const [isLoadingCreateAttempt, setLoadingCreateAttempt] = useState(false);

    const createAttempt = useCallback(async (token, showAlert, taskId, courseId, attempt) => {
        try {
            setLoadingCreateAttempt(true);
            const result = await addAttemptApi(token, taskId, courseId, attempt);
            if (result.success) {
                showAlert("success", "Отправка кода на сервер", "Код успешно отправлен на проверку");
            } else {
                showAlert("danger", "Отправка кода на сервер", result.error);
            }
        } finally {
            setLoadingCreateAttempt(false);
        }
    }, []);

    return {createAttempt, isLoadingCreateAttempt};
};
