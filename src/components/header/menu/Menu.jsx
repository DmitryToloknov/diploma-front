import ElementMenu from "./ElementMenu.jsx";
import classes from './Menu.module.css'
import {BANK_TASKS, CLUSTER, COURSES, GROUPS_SETTING, NEWS, SCHEDULE, USERS_SETTING} from "../../../utils/constant.js";
import {COURSE_UPDATE, GROUP_UPDATE, USER_UPDATE} from "../../../utils/Roles.js";
import {useAuth} from "../../auth-context/AuthProvider.jsx";

export default function Menu() {
    const { checkRoles } = useAuth();
    return (
        <div className={classes.menu}>
            <ElementMenu href={NEWS}>Новости</ElementMenu>
            <ElementMenu href={COURSES}>Курсы</ElementMenu>
            {checkRoles([COURSE_UPDATE]) && (
                <ElementMenu href={BANK_TASKS}>Банк задач</ElementMenu>
            )}
            {checkRoles([USER_UPDATE]) && (
                    <ElementMenu href={USERS_SETTING}>Пользователи</ElementMenu>
                )}
            {checkRoles([GROUP_UPDATE]) && (
                <ElementMenu href={GROUPS_SETTING}>Группы</ElementMenu>
            )}
        </div>
    )
}