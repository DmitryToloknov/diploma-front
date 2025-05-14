import {useCallback, useState} from "react";
import {RejectAttemptApi, updateCourseApi} from "../Api.jsx";

export const useRejectAttempt = () => {
    const [isLoadingRejectAttempt, setLoadingRejectAttempt] = useState(false);

    const rejectAttempt = useCallback(async (token, showAlert, id, reasonAttempt, setOpen, update) => {
        try {
            setLoadingRejectAttempt(true);
            const result = await RejectAttemptApi(token, id, reasonAttempt);
            if (result.success) {
                showAlert("success", "Отклонение решения", "Решение успешно отклонено");
                setOpen(false);
                update();
            } else {
                showAlert("danger", "Отклонение решения", result.error);
            }
        } finally {
            setLoadingRejectAttempt(false);
        }
    }, []);

    return { rejectAttempt, isLoadingRejectAttempt };
};
