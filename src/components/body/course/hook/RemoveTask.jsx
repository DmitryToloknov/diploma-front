import {useCallback, useState} from "react";
import {deleteTaskApi, updateCourseApi} from "../Api.jsx";

export const useRemoveTask = () => {

    const removeTask = useCallback(async (token, showAlert, id, taskId) => {
            const result = await deleteTaskApi(token, id, taskId);
            if (result.success) {
                showAlert("success", "Удаление задачи", "Задача успешно удалена!");
            } else {
                showAlert("danger", "Удаление задачи", result.error);
            }
    }, []);

    return { removeTask };
};
