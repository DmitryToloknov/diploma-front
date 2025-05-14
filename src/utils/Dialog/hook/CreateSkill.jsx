import {useCallback, useState} from "react";
import {useNavigate} from "react-router-dom";
import {createSkillApi} from "../Api.jsx";

export const useCreateSkill = () => {
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const createSkill = useCallback(async (token, showAlert, name, setOpenDialog, setName) => {
        try {
            setLoading(true);
            const result = await createSkillApi(token, name);
            if (result.success) {
                showAlert("success", "Создание скила", "скил успешно создан");
                setName("")
                setOpenDialog(false);
                setLoading(false);
            } else {
                showAlert("danger", "Ошибка создания скила", result.error);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return { createSkill, isLoading };
};
