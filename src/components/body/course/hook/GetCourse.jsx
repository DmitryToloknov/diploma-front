import {useCallback, useState} from "react";
import {getCourseApi} from "../Api.jsx";

export const useGetCourse = () => {
    const [course, setCourse] = useState({});

    const getCourse = useCallback(async (token, showAlert, id, editor) => {
        const result = await getCourseApi(token, id);
        if (result.success) {
            setCourse(result.data);
            editor.append(result.data.description)
        } else {
            showAlert("danger", "Ошибка получения курса", result.error);
        }

    }, []);

    return { getCourse, course, setCourse };
};
