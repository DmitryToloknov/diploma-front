import {useCallback, useState} from "react";
import {getTasksApi} from "../Api.js";

export const useGetTasks = () => {
    const [tasks, setTasks] = useState([]);

    const getTask = useCallback(async (token, showAlert, filters, page, perPage) => {
        const result = await getTasksApi(token, filters, page, perPage);
        if (result.success) {
            setTasks(result.data);
        } else {
            showAlert("danger", "Ошибка получения задач", result.error);
        }

    }, []);

    return { getTask, tasks };
};
