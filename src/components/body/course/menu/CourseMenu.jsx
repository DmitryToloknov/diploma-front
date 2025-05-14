import classes from './CourseMenu.module.css'
import React, {useEffect, useRef, useState} from "react";
import {COURSE_UPDATE} from "../../../../utils/Roles.js";
import {changeTitle} from "../../../../utils/Title.jsx";
import {useAuth} from "../../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../../blocks/alert/info/useCustomAlert.js";
import {Button, Icon, Label, Loader, Text} from "@gravity-ui/uikit";
import CustomAlert from "../../../blocks/alert/info/CustomAlert.jsx";
import NeedAuth from "../../../../utils/Auth/NeedAuth.jsx";
import {MarkdownPreview} from "../../../blocks/markdownPreview/MarkdownPreview.jsx";
import {ChartColumn, Gear, Play} from "@gravity-ui/icons";
import {useNavigate, useParams} from "react-router-dom";
import {COURSE, COURSE_SETTINGS} from "../../../../utils/constant.js";
import {useGetInfoCourse} from "../hook/GetInfoCourse.jsx";
import {useGetTaskInfoForCourse} from "../hook/GetTaskInfoForCourse.jsx";
import {formatDate} from "../../../../utils/DataFormat.jsx";

export default function CourseMenu() {
    changeTitle("Курсы");
    const {id} = useParams();
    const navigate = useNavigate();
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const {getInfoCourse, course} = useGetInfoCourse();
    const {getTaskInfoForCourse, taskInfo} = useGetTaskInfoForCourse();


    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            console.log(accessTokenRef.current)
            if (!isLoaded) {
                getInfoCourse(accessTokenRef.current, showAlert, id);
                getTaskInfoForCourse(accessTokenRef.current, showAlert, id);
                setIsLoaded(true);
            }
        }
    }, [accessToken]);


    if (isWasRefreshed && !isAuth) {
        return (<NeedAuth/>)
    }

    if (!isLoaded) {
        return <div className={classes.loader}>
            <Loader/>
        </div>
    }

    const roles = [COURSE_UPDATE];
    return (
        <div>
            <div className={classes.header}>
                <div className={classes.name}>
                    {course.name}
                </div>
                {checkRoles(roles) && (
                    <div className={classes.button}>
                        <Button className={classes.button} view={"action"} size={"m"}
                                onClick={() => navigate(COURSE + "/" + id + "/statistics")}
                        >Статистика <Icon
                            data={ChartColumn}/></Button>
                        <Button view={"action"} size={"m"}
                                onClick={() => navigate(COURSE_SETTINGS + "/" + id)}
                        ><Icon data={Gear}/></Button>
                    </div>
                )}
            </div>
            <div className={classes.body}>
                <div className={classes.center}>
                    <div className={classes.description}>
                        <MarkdownPreview value={course.description || ""}/>
                    </div>

                    <div className={classes.tasks}>
                        <Text variant="header-1">
                            Задачи
                        </Text>
                        {taskInfo?.tasks?.length > 0 ? (taskInfo?.tasks?.map(task => (
                            <div className={classes.task} onClick={() => navigate(COURSE + "/" + id + "/" + task.id)}>
                                <div className={classes.leftInfo}>
                                    <div className={classes.id}>
                                        <Text variant="body-2"
                                              color={
                                                  task.review
                                                      ? "warning"
                                                      : task.done
                                                          ? "positive"
                                                          : "primary"
                                              }>
                                            #{task.id}
                                        </Text>
                                    </div>
                                    <div className={classes.taskName}>
                                        <Text variant="body-2"
                                              color={
                                                  task.review
                                                      ? "warning"
                                                      : task.done
                                                          ? "positive"
                                                          : "primary"
                                              }>
                                            {task.name}
                                        </Text>
                                    </div>
                                </div>

                                <div className={classes.estimation}>
                                    <Text variant="body-2"
                                          color={
                                              task.review
                                                  ? "warning"
                                                  : task.done
                                                      ? "positive"
                                                      : "primary"
                                          }
                                          whiteSpace={"nowrap"}>
                                        {task.estimationActual} / {task.estimation}
                                    </Text>
                                </div>
                            </div>
                        ))) : (
                            <div className={classes.notTask}>
                                <Text variant="subheader-1">
                                    Нет задач
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
                <div className={classes.right}>
                    <Text variant="header-1">
                        Информация о курсе
                    </Text>
                    <div className={classes.estimationInfo}>
                        <Text variant="body-1">
                            Баллов: {taskInfo.actualEstimation} / {taskInfo.totalEstimation}
                        </Text>
                    </div>
                </div>
            </div>
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    )
}