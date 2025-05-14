import {useCallback, useState} from "react";
import {getUsersByGroupIdApi} from "../Api.jsx";

export const useGetUsersByGroup = () => {
    const [users, setUsers] = useState([]);

    const getUsersByGroupId = useCallback(async (token, showAlert, groupId) => {
        const result = await getUsersByGroupIdApi(token, groupId);
        if (result.success) {
            setUsers(result.data);
        } else {
            showAlert("danger", "Ошибка получения задач", result.error);
        }

    }, []);

    return { getUsersByGroupId, users };
};
