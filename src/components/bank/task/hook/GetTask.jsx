import {useCallback, useState} from "react";
import {getTaskApi} from "../Api.js";

export const useGetTask = () => {
    const [task, setTask] = useState([]);

    const getTask = useCallback(async (token, showAlert, id, editor) => {
        const result = await getTaskApi(token, id);
        if (result.success) {
            setTask(result.data);
            editor.append(result.data.description)
        } else {
            showAlert("danger", "Ошибка получения задачи", result.error);
        }

    }, []);

    return { getTask, task, setTask };
};
