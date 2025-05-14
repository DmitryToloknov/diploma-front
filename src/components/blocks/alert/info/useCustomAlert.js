import { useState } from "react";

export function useCustomAlert() {
    const [alertData, setAlertData] = useState({ theme: "", type: "", message: "" });

    const showAlert = (theme, type, message) => {
        setAlertData({ theme, type, message });
    };

    const closeAlert = () => {
        setAlertData({ theme: "", type: "", message: "" });
    };

    return { alertData, showAlert, closeAlert };
}
