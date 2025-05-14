import {useCallback, useState} from "react";
import {updateCourseApi} from "../Api.jsx";

export const useUpdateCourse = () => {
    const [isLoadingUpdateCourse, setLoadingUpdateCourse] = useState(false);

    const updateCourse = useCallback(async (token, showAlert, course) => {
        try {
            setLoadingUpdateCourse(true);
            const result = await updateCourseApi(token, course);
            if (result.success) {
                showAlert("success", "Обновление курса", "Курс успешно обновлен");
            } else {
                showAlert("danger", "Ошибка обновление курса", result.error);
            }
        } finally {
            setLoadingUpdateCourse(false);
        }
    }, []);

    return { updateCourse, isLoadingUpdateCourse };
};
