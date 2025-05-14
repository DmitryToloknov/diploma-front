import {useCallback, useState} from "react";
import {getTasksApi} from "../Api.jsx";

export const useGetTasks = () => {
    const [tasks, setTasks] = useState([]);

    const getTasks = useCallback(async (token, showAlert, id) => {
        const result = await getTasksApi(token, id);
        if (result.success) {
            setTasks(result.data);
        } else {
            showAlert("danger", "Ошибка получения задач", result.error);
        }

    }, []);

    return { getTasks, tasks };
};
