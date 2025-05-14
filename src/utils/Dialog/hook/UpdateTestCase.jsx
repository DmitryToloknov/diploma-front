import {useCallback, useState} from "react";
import { updateTestCaseApi} from "../Api.jsx";

export const useUpdateTestCase = () => {
    const [isLoading, setLoading] = useState(false);

    const updateTestCase = useCallback(async (token, showAlert, testCase, setOpenDialog) => {
        try {
            setLoading(true);
            const result = await updateTestCaseApi(token, testCase);
            if (result.success) {
                showAlert("success", "Обновление кейса", "Кейс успешно обновлен");
                setOpenDialog(false);
                setLoading(false);
            } else {
                showAlert("danger", "Ошибка обновление кейса", result.error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateTestCase, isLoading };
};
