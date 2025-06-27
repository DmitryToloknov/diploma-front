import {changeTitle} from "../../../../utils/Title.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../../blocks/alert/info/useCustomAlert.js";
import React, {useEffect, useRef, useState} from "react";
import {COURSE_UPDATE} from "../../../../utils/Roles.js";
import NeedAuth from "../../../../utils/Auth/NeedAuth.jsx";
import NoAccess from "../../../../utils/Accses/NoAccess.jsx";
import classes from "./CourseStatistics.module.css";
import {
    Breadcrumbs,
    Button,
    Dialog, FirstDisplayedItemsCount,
    Icon,
    Label, LastDisplayedItemsCount,
    Loader,
    Modal,
    Select,
    Skeleton,
    Text,
    TextArea
} from "@gravity-ui/uikit";
import {useGetGroups} from "../hook/GetGroups.jsx";
import {useGetUsersByGroup} from "../hook/GetUsersByGroup.jsx";
import {useGetTaskInfoForStatistics} from "../hook/GetTaskInfoForStatistics.jsx";
import CustomAlert from "../../../blocks/alert/info/CustomAlert.jsx";
import {useGetHistoryForStatistic} from "../hook/GetHistoryForStatistic.jsx";
import {formatDate} from "../../../../utils/DataFormat.jsx";
import {statusThemeMap} from "../task/CourseTask.jsx";
import {useGetAttempt} from "../hook/GetAttempt.jsx";
import {Editor} from "@monaco-editor/react";
import {Check, Xmark} from "@gravity-ui/icons";
import {useRejectAttempt} from "../hook/RejectAttempt.jsx";
import {NumberInput} from "@gravity-ui/markdown-editor/_/index.js";
import {useApproveAttempt} from "../hook/ApproveAttempt.jsx";

export default function CourseStatistics() {
    changeTitle("Статистика")
    const navigate = useNavigate();
    const {id} = useParams();
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const [access, setAccess] = useState(null);

    const {getGroups, groups} = useGetGroups();
    const [group, setGroup] = useState(null);

    const {getUsersByGroupId, users} = useGetUsersByGroup();
    const [user, setUser] = useState(null);

    const {getTaskInfoForStatistics, taskInfo, setTaskInfo} = useGetTaskInfoForStatistics();

    const [openModalHistory, setOpenModalHistory] = useState(false);
    const {getHistoryForStatistic, history, setHistory, loadingHistory} = useGetHistoryForStatistic();
    const [taskId, setTaskId] = useState(null);

    const {getAttempt, attempt, setAttempt, loadingAttempt} = useGetAttempt();
    const [attemptId, setAttemptId] = useState(null);
    const [estimation, setEstimation] = useState(0);

    const [openDialogReject, setOpenDialogReject] = useState(false);
    const dialogTitleIdReject = "dialogTitleIdReject";
    const [reasonReject, setReasonReject] = useState(null);
    const {rejectAttempt, isLoadingRejectAttempt} = useRejectAttempt();

    const [openDialogApprove, setOpenDialogApprove] = useState(false);
    const dialogTitleIdApprove = "dialogTitleIdApprove";
    const [reasonApprove, setReasonApprove] = useState(null);
    const [estimationActual, setEstimationActual] = useState(0);
    const {approveAttempt, isLoadingApproveAttempt} = useApproveAttempt();

    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            if (!isLoaded) {
                getGroups(accessTokenRef.current, showAlert);
                setAccess(checkRoles([COURSE_UPDATE]));
                setIsLoaded(true);
            }
        }
    }, [accessToken]);

    useEffect(() => {
        if (group != null) {
            getUsersByGroupId(accessTokenRef.current, showAlert, group)
        }
    }, [group]);

    useEffect(() => {
        if (user != null) {
            getTaskInfoForStatistics(accessTokenRef.current, showAlert, id, user)
        }
    }, [user]);

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

    const items = [
        { text: 'Курс', action: () => navigate(`/course/${id}`),},
        { text: 'Статистика курса' },
    ];
    return (
        <div>
            <Breadcrumbs
                items={items}
                firstDisplayedItemsCount={FirstDisplayedItemsCount.One}
                lastDisplayedItemsCount={LastDisplayedItemsCount.Two}
            />
            <div className={classes.filters}>
                <Select
                    className={classes.settingElement}
                    width={'auto'}
                    label={"Группа:"}
                    size={"m"}
                    hasClear={true}
                    filterable={true}
                    value={[group]}
                    onUpdate={(i) => {
                        setTaskInfo(null)
                        setGroup(i[0]);
                        setUser(null);
                    }}
                >
                    {groups?.map(group => (
                        <Select.Option key={group.id} value={group.id}>
                            {group.year + " " + group.shortName}
                        </Select.Option>
                    ))}
                </Select><br/>
                <Select
                    className={classes.settingElement}
                    width={'auto'}
                    label={"Студент:"}
                    size={"m"}
                    hasClear={true}
                    filterable={true}
                    value={[user]}
                    onUpdate={(i) => {
                        setUser(i[0]);
                        setTaskInfo(null)
                    }}
                >
                    {users?.map(user => (
                        <Select.Option key={user.id} value={user.id}>
                            {user.userName}
                        </Select.Option>
                    ))}
                </Select><br/>
            </div>
            <div className={classes.body}>
                <div className={classes.center}>
                    <div className={classes.tasks}>
                        <Text variant="header-1">
                            Задачи
                        </Text>
                        {taskInfo?.tasks?.length > 0 ? (taskInfo?.tasks?.map(task => (
                            <div className={classes.task} onClick={() => {
                                setEstimation(task.estimation)
                                setOpenModalHistory(true);
                                setHistory([]);
                                setTaskId(task.id);
                                getHistoryForStatistic(accessTokenRef.current, showAlert, task.id, id, user);
                                setAttempt(null);
                            }}>
                                <div className={classes.leftInfo}>
                                    <div className={classes.id}>
                                        <Text variant="body-2"
                                              color={
                                                  task.review
                                                      ? "warning"
                                                      : task.done
                                                          ? "positive"
                                                          : "primary"
                                              }>
                                            #{task.id}
                                        </Text>
                                    </div>
                                    <div className={classes.taskName}>
                                        <Text variant="body-2"
                                              color={
                                                  task.review
                                                      ? "warning"
                                                      : task.done
                                                          ? "positive"
                                                          : "primary"
                                              }>
                                            {task.name}
                                        </Text>
                                    </div>
                                </div>

                                <div className={classes.estimation}>
                                    <Text variant="body-2"
                                          color={
                                              task.review
                                                  ? "warning"
                                                  : task.done
                                                      ? "positive"
                                                      : "primary"
                                          }
                                          whiteSpace={"nowrap"}>
                                        {task.estimationActual} / {task.estimation}
                                    </Text>
                                </div>
                            </div>
                        ))) : (
                            <div className={classes.notTask}>
                                <Text variant="subheader-1" color={"warning"}>
                                    Выберите студента для просмотра информации
                                </Text>
                            </div>
                        )}
                    </div>
                </div>

                {taskInfo?.actualEstimation != null && taskInfo?.totalEstimation != null ? (
                    <div className={classes.right}>
                        <Text variant="header-1">
                            Информация о курсе
                        </Text>
                        <div className={classes.estimationInfo}>
                            <Text variant="body-1">
                                Баллов: {taskInfo.actualEstimation} / {taskInfo.totalEstimation}
                            </Text>
                        </div>
                    </div>

                ) : null}
            </div>
            <Modal open={openModalHistory} onClose={() => setOpenModalHistory(false)}>
                <div className={classes.modal}>
                    <div className={classes.modalBody}>
                        <div className={classes.attemptInfo}>
                            {!loadingAttempt ? (
                                <div className={classes.historyElem}>
                                    <div className={classes.historyHeader}>
                                        <Text variant="header-1">
                                            Информация о попытке
                                        </Text>
                                    </div>
                                    {attempt?.status ? (
                                        <div className={classes.history}>
                                            <div className={classes.date}>
                                                {formatDate(attempt.updatedDateTime)}
                                            </div>
                                            <div className={classes.status}>
                                                <Label theme={statusThemeMap[attempt.statusKey] || 'info'}>
                                                    {attempt.status}
                                                </Label>
                                            </div>
                                        </div>
                                    ) : null}

                                    {attempt?.code && attempt?.language ? (
                                        <Editor className={classes.codeModal}
                                                width={"max"}
                                                height={"400px"}
                                                theme={"light"}
                                                language={attempt.language}
                                                value={attempt.code}
                                        />
                                    ) : null}

                                    {attempt?.inCase && attempt.outCase ? (
                                        <div className={classes.case}>
                                            <div className={classes.inInfo}>
                                                <TextArea minRows={3} readOnly={true}
                                                          maxRows={6}
                                                          value={attempt.inCase}
                                                          note={"Входные значения"}/>
                                            </div>
                                            <div className={classes.outInfo}>
                                                <TextArea minRows={3} readOnly={true}
                                                          maxRows={6}
                                                          value={attempt.outCase}
                                                          note={"Ожадаемый результат"}/>
                                            </div>
                                        </div>
                                    ) : null}
                                    {attempt?.statusKey === "REVIEW" ? (
                                        <div className={classes.review}>
                                            <Button className={classes.buttonDelete}
                                                    view={"action"}
                                                    size={"m"}
                                                    onClick={() => {
                                                        setReasonReject(null)
                                                        setOpenDialogReject(true);
                                                    }
                                            }
                                            >Отклонить <Icon data={Xmark}/></Button>
                                            <Button className={classes.button}
                                                    view={"action"}
                                                    size={"m"}
                                                    onClick={() => {
                                                        setEstimationActual(estimation);
                                                        setReasonApprove(null)
                                                        setOpenDialogApprove(true)
                                                    }}
                                            >Принять <Icon data={Check}/></Button>
                                        </div>
                                    ) : null}

                                    {attempt?.result ? (
                                        <div className={classes.inInfo}>
                                            <TextArea minRows={3} readOnly={true}
                                                      maxRows={6}
                                                      value={attempt.result}
                                                      note={"Актуальный результат"}/>
                                        </div>
                                    ) : null}

                                    {attempt?.reasonRejection ? (
                                        <div className={classes.reasonRejection}>
                                            <TextArea minRows={3} readOnly={true}
                                                      maxRows={10}
                                                      value={attempt.reasonRejection}
                                                      note={"Причина отклонения"}/>
                                        </div>
                                    ) : null}
                                    {attempt?.downgradeReason ? (
                                        <div className={classes.reasonRejection}>
                                            <TextArea minRows={3} readOnly={true}
                                                      maxRows={10}
                                                      value={attempt.downgradeReason}
                                                      note={"Причина понижения оценки"}/>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <Skeleton className={classes.skeleton}/>
                            )}
                        </div>
                        <div className={classes.historys}>
                            <Text variant="header-1">
                                История
                            </Text>
                            {!loadingHistory ? (
                                <div>
                                    {history?.length > 0 ? (history?.map(his => (
                                        <div className={classes.history}
                                             onClick={() => {
                                                 setAttempt(null)
                                                 getAttempt(accessTokenRef.current, showAlert, his.id);
                                                 setAttemptId(his.id);
                                             }}
                                        >
                                            <div className={classes.date}>
                                                {formatDate(his.createdDateTime)}
                                            </div>
                                            <div className={classes.status}>
                                                <Label theme={statusThemeMap[his.statusKey] || 'info'}>
                                                    {his.status}
                                                </Label>
                                            </div>
                                        </div>
                                    ))) : (
                                        <div className={classes.notHistory}>
                                            <Text variant="subheader-1">
                                                Нет истории
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            ) : (<Skeleton className={classes.skeleton}/>)}
                        </div>
                    </div>
                </div>
            </Modal>

            <Dialog
                onClose={() => setOpenDialogReject(false)}
                open={openDialogReject}
                aria-labelledby={dialogTitleIdReject}
            >
                <Dialog.Header caption="Укажите причину отклонения"/>
                <Dialog.Body>
                    <TextArea minRows={3}
                              maxRows={10}
                              value={reasonReject}
                              onUpdate={(s) => setReasonReject(s)}
                              />
                </Dialog.Body>
                <Dialog.Footer
                    loading={isLoadingRejectAttempt}
                    onClickButtonCancel={() => setOpenDialogReject(false)}
                    onClickButtonApply={async () => {
                        await rejectAttempt(
                            accessTokenRef.current,
                            showAlert,
                            attemptId,
                            {reason: reasonReject},
                            setOpenDialogReject,
                            () => {
                                getTaskInfoForStatistics(accessTokenRef.current, showAlert, id, user);
                                getHistoryForStatistic(accessTokenRef.current, showAlert, taskId, id, user);
                                getAttempt(accessTokenRef.current, showAlert, attemptId);
                            }
                        );

                    }}
                    textButtonApply={"Отклонить"}
                    textButtonCancel={"Отмена"}
                />
            </Dialog>

            <Dialog
                onClose={() => setOpenDialogApprove(false)}
                open={openDialogApprove}
                aria-labelledby={dialogTitleIdApprove}
            >
                <Dialog.Header caption="Укажите оценку"/>
                <Dialog.Body>
                    <NumberInput
                        className={classes.estimationActual}
                        label={"Оценка:"}
                        size={"m"}
                        min={0}
                        max={estimation}
                        value={estimationActual}
                        onUpdate={(i) => setEstimationActual(i)}
                    />
                    {estimationActual<estimation ? (
                        <TextArea minRows={3}
                                  placeholder={"Причина снижения оценки"}
                                  maxRows={10}
                                  value={reasonApprove}
                                  onUpdate={(s) => setReasonApprove(s)}
                        />
                    ): null}
                </Dialog.Body>
                <Dialog.Footer
                    loading={isLoadingApproveAttempt}
                    onClickButtonCancel={() => setOpenDialogApprove(false)}
                    onClickButtonApply={async () => {
                        await approveAttempt(
                            accessTokenRef.current,
                            showAlert,
                            attemptId,
                            {reason: reasonApprove, estimation: estimationActual},
                            setOpenDialogApprove,
                            () => {
                                getTaskInfoForStatistics(accessTokenRef.current, showAlert, id, user);
                                getHistoryForStatistic(accessTokenRef.current, showAlert, taskId, id, user);
                                getAttempt(accessTokenRef.current, showAlert, attemptId);
                            }
                        );

                    }}
                    textButtonApply={"Принять"}
                    textButtonCancel={"Отмена"}
                />
            </Dialog>
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    )

}