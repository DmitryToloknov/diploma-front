import React, {useEffect, useState} from 'react';
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import classes from './News.module.css';
import {NEWS_UPDATE} from "../../../utils/Roles.js";
import {useNavigate} from "react-router-dom";
import {NEWS, NEWS_CREATE, SERVER_URL} from "../../../utils/constant.js";
import CustomAlert from "../../blocks/alert/info/CustomAlert.jsx";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import {DefaultButton} from "../../blocks/button/Button.jsx";
import {Button, Checkbox, Icon, Text, UserLabel} from "@gravity-ui/uikit";
import {formatDate} from "../../../utils/DataFormat.jsx";
import {MarkdownPreview} from "../../blocks/markdownPreview/MarkdownPreview.jsx";
import {changeTitle} from "../../../utils/Title.jsx";
import {Plus} from "@gravity-ui/icons";

export default function News() {
    changeTitle("Новости")
    const navigate = useNavigate();
    const { accessToken, checkRoles, isWasRefreshed } = useAuth();
    const { alertData, showAlert, closeAlert } = useCustomAlert();
    const [showHidden, setShowHidden] = useState(false);
    const [totalPage, setTotalPage] = useState(null);
    const [page, setPage] = useState(0);
    const [news, setNews] = useState([]);
    const perPage = 10;

    const findCount = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const response = await fetch(`${SERVER_URL}news/count`, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                setTotalPage(Math.ceil(data / perPage));
                findNews();
            } else if (response.status === 400) {
                const errors = await response.json();
                const firstError = Array.isArray(errors) ? errors[0] : "Неизвестная ошибка";
                showAlert("danger", "Ошибка", firstError);
            } else if (response.status === 401) {
                showAlert("danger", "Ошибка", "Ошибка авторизации!");
            }
        } catch (error) {
            showAlert("danger", "Ошибка", "Ошибка получения количества страниц!");
            throw error;
        }
    };

    const findNews = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const url = new URL(`${SERVER_URL}news`);
            url.searchParams.append('page', page);
            url.searchParams.append('perPage', perPage);

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                setNews((prevNews) => [...prevNews, ...data]); // Добавляем новые новости к существующим
            } else if (response.status === 400) {
                const errors = await response.json();
                const firstError = Array.isArray(errors) ? errors[0] : "Неизвестная ошибка";
                showAlert("danger", "Ошибка", firstError);
            } else if (response.status === 401) {
                showAlert("danger", "Ошибка", "Ошибка авторизации!");
            }
        } catch (error) {
            showAlert("danger", "Ошибка", "Ошибка получения новости!");
            throw error;
        }
    };

    const loadMoreNews = () => {
        console.log(page, totalPage);
        if (page < totalPage - 1) {
            setPage((page) => page + 1);
        }
    };
    const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
        if (isWasRefreshed && !hasRun) {
            setHasRun(true);
            findCount();
             // Устанавливаем флаг, чтобы не выполнять снова
        }
    }, [isWasRefreshed]);

    useEffect(() => {
        if(page !== 0) {
            findNews();
        }

    }, [page]);

    const createNews = async (href) => {
        try {
            const response = await fetch(SERVER_URL + "news", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                showAlert("warning", "Ошибка", "Ошибка при создании новости. Попробуйте снова или обратитесь к администратору - код ошибки #5002");
                return;
            }
            navigate(href + JSON.parse(await response.text()));
        } catch (error) {
            showAlert("warning", "Ошибка", "Попробуйте позже!");
        }
    };

    const roles = [NEWS_UPDATE];
    if (!news) {
        return  <CustomAlert {...alertData} onClose={closeAlert}/>
    }
    return (
        <div className={classes.news}>
            <CustomAlert {...alertData} onClose={closeAlert} />
            <div className={classes.newsHeader}>
                <div>
                    <Text variant="display-1">Новости</Text>
                </div>
                {checkRoles(roles) && (
                    <div className={classes.admin}>
                        <div className={classes.adminMenu}>
                            <div className={classes.checkbox}>
                                <Checkbox size="m" checked={showHidden}
                                          onChange={(event) => setShowHidden(event.target.checked)}>Показать скрытые</Checkbox>
                            </div>
                            <div className={classes.createNews}>
                                <Button onClick={() => createNews(NEWS_CREATE)} view="action" size={"m"} width={"max"}>
                                    <Icon data={Plus}/> Создать новость
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            <div className={classes.newsFeed}>
                {news && news.length > 0 ? (
                    news.filter(item => showHidden || item.status).map((item, index) => (
                        <div key={index} className={classes.newsElem}>
                            <div className={classes.autor}>
                                <UserLabel className={classes.user} type="person" size={"xs"}>{item.fullNameCreator}</UserLabel>
                            </div>

                            <div className={classes.name}onClick={() => {navigate(`${NEWS}/${item.id}`)}}>
                                {item.name}
                            </div>
                            <Text variant="caption-2">
                                Опубликовано: {item.datePublication ? formatDate(item.datePublication) : " не опубликована"}
                            </Text>
                            <hr className={classes.hr} />
                            <MarkdownPreview value={item.description || ''} />
                            <div className={classes.buttonReadNews}>
                                <DefaultButton
                                value={"Читать далее"}
                                size={"m"}
                                width={"auto"}
                                action={'outlined-info'}
                                onClick={() => {navigate(`${NEWS}/${item.id}`)}}
                            />
                            </div>
                        </div>
                    ))
                ) : null}
            </div>
            {page < totalPage - 1 ? (
                <div className={classes.findNews}>
                    <DefaultButton
                        value={"Посмотреть больше"}
                        size={"l"}
                        width={"auto"}
                        onClick={() => {loadMoreNews()}}
                        disabled={page < totalPage - 1}
                    />
                </div>
            ):null}

        </div>
    );
}
