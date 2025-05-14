import {BANK_TASKS} from "../../../../utils/constant.js";
import {useNavigate} from "react-router-dom";
import {useCallback, useState} from "react";
import {deleteTaskApi} from "../Api.js";

export const useDeleteTask = () => {
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const deleteTask = useCallback(async (token, showAlert, id) => {
        try {
            setLoading(true);
            const result = await deleteTaskApi(token, id);
            if (result.success) {
                navigate(BANK_TASKS);
            } else {
                showAlert("danger", "Ошибка удаления задачи", result.error);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { deleteTask, isLoading };
};
