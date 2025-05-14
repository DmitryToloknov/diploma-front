import {useCallback, useState} from "react";
import {getSkillsApi} from "../Api.js";

export const useGetSkills = () => {
    const [skills, setSkills] = useState([]);

    const getSkills = useCallback(async (token, showAlert) => {
            const result = await getSkillsApi(token);
            if (result.success) {
                setSkills(result.data);
            } else {
                showAlert("danger", "Ошибка получения скилов", result.error);
            }

    }, []);

    return { getSkills, skills };
};
