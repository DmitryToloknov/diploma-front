import {TextInput} from "@gravity-ui/uikit";
import React from "react";
import classes from "./TextInputBig.module.css";

export function TextInputBig({ placeholder, value, onUpdate }) {
    return <TextInput placeholder={placeholder} value={value}
                      onUpdate={onUpdate}
                      size={"l"}
                      className={classes.textInput}
                      controlProps={{
                          style: {fontSize: "24px", fontWeight: "bolder",
                              paddingLeft: "0"},
                      }}
    />
}