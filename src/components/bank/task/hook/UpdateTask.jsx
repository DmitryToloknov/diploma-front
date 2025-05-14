import {useCallback, useState} from "react";
import {updateTaskApi} from "../Api.js";

export const useUpdateTask = () => {
    const [isLoading, setIsLoading] = useState(false);

    const updateTask = useCallback(async (token, showAlert, task) => {
        try {
            setIsLoading(true);
            const result = await updateTaskApi(token, task);
            if (result.success) {
                showAlert("success", "Обновление задачи", "Задача успешно обновилась");
            } else {
                showAlert("danger", "Ошибка обновления задачи", result.error);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {updateTask, isLoading};
};
