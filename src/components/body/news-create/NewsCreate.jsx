import React, {useEffect, useRef, useState} from "react";
import classes from "./NewsCreate.module.css";
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import {MarkdownEditorView, useMarkdownEditor} from "@gravity-ui/markdown-editor";
import {toaster} from "@gravity-ui/uikit/toaster-singleton-react-18";
import {NEWS, SERVER_URL} from "../../../utils/constant.js";
import {useNavigate, useParams} from "react-router-dom";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import CustomAlert from "../../blocks/alert/info/CustomAlert.jsx";
import {Dialog, Switch, Text, UserLabel} from "@gravity-ui/uikit";
import {formatDate} from "../../../utils/DataFormat.jsx";
import {RedButton} from "../../blocks/button/RedButton.jsx";
import {DefaultButton} from "../../blocks/button/Button.jsx";
import {TextInputBig} from "../../blocks/Input/TextInputBig.jsx";
import {changeTitle} from "../../../utils/Title.jsx";

export default function NewsCreate() {
    changeTitle("Редактор новостей")
    const {id} = useParams();
    const {accessToken, checkRoles, isWasRefreshed} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [news, setNews] = useState(null);
    const navigate = useNavigate();
    const accessTokenRef = useRef(accessToken);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [loadingDialogDelete, setLoadingDialogDelete] = useState(false);
    const [loadingButtonSave, setLoadingButtonSave] = useState(false);

    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    function clickHandler(href) {
        navigate(href);
    }

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(SERVER_URL + "file/img/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessTokenRef.current}`, // Берём актуальный токен
                },
                body: formData,
            });

            if (!response.ok) {
                showAlert("danger", "Ошибка", "Не удалось загрузить файл.");
            }

            const data = await response.json();
            return {url: data.fileUrl};
        } catch (error) {
            showAlert("danger", "Ошибка", "Не удалось загрузить файл.");
        }
    };

    const deleteNews = async () => {
        try {
            const response = await fetch(`${SERVER_URL}news/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessTokenRef.current}`,
                },
            });

            if (response.ok) {
                clickHandler(NEWS)
            } else if (response.status === 400) {
                const errors = await response.json();
                const firstError = Array.isArray(errors) ? errors[0] : "Неизвестная ошибка";
                showAlert("danger", "Удаление новости", firstError);
            } else if (response.status === 403) {
                showAlert("danger", "Удаление новости", "Недостаточно прав");
            } else if (response.status === 401) {
                showAlert("danger", "Удаление новости", "Ошибка авторизации");
            }
        } catch (error) {
            showAlert("danger", "Удаление новости", "Не удалось выполнить удаление.");
        } finally {
            setLoadingDialogDelete(false);
            setOpenDialogDelete(false);
        }
    };

    const updateNews = async () => {
        try {
            setLoadingButtonSave(true);

            const updatedNews = {...news, description: editor.getValue()};
            const response = await fetch(`${SERVER_URL}news/${id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessTokenRef.current}`,
                },
                body: JSON.stringify(updatedNews),
            });
            console.log(updatedNews)
            if (response.ok) {
                clickHandler(`${NEWS}/${id}`)
            } else if (response.status === 400) {
                const errors = await response.json();
                showAlert("danger", "Обновление новости", errors);
            } else if (response.status === 403) {
                showAlert("danger", "Обновление новости", "Недостаточно прав");
            } else if (response.status === 401) {
                showAlert("danger", "Обновление новости", "Ошибка авторизации");
            }
        } catch (error) {
            showAlert("danger", "Обновление новости", "Не удалось выполнить обновление.");
        } finally {
            setLoadingButtonSave(false);
        }
    };

    const editor = useMarkdownEditor({
        allowHTML: true,
        fileUploadHandler: uploadImage,
    });


    const findNews = async () => {
        try {
            const response = await fetch(`${SERVER_URL}news/${id}/edit`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                setNews(data);
                if (data.description !== null) {
                    editor.append(data.description);
                }
            } else if (response.status === 400) {
                const errors = await response.json();
                showAlert("danger", "Получение новости", errors);
            } else if (response.status === 403) {
                showAlert("danger", "Получение новости", "Недостаточно прав");
            } else if (response.status === 401) {
                showAlert("danger", "Получение новости", "Эту страницу могут увидеть авторизованные пользователи");
            }
        } catch (error) {
            showAlert("danger", "Получение новости", "Ошибка получения новости!");
            throw error;
        }
    }

    useEffect(() => {
        if (isWasRefreshed) {
            findNews();
        }
    }, [isWasRefreshed]);
    if (!news) {
        return <CustomAlert {...alertData} onClose={closeAlert}/>
    }


    const dialogTitleId = 'app-confirmation-dialog-title';

    return (

        <div className={classes.body}>
            <Dialog
                onClose={() => setOpenDialogDelete(false)}
                open={openDialogDelete}
                onEnterKeyDown={() => {
                    alert('onEnterKeyDown');
                }}
                aria-labelledby={dialogTitleId}
            >
                <Dialog.Header caption="Подтверждение"/>
                <Dialog.Body>Вы действительно хотите удалить новость?</Dialog.Body>
                <Dialog.Footer
                    loading={loadingDialogDelete}
                    onClickButtonCancel={() => setOpenDialogDelete(false)}
                    onClickButtonApply={() => {
                        setLoadingDialogDelete(true);
                        deleteNews();
                    }}
                    textButtonApply="Да"
                    textButtonCancel="Отмена"
                />
            </Dialog>
            <div className={classes.editorNews}>
                <div className={classes.newName}>
                    <div className={classes.autor}>
                        <UserLabel type="person" size={"xs"}>{news.fullNameCreator}</UserLabel>
                    </div>
                    <TextInputBig placeholder={"Название новости"} value={news.name}
                                  onUpdate={(e) => setNews({...news, name: e})}/>
                </div>
                <Text variant="caption-1">
                    Создано: {formatDate(news.createdDateTime)} | обновлено: {formatDate(news.updatedDateTime)} |
                    Опубликовано: {news.datePublication ? formatDate(news.datePublication) : " не опубликована"}
                </Text>
                <MarkdownEditorView stickyToolbar autofocus toaster={toaster} editor={editor}/>
            </div>
            <div className={classes.settingsNews}>
                <div className={classes.buttonsSettings}>
                        <RedButton size={"m"} width={"max"} value={"Удалить"}
                                   onClick={() => setOpenDialogDelete(true)}/>
                    <DefaultButton loading={loadingButtonSave} size={"m"} width={"max"} value={"Сохранить"}
                                   onClick={() => updateNews()}/>
                </div>

                <div className={classes.infoNews}>
                    <Switch size="m" checked={news.status}
                            onChange={(e) => setNews({...news, status: e.target.checked})}>Опубликовать</Switch>
                </div>
            </div>
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    );
}
// datePublication