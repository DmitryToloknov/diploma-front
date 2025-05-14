import {useCallback, useState} from "react";
import {getLanguagesApi} from "../Api.js";

export const useGetLanguages = () => {
    const [languages, setLanguages] = useState([]);

    const getLanguages = useCallback(async (token, showAlert) => {
        const result = await getLanguagesApi(token);
        if (result.success) {
            setLanguages(result.data);
        } else {
            showAlert("danger", "Ошибка получения языков программирования.", result.error);
        }

    }, []);

    return { getLanguages, languages };
};
