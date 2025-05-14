import {useCallback, useState} from "react";
import {getTestCaseApi} from "../Api.js";

export const useGetTestCases = () => {
    const [testCases, setTestCases] = useState([]);

    const getTestCase = useCallback(async (token, showAlert, taskId) => {
        const result = await getTestCaseApi(token, taskId);
        if (result.success) {
            setTestCases(result.data);
        } else {
            showAlert("danger", "Ошибка получения тестовых кейсов", result.error);
        }

    }, []);

    return {getTestCases: getTestCase, testCases};
};
