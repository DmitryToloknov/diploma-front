import {useCallback, useState} from "react";
import {deleteTestCaseApi} from "../Api.js";

export const useDeleteTestCase = () => {
    const [isLoading, setLoading] = useState(false);

    const deleteTestCase = useCallback(async (token, showAlert, id, taskId, getTestCase) => {
            setLoading(true);
            const result = await deleteTestCaseApi(token, id);
            if (result.success) {
                showAlert("success", "Удаление кейса", "Кейс удален успешно");
                getTestCase(token, showAlert, taskId);
            } else {
                showAlert("danger", "Ошибка удаления кейса", result.error);
            }
    }, []);

    return { deleteTestCase, isLoading };
};
