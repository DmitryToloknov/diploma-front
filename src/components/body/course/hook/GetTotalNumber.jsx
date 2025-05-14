import {useCallback, useState} from "react";
import {getTotalNumberApi} from "../Api.jsx";

export const useGetTotalNumber = () => {
    const [totalNumber, setTotalNumber] = useState(0);

    const getTotalNumber = useCallback(async (token, showAlert, filter) => {
        const result = await getTotalNumberApi(token, filter);
        if (result.success) {
            setTotalNumber(result.data);
        } else {
            showAlert("danger", "Ошибка получения количества курсов", result.error);
        }

    }, []);

    return { getTotalNumber, totalNumber };
};
