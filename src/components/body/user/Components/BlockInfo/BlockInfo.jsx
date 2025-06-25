import {Skeleton, Text} from "@gravity-ui/uikit";
import classes from "./BlockInfo.module.css";
import React from "react";

export default function BlockInfo({ content,loaded, title }) {
    return (
        <div className={classes.block}>
            <div className={classes.title}>
                <Text variant="subheader-3">{title}</Text>
            </div>
            {loaded ? (
                    <div className={classes.content}>
                        {content}
                    </div>
            ) : (
                <Skeleton className={classes.skeleton}/>
            )}
        </div>
    );
}