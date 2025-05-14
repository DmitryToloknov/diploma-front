import Menu from "./menu/Menu.jsx";
import classes from './Header.module.css'
import UserPanel from "./user-panel/UserPanel.jsx";
import Logo from "./logo/Logo.jsx";

export default function Header() {
    return (
        <div className={classes.header}>
            <div className={classes.body}>
                <Logo />
                <Menu />
                <UserPanel />
            </div>
        </div>
    )
}