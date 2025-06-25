import {Route, Routes} from "react-router-dom";
import News from "./news/News.jsx";
import NewsCreate from "./news-create/NewsCreate.jsx";
import classes from './Body.module.css'
import NewsPreview from "./newsPreview/NewsPreview.jsx";
import GroupsSetting from "./group/GroupsSetting.jsx";
import UsersSettings from "./users/UsersSettings.jsx";
import Course from "./course/Course.jsx";
import CourseSettings from "./course/settings/CourseSettings.jsx";
import BankTasks from "../bank/task/BankTasks.jsx";
import Task from "../bank/task/setting/Task.jsx";
import CourseTask from "./course/task/CourseTask.jsx";
import CourseMenu from "./course/menu/CourseMenu.jsx";
import CourseStatistics from "./course/statistics/CourseStatistics.jsx";
import User from "./user/User.jsx";

export default function Body({}) {

    return (
        <div className={classes.body}>
            <Routes>
                <Route path="/news" element=<News/> />
                <Route path="" element=<News/> />
                <Route path="/news/create/:id" element=<NewsCreate/> />
                <Route path="/news/:id" element=<NewsPreview/> />
                <Route path="/groups/setting" element=<GroupsSetting/> />
                <Route path="/cluster" element={"Кластер"}/>
                <Route path="/courses" element=<Course/> />
                <Route path="/course/settings/:id" element=<CourseSettings/> />
                <Route path="/course/:id/statistics" element=<CourseStatistics/> />
                <Route path="/course/:id/:taskId" element=<CourseTask/> />
                <Route path="/course/:id" element=<CourseMenu/> />
                <Route path="/task/:id" element=<Task/> />
                <Route path="/bank-tasks" element=<BankTasks/> />
                <Route path="/my" element=<User/>/>
                <Route path="/users/setting" element=<UsersSettings />/>
            </Routes>
        </div>
    )
}