import React, { useEffect, useRef } from "react";
import { Alert } from "@gravity-ui/uikit";
import classes from "./CustomAlert.module.css";

function CustomAlert({ theme, type, message, onClose }) {
    const alertRef = useRef(null);
    const alertKeyRef = useRef(Date.now()); // useRef вместо useState

    useEffect(() => {
        if (message) {
            // Обновляем только если сообщение пришло, но не перерисовываем компонент
            alertKeyRef.current = Date.now();

            const timer = setTimeout(() => {
                onClose(); // Закрываем алерт через 1.5 секунды
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className={classes.overlay}>
            <div
                key={alertKeyRef.current} // Используем реф вместо состояния
                ref={alertRef}
                className={classes.slideIn}
            >
                <Alert theme={theme} title={type} message={message} />
            </div>
        </div>
    );
}

export default React.memo(CustomAlert, (prevProps, nextProps) => {
    // Сравниваем только необходимые props
    return (
        prevProps.message === nextProps.message &&
        prevProps.theme === nextProps.theme &&
        prevProps.type === nextProps.type
    );
});
