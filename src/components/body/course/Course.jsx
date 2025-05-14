import classes from './Course.module.css'
import React, {useEffect, useRef, useState} from "react";
import {COURSE_UPDATE} from "../../../utils/Roles.js";
import {changeTitle} from "../../../utils/Title.jsx";
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import {Button, Icon, Loader, Pagination, Text, TextInput, UserLabel} from "@gravity-ui/uikit";
import CustomAlert from "../../blocks/alert/info/CustomAlert.jsx";
import {ArrowsRotateLeft, Plus} from "@gravity-ui/icons";
import {useCreateCourse} from "./hook/createCourse.jsx";
import NeedAuth from "../../../utils/Auth/NeedAuth.jsx";
import {useGetTotalNumber} from "./hook/GetTotalNumber.jsx";
import {useGetCourses} from "./hook/GetCourses.jsx";
import {useNavigate} from "react-router-dom";
import {COURSE} from "../../../utils/constant.js";

export default function Course() {
    changeTitle("Курсы")
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const navigate = useNavigate();

    const {createCourse, isLoading} = useCreateCourse();
    const {getCourses, courses} = useGetCourses();
    const pageSize = 21;
    const [page, setPage] = useState(1);
    const {getTotalNumber, totalNumber} = useGetTotalNumber();
    const [name, setName] = useState("");
    const [filter, setFilter] = useState({name: ''});

    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            console.log(accessTokenRef.current)
            if (!isLoaded) {
                getCourses(accessTokenRef.current, showAlert, filter, page, pageSize)
                getTotalNumber(accessTokenRef.current, showAlert, filter)
                setIsLoaded(true);
            }
        }
    }, [accessToken]);

    useEffect(() => {
        if (isLoaded) {
            getCourses(accessTokenRef.current, showAlert, filter, page, pageSize);
        }
    }, [page, filter]);

    useEffect(() => {
        if (isLoaded) {
            getTotalNumber(accessTokenRef.current, showAlert, filter)
        }
    }, [filter]);

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
            <div>
                <Text variant="display-1">Курсы</Text>
            </div>
            <div className={classes.settings}>
                <div className={classes.filters}>
                    <TextInput label={"Название:"}
                               className={classes.filter_input}
                               size={"m"}
                               hasClear={true}
                               onUpdate={(s) => setName(s)}
                    />
                    <Button view="action" size="m"
                            onClick={() => {
                                setFilter({name: name});
                                setPage(1)
                            }}
                    > Найти <Icon data={ArrowsRotateLeft}/></Button>
                </div>
                {checkRoles(roles) && (
                    <div className={classes.buttonForAdmin}>
                        <Button
                            view="action"
                            size="m"
                            onClick={() => createCourse(accessTokenRef.current, showAlert)}
                            loading={isLoading}
                        >Создать курс <Icon data={Plus}/></Button>
                    </div>
                )}
            </div>
            <div className={classes.courses}>
                {courses.length > 0 ? (courses?.map(course => (
                    <div className={classes.course} onClick={() => navigate(COURSE + "/" + course.id)}>
                        <div className={classes.name}>
                            <Text variant="header-1">
                                {course.name}
                            </Text>
                        </div>
                        <div className={classes.creator}>
                            <UserLabel type="person" size={"xs"}>{course.creatorName}</UserLabel>
                        </div>
                    </div>
                ))) : (
                    <div></div>
                )}
            </div>
            <Pagination className={classes.pagination} page={page} pageSize={pageSize} total={totalNumber}
                        onUpdate={(page) => setPage(page)}/>
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    )
}