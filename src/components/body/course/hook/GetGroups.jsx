import {useCallback, useState} from "react";
import {getGroupsApi} from "../Api.jsx";

export const useGetGroups = () => {
    const [groups, setGroups] = useState([]);

    const getGroups = useCallback(async (token, showAlert) => {
        const result = await getGroupsApi(token);
        if (result.success) {
            setGroups(result.data);
        } else {
            showAlert("danger", "Ошибка получения групп", result.error);
        }

    }, []);

    return { getGroups, groups };
};
