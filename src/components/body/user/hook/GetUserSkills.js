import {useCallback, useState} from "react";
import {getUserSkillsApi} from "../Api.js";

export const useGetUserSkills = () => {
    const [userSkills, setUserSkills] = useState({});
    const [loaded, setLoaded] = useState(false);

    const getUserSkills = useCallback(async (token, showAlert) => {
        const result = await getUserSkillsApi(token);
        if (result.success) {
            setUserSkills(result.data);
            setLoaded(true)
        } else {
            showAlert("danger", "Ошибка получения информации о навыках", result.error);
        }
    }, []);

    return { getUserSkills, userSkills: userSkills, userSkillsLoaded: loaded };
};
