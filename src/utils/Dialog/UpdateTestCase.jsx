import {Dialog, TextArea} from "@gravity-ui/uikit";
import React from "react";
import {useUpdateTestCase} from "./hook/UpdateTestCase.jsx";

export default function UpdateTestCase({
                                           open,
                                           setOpen,
                                           getTestCases,
                                           token,
                                           showAlert,
                                           id,
                                           testCase,
                                           setTestCase,
                                       }) {
    const dialogTitleId = "UpdateDialog";

    const {updateTestCase, isLoading} = useUpdateTestCase();

    return (
        <Dialog
            onClose={() => setOpen(false)}
            open={open}
            aria-labelledby={dialogTitleId}
        >
            <Dialog.Header caption={"Редактирование тестового кейса"}/>
            <Dialog.Body>
                <TextArea minRows={3}
                          maxRows={6}
                          note={"In"}
                          value={testCase && testCase.inCase ? testCase.inCase : ""}
                          onUpdate={(s) => setTestCase((testCase) => ({...testCase,  inCase: s}))}
                />
                <TextArea minRows={3} readOnly={true}
                          maxRows={6}
                          note={"Out"}
                          value={testCase.outCase ? testCase.outCase : ""}
                />
            </Dialog.Body>
            <Dialog.Footer
                loading={isLoading}
                onClickButtonCancel={() => setOpen(false)}
                onClickButtonApply={async () => {
                    await updateTestCase(token.current, showAlert, testCase, setOpen);
                    getTestCases(token.current, showAlert, id);
                }}
                textButtonApply={"Обновить"}
                textButtonCancel={"Отменить"}
            />
        </Dialog>
    )
}