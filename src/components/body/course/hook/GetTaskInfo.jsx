import {useCallback, useState} from "react";
import {getTaskInfoApi} from "../Api.jsx";

export const useGetTaskInfo = () => {
    const [task, setTask] = useState({});

    const getTaskInfo = useCallback(async (token, showAlert, id, courseId) => {
        const result = await getTaskInfoApi(token, id, courseId);
        if (result.success) {
            setTask(result.data);
        } else {
            showAlert("danger", "Ошибка получения задачи", result.error);
        }

    }, []);

    return { getTaskInfo, task, setTask };
};
