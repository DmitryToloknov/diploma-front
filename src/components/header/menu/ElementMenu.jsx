import {useNavigate} from "react-router-dom";
import classes from './Menu.module.css'

export default function ({children, href}) {
    const navigate = useNavigate();

    function clickHandler(href) {
        navigate(href);
    }
    return (
        <a onClick={() => clickHandler(href)}>
            <div className={classes.elementMenu}>
                {children}
            </div>
        </a>
    )
}