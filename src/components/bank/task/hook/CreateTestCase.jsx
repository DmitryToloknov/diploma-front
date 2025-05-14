import {useCallback, useState} from "react";
import {createTestCaseApi} from "../Api.js";

export const useCreateTestCase = () => {
    const [isLoadingUpdateTask, setIsLoadingUpdateTask] = useState(false);

    const createTestCase = useCallback(async (token, showAlert, taskId, getTestCase) => {
        try {
            setIsLoadingUpdateTask(true);
            const result = await createTestCaseApi(token, taskId);
            if (result.success) {
                showAlert("success", "Создание кейса", "Тестовый кейс успешно создан");
                getTestCase(token, showAlert, taskId);
            } else {
                showAlert("danger", "Ошибка создания кейса", result.error);
            }
        } finally {
            setIsLoadingUpdateTask(false);
        }
    }, []);

    return { createTestCase, isLoadingUpdateTask };
};
