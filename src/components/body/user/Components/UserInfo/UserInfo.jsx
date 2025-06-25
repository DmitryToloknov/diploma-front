import classes from "./UserInfo.module.css";
import LineInfo from "../../../../../utils/LineInfo/LineInfo.jsx";

export default function UserInfo({data}) {
    return (
        <div className={classes.userInfo}>
            <LineInfo header={"Имя:"} content={data.name} />
            <LineInfo header={"Фамилия:"} content={data.surname} />
            <LineInfo header={"Группа:"} content={data.groupName} />
            <LineInfo header={"Телефон:"} content={data.phone} />
            <LineInfo header={"Логин:"} content={data.login} />
        </div>
    );
}