import {changeTitle} from "../../../utils/Title.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import React, {useEffect, useRef, useState} from "react";
import NeedAuth from "../../../utils/Auth/NeedAuth.jsx";
import classes from "./User.module.css";
import {Loader, Text} from "@gravity-ui/uikit";
import BlockInfo from "./Components/BlockInfo/BlockInfo.jsx";
import Development from "../../../utils/Development/Development.jsx";
import UserInfo from "./Components/UserInfo/UserInfo.jsx";
import {useGetUserInfo} from "./hook/GetUserInfo.js";
import {useGetCoursesProgress} from "./hook/GetCourseProgress.js";
import CoursesProgress from "./Components/CourseProgress/CoursesProgress.jsx";
import UserSkills from "./Components/Skills/UserSkills.jsx";
import {useGetUserSkills} from "./hook/GetUserSkills.js";

export default function User() {
    changeTitle("Личный кабинет")
    const navigate = useNavigate();
    const {accessToken, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);

    //user
    const {getUserInfo, userInfo, userLoaded} = useGetUserInfo();
    //courseProgress
    const {getCoursesProgress, coursesProgress, coursesProgressLoaded} = useGetCoursesProgress();
    //userSkills
    const {getUserSkills, userSkills, userSkillsLoaded} = useGetUserSkills();

    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            if (!isLoaded) {
                setIsLoaded(true);
                getUserInfo(accessTokenRef.current, showAlert)
                getCoursesProgress(accessTokenRef.current, showAlert)
                getUserSkills(accessTokenRef.current, showAlert)
            }
        }
    }, [accessToken]);
    console.log(coursesProgress)

    if (isWasRefreshed && !isAuth) {
        return (<NeedAuth/>)
    }

    if (!isLoaded) {
        return <div className={classes.loader}>
            <Loader/>
        </div>
    }
    return (
        <div>
            <div>
                <Text variant="display-1">Личный кабинет</Text>
            </div>
            <div className={classes.content_35_65}>
                <BlockInfo content={<UserInfo data={userInfo}/>} loaded={userLoaded} title="Информация о пользователе"/>
                <BlockInfo content={<CoursesProgress data={coursesProgress}/>} loaded={coursesProgressLoaded}
                           title="Информация о курсах"/>
            </div>
            <div className={classes.content_35_65}>
                <BlockInfo content={<Development/>} loaded={true} title="Уведомления"/>
                <BlockInfo content={<UserSkills data={userSkills}/>} loaded={userSkillsLoaded} title="Навыки"/>
            </div>
            <div className={classes.content_100}>
                <BlockInfo content={<Development/>} loaded={true} title="Расписание занятий"/>
            </div>

        </div>
    )

}