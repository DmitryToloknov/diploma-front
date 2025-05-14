import {useCallback, useState} from "react";
import {startTaskApi} from "../Api.js";

export const useStartTask = () => {
    const [isLoadingStartTask, setIsLoadingStartTask] = useState(false);

    const startTask = useCallback(async (token, showAlert, id) => {
        try {
            setIsLoadingStartTask(true);
            const result = await startTaskApi(token, id);
            if (result.success) {
                showAlert("success", "Запуск тест кейсов", "Тест кейсы успешно запущены.");
            } else {
                showAlert("danger", "Запуск тест кейсов", result.error);
            }
        } finally {
            setIsLoadingStartTask(false);
        }
    }, []);

    return {startTask, isLoadingStartTask};
};
