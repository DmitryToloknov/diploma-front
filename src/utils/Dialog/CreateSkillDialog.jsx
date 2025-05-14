import {Dialog, TextInput} from "@gravity-ui/uikit";
import React, {useState} from "react";
import classes from "../../components/body/users/UsersSettings.module.css";
import {useCreateSkill} from "./hook/CreateSkill.jsx";

export default function CreateSkillDialog({
                                         open,
                                         setOpen,
                                         token,
                                         showAlert,
                                         getSkills,
                                     }) {
    const dialogTitleId = "deleteDialog";
    const [name, setName] = useState("");
    const {createSkill, loading} = useCreateSkill()
    return (
        <Dialog
            onClose={() => setOpen(false)}
            open={open}
            aria-labelledby={dialogTitleId}
        >
            <Dialog.Header caption={"Создание скила"}/>
            <Dialog.Body>
                <TextInput
                    className={classes.filter}
                    label={"Название:"}
                    size={"m"}
                    hasClear={true}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Dialog.Body>
            <Dialog.Footer
                loading={loading}
                onClickButtonCancel={() => setOpen(false)}
                onClickButtonApply={async () => {
                    await createSkill(token.current, showAlert, name, setOpen, setName);
                    getSkills(token.current, showAlert);
                }}
                textButtonApply="Создать"
                textButtonCancel="Отменить"
            />
        </Dialog>
    )
}