import {useCallback, useState} from "react";
import {getTaskInfoForCourseApi} from "../Api.jsx";

export const useGetTaskInfoForCourse = () => {
    const [taskInfo, setTaskInfo] = useState({});

    const getTaskInfoForCourse = useCallback(async (token, showAlert, courseId) => {
        const result = await getTaskInfoForCourseApi(token, courseId);
        if (result.success) {
            setTaskInfo(result.data);
        } else {
            showAlert("danger", "Ошибка получения информации о задачах", result.error);
        }

    }, []);

    return { getTaskInfoForCourse, taskInfo };
};
