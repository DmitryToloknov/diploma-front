import React from 'react';
import classes from './Logo.module.css'
import logo from '../../../utils/img/img.png';
import {useNavigate} from "react-router-dom";
import {NEWS} from "../../../utils/constant.js";

export default function Logo() {
    const navigate = useNavigate();
    function clickHandler(href) {
        navigate(href);
    }

    return (
        <div className={classes.logo}>
            <img onClick={() => clickHandler(NEWS)} className={classes.img} src={logo}/>
        </div>);
}