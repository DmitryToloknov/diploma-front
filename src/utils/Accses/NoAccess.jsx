import classes from './NoAccess.module.css'
import {Icon, Text} from "@gravity-ui/uikit";
import {TriangleExclamationFill, XmarkShape} from "@gravity-ui/icons";

export default function NoAccess () {
    return (
        <div className={classes.body}>
            <div><Icon size={100} data={TriangleExclamationFill}/></div>
            <Text variant="display-1">Недостаточно прав</Text><br/>
        </div>
    )
}