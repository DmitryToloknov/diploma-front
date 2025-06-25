import React, {useMemo} from "react";
import {Table, withTableCopy} from "@gravity-ui/uikit";
import classes from "./UserSkills.module.css";

export default function UserSkills({data}) {
    const CustomTable = useMemo(() => React.memo(withTableCopy(Table)), []);
    const columns = useMemo(() => [
        {id: 'name', meta: {copy: true}, name: 'Название навыка'},
        {id: 'count', meta: {copy: true}, name: 'Колличество решенных задач'},
    ], []);

    return (
        <div className={classes.skillsUser}>
            <CustomTable
                className={classes.table}
                data={data}
                columns={columns}
                width={"max"}
            />
        </div>
    )
}