import {useCallback, useState} from "react";
import {ReasonApproveApi, RejectAttemptApi, updateCourseApi} from "../Api.jsx";

export const useApproveAttempt = () => {
    const [isLoadingApproveAttempt, setLoadingApproveAttempt] = useState(false);

    const approveAttempt = useCallback(async (token, showAlert, id, reasonApprove, setOpen, update) => {
        try {
            setLoadingApproveAttempt(true);
            const result = await ReasonApproveApi(token, id, reasonApprove);
            if (result.success) {
                showAlert("success", "Принятие решения", "Решение успешно принято");
                setOpen(false);
                update();
            } else {
                showAlert("danger", "Принятие решения", result.error);
            }
        } finally {
            setLoadingApproveAttempt(false);
        }
    }, []);

    return { approveAttempt, isLoadingApproveAttempt };
};
