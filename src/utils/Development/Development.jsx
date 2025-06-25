import {Text} from "@gravity-ui/uikit";
import classes from "./Development.module.css";
import React from "react";

export default function Development() {
    return (
        <div className={classes.develop}>
            <Text variant="subheader-2" color={"misc"}>В разработке</Text>
        </div>
    )
}