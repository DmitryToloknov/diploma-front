import {changeTitle} from "../../../../utils/Title.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../../blocks/alert/info/useCustomAlert.js";
import React, {useEffect, useRef, useState} from "react";
import NeedAuth from "../../../../utils/Auth/NeedAuth.jsx";
import classes from "./CourseTask.module.css";
import {
    Breadcrumbs,
    Button,
    FirstDisplayedItemsCount,
    Icon,
    Label,
    LastDisplayedItemsCount,
    Loader,
    Modal,
    Select,
    Text,
    TextArea
} from "@gravity-ui/uikit";
import {useGetTaskInfo} from "../hook/GetTaskInfo.jsx";
import CustomAlert from "../../../blocks/alert/info/CustomAlert.jsx";
import {MarkdownPreview} from "../../../blocks/markdownPreview/MarkdownPreview.jsx";
import {Editor} from "@monaco-editor/react";
import {Play} from "@gravity-ui/icons";
import {useCreateAttempt} from "../hook/createAttempt.jsx";
import {useGetAttempts} from "../hook/GetAttempts.jsx";
import {formatDate} from "../../../../utils/DataFormat.jsx";
import {useGetAttempt} from "../hook/GetAttempt.jsx";

export const statusThemeMap = {
    SUCCESS: 'success',
    NEW: 'info',
    IN_PROGRESS: 'warning',
    ERROR: 'danger',
    REJECTED: 'danger',
    REVIEW: 'warning',
};

export default function CourseTask() {
    const {id, taskId} = useParams();
    const navigate = useNavigate();
    changeTitle("Задание #" + taskId)
    const {accessToken, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const [languageKey, setLanguageKey] = useState();
    const [languageValue, setLanguageValue] = useState("");
    const [code, setCode] = useState("");
    const {getTaskInfo, task} = useGetTaskInfo();

    const {createAttempt} = useCreateAttempt();
    const {getAttempts, attempts} = useGetAttempts();
    const {getAttempt, attempt} = useGetAttempt();
    const [openModalAttempt, setOpenModalAttempt] = useState(false);


    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            if (!isLoaded) {
                getTaskInfo(accessTokenRef.current, showAlert, taskId, id);
                getAttempts(accessTokenRef.current, showAlert, taskId, id);
                setIsLoaded(true);
            }
        }
    }, [accessToken]);

    if (isWasRefreshed && !isAuth) {
        return (<NeedAuth/>)
    }

    if (!isLoaded) {
        return <div className={classes.loader}>
            <Loader/>
        </div>
    }

    const items = [
        { text: 'Курс', action: () => navigate(`/course/${id}`),},
        { text: 'Задача' },
    ];
    return (
        <div>
            <Breadcrumbs
                items={items}
                firstDisplayedItemsCount={FirstDisplayedItemsCount.One}
                lastDisplayedItemsCount={LastDisplayedItemsCount.Two}
            />
            <div className={classes.name}>
                {task.name}
            </div>
            <div className={classes.task}>
                <div className={classes.body}>

                    <div className={classes.description}>
                        <MarkdownPreview value={task.description ?? ''}/>
                    </div>
                    <div className={classes.editor}>
                        <div className={classes.subHeader}>
                            <Text variant="subheader-1">
                                Код решения:
                            </Text>
                        </div>
                        <div className={classes.code}>
                            <div className={classes.codeButton}>
                                <Select
                                    width={'auto'}
                                    label={"язык:"}
                                    size={"m"}
                                    hasClear={true}
                                    filterable={true}
                                    onUpdate={(selectedKeys) => {
                                        setLanguageKey(selectedKeys[0]);
                                        setLanguageValue(task.languages.find(lang => lang.name === selectedKeys[0])?.description);
                                    }}
                                >
                                    {task.languages?.map(group => (
                                        <Select.Option key={group.name} value={group.name}>
                                            {group.description}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <Button view={"action"} size={"m"}
                                        onClick={() => {
                                            createAttempt(accessTokenRef.current, showAlert, taskId, id, {
                                                code: code,
                                                language: languageKey,
                                            });
                                        }}
                                >Отправить на проверку<Icon data={Play}/></Button>
                            </div>

                            <Editor className={classes.code}
                                    width={"max"}
                                    height={"400px"}
                                    theme={"light"}
                                    language={languageValue}
                                    value={code}
                                    onChange={e => setCode(e)}
                            />
                        </div>
                    </div>
                </div>
                <div className={classes.historys}>
                    <Text variant="header-1">
                        История
                    </Text>
                    {attempts.length>0 ? (attempts?.map(attempt => (
                        <div className={classes.history} onClick={async () => {
                            await getAttempt(accessTokenRef.current, showAlert, attempt.id);
                            setOpenModalAttempt(true);
                        }}>
                            <div className={classes.date}>
                                {formatDate(attempt.createdDateTime)}
                            </div>
                            <div className={classes.status}>
                                <Label theme={statusThemeMap[attempt.statusKey] || 'info'}>
                                    {attempt.status}
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
            </div>

            <Modal open={openModalAttempt} onClose={() => setOpenModalAttempt(false)}>
                <div className={classes.historyElem}>
                    <div className={classes.historyHeader}>
                        <Text variant="header-1">
                            Информация о попытке
                        </Text>
                    </div>
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
                    <Editor className={classes.codeModal}
                            width={"max"}
                            height={"300px"}
                            theme={"light"}
                            language={attempt.language}
                            value={attempt.code}
                    />
                    {attempt.inCase && attempt.outCase ? (
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
                    {attempt.result ? (
                        <div className={classes.inInfo}>
                            <TextArea minRows={3} readOnly={true}
                                      maxRows={6}
                                      value={attempt.result}
                                      note={"Актуальный результат"}/>
                        </div>
                    ) : null}

                    {attempt.reasonRejection ? (
                        <div className={classes.reasonRejection}>
                            <TextArea minRows={3} readOnly={true}
                                      maxRows={10}
                                      value={attempt.reasonRejection}
                                      note={"Причина отклонения"}/>
                        </div>
                    ) : null}
                    {attempt.downgradeReason ? (
                        <div className={classes.reasonRejection}>
                            <TextArea minRows={3} readOnly={true}
                                      maxRows={10}
                                      value={attempt.downgradeReason}
                                      note={"Причина понижения оценки"}/>
                        </div>
                    ) : null}
                </div>

            </Modal>
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    )
}