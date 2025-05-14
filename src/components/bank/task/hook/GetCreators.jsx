import {useCallback, useState} from "react";
import {getCreatorsApi} from "../Api.js";

export const useGetCreators = () => {
    const [creators, setCreators] = useState([]);

    const getCreators = useCallback(async (token, showAlert) => {
        const result = await getCreatorsApi(token);
        if (result.success) {
            setCreators(result.data);
        } else {
            showAlert("danger", "Ошибка авторов задач", result.error);
        }

    }, []);

    return { getCreators, creators };
};
