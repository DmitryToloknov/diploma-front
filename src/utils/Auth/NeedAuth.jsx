import classes from './NeedAuth.module.css'
import {Button, Icon, Text} from "@gravity-ui/uikit";
import {TriangleExclamationFill, XmarkShape} from "@gravity-ui/icons";
import {useAuth} from "../../components/auth-context/AuthProvider.jsx";

export default function NeedAuth() {
    const {openModal} = useAuth();
    return(
        <div className={classes.body}>

            <div><Icon size={100} data={TriangleExclamationFill}/></div>
            <Text variant="display-1">Для доступа к этой странице необходима авторизация!</Text><br/>
            <Button className={classes.login} onClick={openModal} view="action" size="l">Войти</Button>
        </div>
    )
}