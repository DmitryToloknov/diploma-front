import classes from "./CoursesProgress.module.css";
import {Progress, Text} from "@gravity-ui/uikit";
import React from "react";
import {COURSE} from "../../../../../utils/constant.js";
import {useNavigate} from "react-router-dom";

function getProgressColor(percent) {
    if (percent < 56) {
        return 'danger';      // Красный
    } else if (percent >= 56 && percent <= 70) {
        return 'warning';     // Оранжевый
    } else if (percent >= 71 && percent <= 85) {
        return 'info';     // синий
    } else {
        return 'success';      // зеленый
    }
}
export default function CourseProgress({name, id, estimation, estimationActual}) {
    const navigate = useNavigate();
    const percent = estimation && estimation !== 0
        ? Math.round((estimationActual / estimation) * 100)
        : 0;

    return (
        <div className={classes.courseProgress} onClick={ () => navigate(COURSE + "/" + id)}>
            <div className={classes.courseName}>
                <Text variant="body-1">{name}</Text>
            </div>
            <div className={classes.progress}>
                <Progress theme={getProgressColor(percent)} text={percent + "%"} value={percent} size={"m"} />
            </div>
        </div>
    )
}