import {Select} from "@gravity-ui/uikit";
import classes from "../../bank/task/setting/Task.module.css";
import React from "react";

export default function LanguageSelector({languages, task, onChangeValue, onChangeKey}) {
    return (
        <Select
            className={classes.languageSelector}
            width={'auto'}
            label={"язык:"}
            size={"m"}
            hasClear={true}
            filterable={true}
            defaultValue={[task.taskLanguage]}
            onUpdate={(selectedKeys) => {
                const selected = languages.find(lang => lang.key === selectedKeys[0]);
                if (selected) {
                    onChangeValue(selected.value);
                    onChangeKey((task) => ({...task, taskLanguage:selected.key}));
                }
            }}
        >
            {languages?.map(group => (
                <Select.Option key={group.key} value={group.key}>
                    {group.value}
                </Select.Option>
            ))}
        </Select>
    )
}