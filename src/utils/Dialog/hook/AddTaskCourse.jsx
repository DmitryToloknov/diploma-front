import {useCallback, useState} from "react";
import {addTaskInCourseApi, createSkillApi} from "../Api.jsx";

export const useAddTaskInCourse = () => {
    const [isLoading, setLoading] = useState(false);

    const addTaskInCourse = useCallback(async (token, showAlert, id, taskId) => {
        try {
            setLoading(true);
            const result = await addTaskInCourseApi(token, id, taskId);
            if (result.success) {
                showAlert("success", "Добавление задачи", "Задача успешно добавлена");
            } else {
                showAlert("danger", "Добавление задачи", result.error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { addTaskInCourse, isLoading };
};
