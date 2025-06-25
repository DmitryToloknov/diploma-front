import {useCallback, useState} from "react";
import {getCoursesProgressApi} from "../Api.js";

export const useGetCoursesProgress = () => {
    const [coursesProgress, setCoursesProgress] = useState({});
    const [loaded, setLoaded] = useState(false);

    const getCoursesProgress = useCallback(async (token, showAlert) => {
        const result = await getCoursesProgressApi(token);
        if (result.success) {
            setCoursesProgress(result.data);
            setLoaded(true)
        } else {
            showAlert("danger", "Ошибка получения прогресса по курсам", result.error);
        }
    }, []);

    return { getCoursesProgress, coursesProgress: coursesProgress, coursesProgressLoaded: loaded };
};
