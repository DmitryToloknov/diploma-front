import classes from './CourseSettings.module.css'
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {COURSE_UPDATE} from "../../../../utils/Roles.js";
import NeedAuth from "../../../../utils/Auth/NeedAuth.jsx";
import NoAccess from "../../../../utils/Accses/NoAccess.jsx";
import {Button, Icon, Loader, Select, Switch, Table, Text, UserLabel, withTableActions} from "@gravity-ui/uikit";
import {changeTitle} from "../../../../utils/Title.jsx";
import {useAuth} from "../../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../../blocks/alert/info/useCustomAlert.js";
import CustomAlert from "../../../blocks/alert/info/CustomAlert.jsx";
import {MarkdownEditorView, useMarkdownEditor} from "@gravity-ui/markdown-editor/_/index.js";
import {SERVER_URL, TASK} from "../../../../utils/constant.js";
import {toaster} from "@gravity-ui/uikit/toaster-singleton-react-18";
import {TextInputBig} from "../../../blocks/Input/TextInputBig.jsx";
import {RedButton} from "../../../blocks/button/RedButton.jsx";
import {useGetLanguages} from "../../../bank/task/hook/GetLanguage.jsx";
import {useGetGroups} from "../hook/GetGroups.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useGetCourse} from "../hook/GetCourse.jsx";
import DeleteDialog from "../../../../utils/Dialog/DeleteDialog.jsx";
import {useDeleteCourse} from "../hook/DeleteCourse.jsx";
import {useUpdateCourse} from "../hook/UpdateCourse.jsx";
import {Plus} from "@gravity-ui/icons";
import TasksBankDialog from "../../../../utils/Dialog/TasksBankDialog.jsx";
import {useGetTasks} from "../hook/GetTasks.jsx";
import {useRemoveTask} from "../hook/RemoveTask.jsx";

export default function CourseSettings() {
    changeTitle("Настройка курса")
    const navigate = useNavigate();
    const {id} = useParams();
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const [access, setAccess] = useState(null);

    const {getLanguages, languages} = useGetLanguages();
    const {getGroups, groups} = useGetGroups();
    const {getCourse, course, setCourse} = useGetCourse();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const {deleteCourse, isLoadingDeleteCourse} = useDeleteCourse();
    const {updateCourse, isLoadingUpdateCourse} = useUpdateCourse();

    //task
    const [openTaskAddDialog, setOpenTaskAddDialog] = useState(false);
    const {getTasks, tasks} = useGetTasks();
    const {removeTask} = useRemoveTask()

    const CustomTable =  React.memo(withTableActions(Table));
    const memoizedTasks = useMemo(() => tasks, [tasks]);

    const columns = useMemo(() => [
        {id: 'id', name: 'Id', template: (item) => "#"+item.id,},
        {id: 'name', name: 'Название задачи'},
        {id: 'estimation', name: 'Оценка'},
    ], []);

    const onRowClick = useCallback((item) => {
        navigate(TASK + "/" + item.id);
    }, []);

    const getRowActions = (item) => {
        return [
            {
                text: 'Удалить',
                handler: async () => {
                    await removeTask(accessTokenRef.current, showAlert, id, item.id);
                    getTasks(accessTokenRef.current, showAlert, id);
                },
                theme: 'danger',
            },
        ];
    };

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
                getLanguages(accessTokenRef.current, showAlert);
                getCourse(accessTokenRef.current, showAlert, id, editor);
                getGroups(accessTokenRef.current, showAlert);
                getTasks(accessTokenRef.current, showAlert, id);
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

    if (!isLoaded) {
        return <div className={classes.loader}>
            <Loader/>
        </div>
    }

    return (
        <div>
            <div className={classes.name}>
                <TextInputBig
                    placeholder={"Название курса"}
                    value={course.name}
                    onUpdate={(i) => setCourse((course) => ({...course, name: i}))}
                />
            </div>
            <div className={classes.body}>
                <div className={classes.center}>
                    <div className={classes.description}>
                        <Text variant="subheader-1">
                            Описание курса:
                        </Text>
                        <MarkdownEditorView stickyToolbar autofocus toaster={toaster} editor={editor}/>
                    </div>
                    <div className={classes.tasks}>
                        <div className={classes.tasksHeader}>
                            <div>
                                <Text variant="header-1">Задачи</Text>
                            </div>
                            <Button
                                view="action"
                                size="m"
                                onClick={() => setOpenTaskAddDialog(true)}
                            >Добавить задачу <Icon data={Plus}/></Button>
                        </div>
                        <CustomTable
                            className={classes.usersTable}
                            data={memoizedTasks}
                            columns={columns}
                            width={"max"}
                            onRowClick={onRowClick}
                            getRowActions={getRowActions}
                        />
                    </div>
                </div>
                <div className={classes.right}>
                    <UserLabel type="person" size={"xs"}>{course.creatorName}</UserLabel><br/>
                    <Select
                        className={classes.settingElement}
                        width={'max'}
                        label={"Языки программирования:"}
                        size={"m"}
                        hasClear={true}
                        filterable={true}
                        multiple={true}
                        value={course.languages}
                        onUpdate={(i) => setCourse((course) => ({...course, languages: i}))}
                    >
                        {languages?.map(language => (
                            <Select.Option key={language.name} value={language.name}>
                                {language.description}
                            </Select.Option>
                        ))}
                    </Select><br/>
                    <Select
                        className={classes.settingElement}
                        width={'max'}
                        label={"Доступно для групп:"}
                        size={"m"}
                        hasClear={true}
                        filterable={true}
                        multiple={true}
                        value={course.groups}
                        onUpdate={(i) => setCourse((course) => ({...course, groups: i}))}
                    >
                        {groups?.map(group => (
                            <Select.Option key={group.id} value={group.id}>
                                {group.year + " " + group.shortName}
                            </Select.Option>
                        ))}
                    </Select><br/>
                    <div className={`${classes.buttonSetting}  ${classes.settingElement}`}>
                        <RedButton size={"m"} width={"max"} value={"Удалить"}
                                   onClick={() => setOpenDeleteDialog(true)}/>
                        <Button
                            view={"action"}
                            size={"m"}
                            width={"max"}
                            loading={isLoadingUpdateCourse}
                            onClick={() => {
                                const updatedDescription = editor.getValue();
                                const updatedCourse = { ...course, description: updatedDescription };
                                setCourse(updatedCourse);
                                updateCourse(accessTokenRef.current, showAlert, updatedCourse);
                            }}
                        >Сохранить</Button>
                    </div>
                </div>

            </div>
            <DeleteDialog
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                loading={isLoadingDeleteCourse}
                body={"Вы действительно хотите удалить задачу?"}
                onClick={() => deleteCourse(accessTokenRef.current, showAlert, id)}
            />
            <TasksBankDialog open={openTaskAddDialog} setOpen={setOpenTaskAddDialog} token={accessTokenRef} showAlert={showAlert} id={id} getTasks={getTasks}/>
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    )
}