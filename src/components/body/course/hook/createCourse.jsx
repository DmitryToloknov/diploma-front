import {COURSE_SETTINGS} from "../../../../utils/constant.js";
import {useNavigate} from "react-router-dom";
import {createCourseApi} from "../Api.jsx";
import {useCallback, useState} from "react";

export const useCreateCourse = () => {
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createCourse = useCallback(async (token, showAlert) => {
        try {
            setLoading(true);
            const result = await createCourseApi(token);
            if (result.success) {
                const courseId = JSON.parse(result.data);
                navigate(COURSE_SETTINGS + "/" + courseId);
            } else {
                showAlert("danger", "Ошибка создания курса", result.error);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { createCourse, isLoading };
};
