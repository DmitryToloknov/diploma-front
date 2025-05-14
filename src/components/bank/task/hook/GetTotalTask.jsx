import {useCallback, useState} from "react";
import {getTotalTaskApi} from "../Api.js";

export const useTotalTask = () => {
    const [totalNumber, setTotalNumber] = useState([]);

    const getTotalTask = useCallback(async (token, showAlert, filters) => {
        const result = await getTotalTaskApi(token, filters);
        if (result.success) {
            setTotalNumber(result.data);
        } else {
            showAlert("danger", "Ошибка получения количества задач", result.error);
        }

    }, []);

    return { getTotalTask, totalNumber };
};
