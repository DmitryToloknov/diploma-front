import {TASK} from "../../../../utils/constant.js";
import {useNavigate} from "react-router-dom";
import {useCallback, useState} from "react";
import {createTaskApi} from "../Api.js";

export const useCreateTask = () => {
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createTask = useCallback(async (token, showAlert) => {
        try {
            setLoading(true);
            const result = await createTaskApi(token);
            if (result.success) {
                const courseId = JSON.parse(result.data);
                navigate(TASK + "/" + courseId);
            } else {
                showAlert("danger", "Ошибка создания задачи", result.error);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { createTask, isLoading };
};
