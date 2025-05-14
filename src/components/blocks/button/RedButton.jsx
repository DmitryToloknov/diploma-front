import classes from "./Button.module.css";
import {Button} from "@gravity-ui/uikit";
import React from "react";


export function RedButton({ width, size, value, onClick, loading }) {
    return <Button  width={width} view="action" size={size} loading={loading} className={classes.buttonDelete} onClick={onClick}>{value}</Button>
}