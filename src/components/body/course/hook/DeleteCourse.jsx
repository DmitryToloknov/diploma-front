import {COURSES} from "../../../../utils/constant.js";
import {useNavigate} from "react-router-dom";
import {useCallback, useState} from "react";
import {deleteCourseApi} from "../Api.jsx";

export const useDeleteCourse = () => {
    const [isLoadingDeleteCourse, setLoadingDeleteCourse] = useState(false);
    const navigate = useNavigate();

    const deleteCourse = useCallback(async (token, showAlert, id) => {
        try {
            setLoadingDeleteCourse(true);
            const result = await deleteCourseApi(token, id);
            if (result.success) {
                navigate(COURSES);
            } else {
                showAlert("danger", "Ошибка удаления курса", result.error);
            }
        } finally {
            setLoadingDeleteCourse(false);
        }
    }, []);

    return { deleteCourse, isLoadingDeleteCourse };
};
