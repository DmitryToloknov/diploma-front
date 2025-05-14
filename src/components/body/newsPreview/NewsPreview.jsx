import classes from "./NewsPreview.module.css";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {NEWS_CREATE, SERVER_URL} from "../../../utils/constant.js";
import CustomAlert from "../../blocks/alert/info/CustomAlert.jsx";
import {NEWS_UPDATE} from "../../../utils/Roles.js";
import {DropdownMenu, Text, UserLabel} from "@gravity-ui/uikit";
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import {formatDate} from "../../../utils/DataFormat.jsx";
import {MarkdownPreview} from "../../blocks/markdownPreview/MarkdownPreview.jsx";
import {changeTitle} from "../../../utils/Title.jsx";

export default function NewsPreview() {
    changeTitle("Новость")
    const {id} = useParams();
    const {accessToken, checkRoles, isWasRefreshed} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [news, setNews] = useState({ name: ''});
    const navigate = useNavigate({});
    const accessTokenRef = useRef(accessToken);


    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    function clickHandler(href) {
        navigate(href);
    }

    const findNews = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            // Если токен существует, добавляем его в заголовки
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            const response = await fetch(`${SERVER_URL}news/${id}`, {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const data = await response.json();
                setNews(data);
            } else if (response.status === 400) {
                const errors = await response.json();
                showAlert("danger", "Ошибка", errors);
            } else if (response.status === 403) {
                showAlert("danger", "Ошибка", "Недостаточно прав!");
            } else if (response.status === 401) {
                showAlert("danger", "Ошибка", "Ошибка авторизации!");
            }
        } catch (error) {
            showAlert("danger", "Ошибка", "Ошибка получения новости!");
            throw error;
        }
    }
    useEffect(() => {
        if (isWasRefreshed) {
            findNews()
        }
    }, [isWasRefreshed]);
    if (!news) {
        return <CustomAlert {...alertData} onClose={closeAlert}/>
    }
    const roles = [NEWS_UPDATE];
    return (
        <div className={classes.body}>
            <div className={classes.autor}>
                <UserLabel className={classes.user} type="person" size={"xs"}>{news.fullNameCreator}</UserLabel>
                {checkRoles(roles) && (
                    <DropdownMenu size={"l"}
                                  items={[
                                      {
                                          action: () => clickHandler(`${NEWS_CREATE}${id}`),
                                          text: 'Редактировать',
                                      },
                                  ]}
                    />
                )}
            </div>

            <div className={classes.name}>
                {news.name}
            </div>
            <Text variant="caption-2">
                Опубликовано: {news.datePublication ? formatDate(news.datePublication) : " не опубликована"}
            </Text>
            <hr className={classes.hr}/>
            <MarkdownPreview value={news.description ?? ''}/>
        </div>
    )
}