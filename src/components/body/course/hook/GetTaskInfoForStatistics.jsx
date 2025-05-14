import {useCallback, useState} from "react";
import {getTaskInfoForStatisticsApi} from "../Api.jsx";

export const useGetTaskInfoForStatistics = () => {
    const [taskInfo, setTaskInfo] = useState({});

    const getTaskInfoForStatistics= useCallback(async (token, showAlert, courseId, userId) => {
        const result = await getTaskInfoForStatisticsApi(token, courseId, userId);
        if (result.success) {
            setTaskInfo(result.data);
        } else {
            showAlert("danger", "Ошибка получения информации о задачах", result.error);
        }

    }, []);

    return { getTaskInfoForStatistics, taskInfo, setTaskInfo };
};
