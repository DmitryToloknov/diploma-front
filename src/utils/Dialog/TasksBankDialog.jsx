import {Dialog} from "@gravity-ui/uikit";
import React, {useState} from "react";
import classes from "../../components/body/users/UsersSettings.module.css";
import {useAddTaskInCourse} from "./hook/AddTaskCourse.jsx";
import {NumberInput} from "@gravity-ui/markdown-editor/_/index.js";

export default function TasksBankDialog({
                                            open,
                                            setOpen,
                                            token,
                                            showAlert,
                                            id,
                                            getTasks,
                                        }) {
    const dialogTitleId = "TasksBankDialog";
    const {addTaskInCourse, isLoading} = useAddTaskInCourse();
    const [taskId, setTaskId] = useState(0);
    return (
        <Dialog
            onClose={() => {
                setOpen(false);
                getTasks(token.current, showAlert, id)
            }}
            open={open}
            aria-labelledby={dialogTitleId}
        >
            <Dialog.Header caption={"Добавить задачу"}/>
            <Dialog.Body>
                <NumberInput
                    className={classes.filter}
                    label={"Номер задачи: #"}
                    size={"m"}
                    hasClear={true}
                    value={taskId}
                    onUpdate={(i) => setTaskId(i)}
                />
            </Dialog.Body>
            <Dialog.Footer
                loading={isLoading}
                onClickButtonCancel={() => {
                    setOpen(false);
                    getTasks(token.current, showAlert, id)
                }}
                onClickButtonApply={async () => {
                    await addTaskInCourse(token.current, showAlert, id, taskId);
                    getTasks(token.current, showAlert, id)
                }}
                textButtonApply="Добавить"
                textButtonCancel="Отменить"
            />
        </Dialog>
    )
}