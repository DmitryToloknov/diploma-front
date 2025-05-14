import {useCallback, useState} from "react";
import {getCourseApi, getInfoCourseApi} from "../Api.jsx";

export const useGetInfoCourse = () => {
    const [course, setCourse] = useState({});

    const getInfoCourse = useCallback(async (token, showAlert, id) => {
        const result = await getInfoCourseApi(token, id);
        if (result.success) {
            setCourse(result.data);
            editor.append(result.data.description)
        } else {
            showAlert("danger", "Ошибка получения информации о курсе", result.error);
        }

    }, []);

    return { getInfoCourse, course };
};
