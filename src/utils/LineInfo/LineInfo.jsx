import classes from "./LineInfo.module.css";
import {Text} from "@gravity-ui/uikit";
import React from "react";

export default function LineInfo({header, content}) {
    return (
        <div className={classes.lineInfo}>
            <div className={classes.lineHeader}>
                <Text variant="subheader-1" color={"hint"}>{header}</Text>
            </div>
            <div className={classes.lineContent}>
                <Text variant="body-3">{content}</Text>
            </div>
        </div>
    );
}