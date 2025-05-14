import {useCallback, useState} from "react";
import {getHistoryForStatisticsApi} from "../Api.jsx";

export const useGetHistoryForStatistic = () => {
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const getHistoryForStatistic = useCallback(async (token, showAlert, taskId, courseId, userId ) => {
        setLoadingHistory(true);
        const result = await getHistoryForStatisticsApi(token,  taskId, courseId, userId);
        if (result.success) {
            setHistory(result.data);
        } else {
            showAlert("danger", "Ошибка получения истории", result.error);
        }
        setLoadingHistory(false);
    }, []);

    return {getHistoryForStatistic, history, setHistory, loadingHistory};
};
