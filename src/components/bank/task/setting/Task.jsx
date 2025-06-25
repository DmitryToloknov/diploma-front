import {changeTitle} from "../../../../utils/Title.jsx";
import {useAuth} from "../../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../../blocks/alert/info/useCustomAlert.js";
import React, {useEffect, useRef, useState} from "react";
import {COURSE_UPDATE} from "../../../../utils/Roles.js";
import NeedAuth from "../../../../utils/Auth/NeedAuth.jsx";
import NoAccess from "../../../../utils/Accses/NoAccess.jsx";
import classes from "./Task.module.css";
import {Button, Icon, Loader, Select, Text, TextArea, UserLabel} from "@gravity-ui/uikit";
import CustomAlert from "../../../blocks/alert/info/CustomAlert.jsx";
import {TextInputBig} from "../../../blocks/Input/TextInputBig.jsx";
import {toaster} from "@gravity-ui/uikit/toaster-singleton-react-18";
import {MarkdownEditorView, NumberInput, useMarkdownEditor} from "@gravity-ui/markdown-editor";
import {CircleMinusFill, Gear, Plus} from "@gravity-ui/icons";
import {RedButton} from "../../../blocks/button/RedButton.jsx";
import {SERVER_URL} from "../../../../utils/constant.js";
import CodeEditor from "../../../blocks/codeeditor/CodeEditor.jsx";
import {useParams} from "react-router-dom";
import {useDeleteTask} from "../hook/DeleteTask.jsx";
import DeleteDialog from "../../../../utils/Dialog/DeleteDialog.jsx";
import CreateSkillDialog from "../../../../utils/Dialog/CreateSkillDialog.jsx";
import {useGetSkills} from "../hook/GetSkills.jsx";
import {useCreateTestCase} from "../hook/CreateTestCase.jsx";
import {useGetTestCases} from "../hook/GetTestCase.jsx";
import {useDeleteTestCase} from "../hook/DeleteTestCase.jsx";
import UpdateTestCase from "../../../../utils/Dialog/UpdateTestCase.jsx";
import {useGetTestCase} from "../../../../utils/Dialog/hook/GetTestCase.jsx";
import {useGetTask} from "../hook/GetTask.jsx";
import {useUpdateTask} from "../hook/UpdateTask.jsx";
import {useStartTask} from "../hook/StartTask.js";

export default function Task() {
    changeTitle("Задача")
    const {id} = useParams();
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const [access, setAccess] = useState(null);

    //task
    const {getTask, task, setTask} = useGetTask()
    const languages = [
        {
            key: "CPP",
            value: "cpp",
        },
        {
            key: "PYTHON",
            value: "python",
        }
    ]
    const {updateTask, isLoadingUpdateTask} = useUpdateTask()

    //dialogDelete
    const {deleteTask, isLoadingDelete} = useDeleteTask();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    //skill
    const [openCreateSkillDialog, setOpenCreateSkillDialog] = useState(false);
    const {getSkills, skills} = useGetSkills();

    //testCase
    const {createTestCase, isCreateTestCase} = useCreateTestCase();
    const {getTestCases, testCases} = useGetTestCases();
    const {deleteTestCase, isLoadingDeleteTestCase} = useDeleteTestCase();
    const [openUpdateTestCaseDialog, setOpenUpdateTestCaseDialog] = useState(false);
    const {getTestCase, testCase, setTestCase} = useGetTestCase();
    const {startTask, isLoadingStartTask} = useStartTask();

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(SERVER_URL + "file/img/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessTokenRef.current}`,
                },
                body: formData,
            });

            if (!response.ok) {
                showAlert("danger", "Ошибка", "Не удалось загрузить файл.");
            }

            const data = await response.json();
            return {url: data.fileUrl};
        } catch (error) {
            showAlert("danger", "Ошибка", "Не удалось загрузить файл.");
        }
    };

    const editor = useMarkdownEditor({
        allowHTML: true,
        fileUploadHandler: uploadImage,
    });
    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            if (!isLoaded) {
                getTask(accessTokenRef.current, showAlert, id, editor)
                getTestCases(accessTokenRef.current, showAlert, id)
                getSkills(accessTokenRef.current, showAlert);
                setAccess(checkRoles([COURSE_UPDATE]));
                setIsLoaded(true);
            }
        }
    }, [accessToken]);

    if (isWasRefreshed && !isAuth) {
        return (<NeedAuth/>)
    }

    if (isWasRefreshed && access != null && !access) {
        return <NoAccess/>
    }

    if (!isLoaded || task.taskLanguage == null) {
        return <div className={classes.loader}>
            <Loader/>
        </div>
    }

    return (
        <div>
            <div className={classes.name}>
                <TextInputBig value={task.name} onUpdate={(i) => setTask((task) => ({...task, name: i}))}/>
            </div>
            <div className={classes.taskInfo}>
                <div className={classes.body}>
                    <div className={classes.description}>
                        <div className={classes.subHeader}>
                            <Text variant="subheader-1">
                                Описание задачи:
                            </Text>
                        </div>
                        <MarkdownEditorView stickyToolbar autofocus toaster={toaster} editor={editor}/>
                    </div>
                    <div className={classes.editor}>
                        <div className={classes.subHeader}>
                            <Text variant="subheader-1">
                                Код для запуска тестовых кейсов:
                            </Text>
                        </div>
                        <CodeEditor
                            width={"max"}
                            height={"400px"}
                            languages={languages}
                            task={task}
                            setTask={setTask}
                        />
                    </div>
                    <div className={classes.testCases}>
                        <div className={classes.subHeader}>
                            <Text variant="subheader-1">
                                Тестовые кейсы:
                            </Text>
                            <Button view={"action"} size={"m"} width={"auto"} loading={isCreateTestCase}
                                    onClick={() => createTestCase(accessTokenRef.current, showAlert, id, getTestCases)
                                    }>Добавить кейс <Icon data={Plus}/></Button>
                        </div>
                        <div className={classes.caseColumns}>
                            <div className={classes.caseColumn}>
                                <Text variant="subheader-1">
                                    In
                                </Text>
                            </div>
                            <div className={classes.caseColumn}>
                                <Text variant="subheader-1">
                                    Out
                                </Text>
                            </div>
                        </div>
                        {testCases?.map(testCase => (
                            <div className={classes.case} key={testCase.id}>
                                <div className={classes.inInfo}
                                     onClick={async () => {
                                         await getTestCase(accessTokenRef.current, showAlert, testCase.id);
                                         setOpenUpdateTestCaseDialog(true);
                                     }}
                                >
                                    <TextArea minRows={3} readOnly={true}
                                              maxRows={6}
                                              value={testCase.inCase ? testCase.inCase : ""}/>
                                </div>
                                <div className={classes.outInfo}>
                                    <TextArea minRows={3} readOnly={true}
                                              maxRows={6}
                                              value={testCase.outCase ? testCase.outCase : ""}/>
                                </div>


                                <Button view={"flat"}
                                        loading={isLoadingDeleteTestCase}
                                        size={"m"}
                                        onClick={() => deleteTestCase(accessTokenRef.current, showAlert, testCase.id, id, getTestCases)}
                                ><Icon data={CircleMinusFill}/></Button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={classes.setting}>
                    <UserLabel type="person" size={"xs"}>{task.creatorName}</UserLabel>
                    <NumberInput
                        className={classes.settingElement}
                        label={"Оценка:"}
                        size={"m"}
                        min={1}
                        value={task.estimation}
                        onUpdate={(i) => setTask((task) => ({...task, estimation: i}))}
                    />
                    <NumberInput
                        className={classes.settingElement}
                        label={"Лимит времени:"}
                        size={"m"}
                        min={1}
                        endContent={<span className={classes.unit}>ms</span>}
                        value={task.timeLimit}
                        onUpdate={(i) => setTask((task) => ({...task, timeLimit: i}))}
                    />
                    <NumberInput
                        className={classes.settingElement}
                        label={"Лимит памяти:"}
                        size={"m"}
                        min={1}
                        endContent={<span className={classes.unit}>MB</span>}
                        value={task.memoryLimit}
                        onUpdate={(i) => setTask((task) => ({...task, memoryLimit: i}))}
                    />
                    <div className={`${classes.skills} ${classes.settingElement}`}>
                        <Select
                            className={classes.filter}
                            width={'max'}
                            label={"Скилы:"}
                            size={"m"}
                            hasClear={true}
                            filterable={true}
                            multiple={true}
                            value={task.skills}
                            onUpdate={(i) => setTask((task) => ({...task, skills: i}))}

                        >
                            {skills?.map(skill => (
                                <Select.Option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </Select.Option>
                            ))}
                        </Select>
                        <Button view={"action"} size={"m"} onClick={() => setOpenCreateSkillDialog(true)}><Icon
                            data={Plus}/></Button>
                    </div>

                    <div className={`${classes.buttonSetting}  ${classes.settingElement}`}>
                        <RedButton size={"m"} width={"max"} value={"Удалить"}
                                   onClick={() => setOpenDeleteDialog(true)}/>
                        <Button
                            view={"action"}
                            size={"m"}
                            width={"max"}
                            loading={isLoadingUpdateTask}
                            onClick={() => {
                                const updatedDescription = editor.getValue();
                                const updatedTask = {...task, description: updatedDescription};

                                setTask(updatedTask); // Обновляем состояние
                                updateTask(accessTokenRef.current, showAlert, updatedTask);
                            }}>Сохранить</Button>
                    </div>
                    <Button
                        className={classes.settingElement}
                        view={"action"}
                        size={"m"}
                        width={"max"}
                        loading={isLoadingStartTask}
                        onClick={() => {
                            startTask(accessTokenRef.current, showAlert, id);
                        }}>
                        Запустить кейсы
                    </Button>
                </div>
            </div>
            <DeleteDialog
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                loading={isLoadingDelete}
                body={"Вы действительно хотите удалить задачу?"}
                onClick={() => deleteTask(accessTokenRef.current, showAlert, id)}
            />
            <UpdateTestCase
                testCase={testCase}
                setTestCase={setTestCase}
                open={openUpdateTestCaseDialog}
                setOpen={setOpenUpdateTestCaseDialog}
                getTestCases={getTestCases}
                token={accessTokenRef}
                showAlert={showAlert}
                id={id}
            />
            <CreateSkillDialog
                token={accessTokenRef}
                showAlert={showAlert}
                open={openCreateSkillDialog}
                setOpen={setOpenCreateSkillDialog}
                getSkills={getSkills}/>
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    )
}