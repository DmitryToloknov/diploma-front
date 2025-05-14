import {useCallback, useState} from "react";
import {getCoursesApi} from "../Api.jsx";

export const useGetCourses = () => {
    const [courses, setCourses] = useState([]);

    const getCourses = useCallback(async (token, showAlert, filter, page, perPage) => {
        const result = await getCoursesApi(token, filter, page, perPage);
        if (result.success) {
            setCourses(result.data);
        } else {
            showAlert("danger", "Ошибка получения курсов", result.error);
        }

    }, []);

    return {getCourses, courses};
};
