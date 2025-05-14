import {useCallback, useState} from "react";
import {getTestCaseApi} from "../Api.jsx";

export const useGetTestCase = () => {
    const [testCase, setTestCase] = useState({});

    const getTestCase = useCallback(async (token, showAlert, id) => {
            const result = await getTestCaseApi(token, id);
            if (result.success) {
                setTestCase(result.data);
            } else {
                showAlert("danger", "Ошибка получения кейса", result.error);
            }
    }, []);

    return { getTestCase, testCase, setTestCase };
};
