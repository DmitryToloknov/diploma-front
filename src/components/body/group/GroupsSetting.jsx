import classes from './GroupsSetting.module.css'
import {GROUP_UPDATE, USER_UPDATE} from "../../../utils/Roles.js";
import {SERVER_URL} from "../../../utils/constant.js";
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import CustomAlert from "../../blocks/alert/info/CustomAlert.jsx";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {DefaultButton} from "../../blocks/button/Button.jsx";
import {
    Button,
    Dialog,
    Icon,
    Loader,
    Select,
    Table,
    Text,
    TextInput,
    withTableActions,
    withTableCopy
} from "@gravity-ui/uikit";
import {DatePicker} from "@gravity-ui/date-components";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import {NumberInput} from "@gravity-ui/markdown-editor";
import {changeTitle} from "../../../utils/Title.jsx";
import {ArrowsRotateLeft, Check, Plus} from '@gravity-ui/icons';
import NeedAuth from "../../../utils/Auth/NeedAuth.jsx";
import NoAccess from "../../../utils/Accses/NoAccess.jsx";
export default function GroupsSetting() {
    changeTitle("Группы")
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const accessTokenRef = useRef(accessToken);
    const [openDialogCreateGroup, setOpenDialogCreateGroup] = useState(false);
    const [loadingButtonCreateGroup, setLoadingButtonCreateGroup] = useState(false);
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const dialogTitleId = 'app-confirmation-dialog-title';
    const [curators, setCurators] = useState(null);
    const [access, setAccess] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const CustomTable = useMemo(() => React.memo(withTableCopy(withTableActions(Table))), []);
    const [isLoadingGroup, setIsLoadingGroup] = useState(true);
    const [groups, setGroups] = useState([]);

    const columns = useMemo(() => [
        {id: 'name', meta: {copy: true}, name: 'Название группы'},
        {id: 'shortName', meta: {copy: true}, name: 'Краткое название'},
        {id: 'curatorName', meta: {copy: true}, name: 'Куратор'},
        {id: 'creatorNames', meta: {copy: true}, name: 'Создатель'},
        {id: 'year', meta: {copy: true}, name: 'Год поступления', align: 'center'},
        {id: 'countCourse', meta: {copy: true}, name: 'Длительность обучения', align: 'center'},
    ], []);

    const onRowClick = useCallback((item) => {
        getCurators();
        setUpdateGroup({
            id: item.id,
            name: item.name,
            shortName: item.shortName,
            year: item.year,
            curatorId: item.curatorId,
            countCourse: item.countCourse,
        })
        setOpenDialogUpdateGroup(true)
    }, []);

    const getRowActions = (item) => {
        return [
            {
                text: 'Удалить',
                handler: () => {
                    deleteGroup(item.id)
                },
                theme: 'danger',
            },
        ];
    };

    const dialogUpdateGroup = 'UpdateGroup';
    const [openDialogUpdateGroup, setOpenDialogUpdateGroup] = useState(false);
    const [loadingButtonUpdateGroup, setLoadingButtonUpdateGroup] = useState(false);
    const [updateGroup, setUpdateGroup] = useState({});

    const fetchGroup = async () => {
        try {
            const response = await fetch(`${SERVER_URL}group/setting`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessTokenRef.current}`,
                }
            });
            if (response.ok) {
                setGroups(await response.json());
            } else {
                const errors = await response.text();
                showAlert('danger', 'Получение групп', errors);
            }
        } catch (error) {
            showAlert('danger', 'Получение групп', 'Ошибка сети. Обратитесь к администратору.');
        } finally {
            setIsLoadingGroup(false);
        }
    };

    const deleteGroup = async (id) => {
        try {
            const response = await fetch(`${SERVER_URL}group/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessTokenRef.current}`,
                }
            });
            if (response.ok) {
                fetchGroup();
                showAlert('success', 'Удаление группы', 'Удаление произошло успешно.');
            } else {
                const errors = await response.json();
                showAlert('danger', 'Удаление группы', errors);
            }
        } catch (error) {
            showAlert('danger', 'Удаление группы', 'Ошибка сети. Обратитесь к администратору.');
        } finally {
            setIsLoadingGroup(false);
        }
    };

    const saveGroup = async () => {

        try {

            const response = await fetch(`${SERVER_URL}group/${updateGroup.id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessTokenRef.current}`,
                },
                body: JSON.stringify(updateGroup)
            });
            if (response.ok) {
                setOpenDialogUpdateGroup(false);
                fetchGroup();
                showAlert("success", "Обновление группы", "Группа успешно обновлена.");
            } else if (response.status === 400) {
                const error = await response.text();
                showAlert("danger", "Обновление группы", error);
            } else if (response.status === 403) {
                showAlert("danger", "Обновление группы", "Для создания группы нужны права.");
            } else if (response.status === 401) {
                showAlert("danger", "Обновление группы", "Ошибка авторизации");
            }
        } catch (error) {
            showAlert("danger", "Обновление группы", "Не удалось выполнить создание группы.");
        } finally {
            setLoadingButtonUpdateGroup(false);
        }
        // setOpenDialogCreateGroup(false);
    };

    // Состояние для формы
    const [groupName, setGroupName] = useState("");
    const [shortName, setShortName] = useState("");
    const [year, setYear] = useState();
    const [curator, setCurator] = useState(null);
    const [countCourse, setCountCourse] = useState(1);

    // Ошибки
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};

        // Проверка названия группы
        if (!/^[а-яА-ЯёЁa-zA-Z\s]{2,100}$/.test(groupName) || groupName == null) {
            newErrors.groupName = "Только буквы и пробелы (2-100 символов)";
        }

        // Проверка короткого названия
        if (!/^[а-яА-ЯёЁa-zA-Z0-9\s]{2,15}$/.test(shortName) || shortName == null) {
            newErrors.shortName = "2-15 символов. Может содержать буквы, цифры или пробелы";
        }

        // Проверка года
        if (year == null) {
            newErrors.year = "invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const createGroup = async () => {
        if (!validateForm()) {
            setLoadingButtonCreateGroup(false);
            return
        }
        try {
            const groupRequest = {
                name: groupName,
                shortName: shortName,
                year: year,
                curatorId: curator,
                countCourse: countCourse,
            };
            const response = await fetch(`${SERVER_URL}group`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessTokenRef.current}`,
                },
                body: JSON.stringify(groupRequest)
            });
            if (response.ok) {
                setOpenDialogCreateGroup(false);
                fetchGroup();
                showAlert("success", "Создание группы", "Группа успешно создана.");
            } else if (response.status === 400) {
                const error = await response.text();
                showAlert("danger", "Ошибка", error);
            } else if (response.status === 403) {
                showAlert("danger", "Ошибка", "Для создания группы нужны права.");
            } else if (response.status === 401) {
                showAlert("danger", "Ошибка", "Ошибка авторизации");
            }
        } catch (error) {
            showAlert("danger", "Ошибка", "Не удалось выполнить создание группы.");
        } finally {
            setLoadingButtonCreateGroup(false);
        }
        // setOpenDialogCreateGroup(false);
    };

    const getCurators = async () => {
        try {
            const response = await fetch(`${SERVER_URL}user/curators`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenRef.current}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCurators(data);
            } else if (response.status === 400) {
                showAlert("danger", "Ошибка", "Не удалось выполнить получение кураторов");
            } else if (response.status === 403) {
                showAlert("danger", "Ошибка", "Для получения кураторов нужны права на создание(обновление) группы!");
            } else if (response.status === 401) {
                showAlert("danger", "Ошибка", "Ошибка авторизации");
            }
        } catch (error) {
            showAlert("danger", "Ошибка", "Не удалось выполнить получение кураторов");
        }
    };
    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            if (!isLoaded) {
                fetchGroup();
                setAccess(checkRoles([GROUP_UPDATE]));
                setIsLoaded(true)
            }
        }
    }, [accessToken]);

    if(isWasRefreshed && !isAuth) {
        return (<NeedAuth />)
    }

    if (isWasRefreshed && access!= null && !access) {
        return <NoAccess/>
    }

    if (!isLoaded) {
        return <div className={classes.loader}>
            <Loader/>
        </div>
    }
    return (
        <>
                <div className={classes.groups}>
                    <div className={classes.admin}>
                        <div >
                            <Text variant="display-1">Группы</Text>
                        </div>
                        <div className={classes.createGroup}>
                            <Button
                                onClick={() => {
                                    getCurators();
                                    setYear(null)
                                    setShortName(null)
                                    setCurator(null)
                                    setGroupName(null)
                                    setErrors({});
                                    setOpenDialogCreateGroup(true)
                                }
                                }
                                view="action"
                                size={"l"}
                                width={"max"}
                                > <Icon data={Plus}/>Создать группу</Button>
                        </div>

                    </div>
                    {isLoadingGroup ? <Loader className={classes.loader} size="l"/> : (
                        <CustomTable
                            className={classes.groupsTable}
                            data={groups}
                            columns={columns}
                            width={"max"}
                            getRowActions={getRowActions}
                            onRowClick={onRowClick}
                        />
                    )}

                    <Dialog
                        onClose={() => setOpenDialogUpdateGroup(false)}
                        open={openDialogUpdateGroup}
                        aria-labelledby={dialogUpdateGroup}
                    >
                        <Dialog.Header caption="Обновление группы"/>
                        <Dialog.Body>
                            <div className={classes.groupCreateBody}>
                                <TextInput
                                    label={"Название:"}
                                    placeholder="Информатика и вычислительная техника"
                                    size={"l"}
                                    hasClear={true}
                                    value={updateGroup.name}
                                    onChange={(e) => {
                                        setUpdateGroup((prevGroup) => ({
                                            ...prevGroup,
                                            name: e.target.value
                                        }));
                                    }}
                                />
                                <TextInput label={"Короткое название:"}
                                           placeholder="ИВТ"
                                           className={classes.input}
                                           size={"l"}
                                           hasClear={true}
                                           value={updateGroup.shortName}
                                           onChange={(e) => {
                                               setUpdateGroup((prevGroup) => ({
                                                   ...prevGroup,
                                                   shortName: e.target.value
                                               }));
                                               console.log(updateGroup)
                                           }}

                                />
                                <Select
                                    className={classes.date}
                                    label={"Куратор:"}
                                    placeholder={"Иван Иванов"}
                                    size={"l"}
                                    hasClear={true}
                                    filterable={true}
                                    value={[updateGroup.curatorId]}
                                    onUpdate={(s) => setUpdateGroup((prevGroup) => ({
                                        ...prevGroup,
                                        curatorId: s[0]
                                    }))}
                                >
                                    {curators?.map(curator => (
                                        <Select.Option key={curator.id} value={curator.id}>
                                            {curator.userName}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <NumberInput
                                    className={classes.input}
                                    label={"Длительность обучения:"}
                                    placeholder="6"
                                    size={"l"}
                                    value={updateGroup.countCourse}
                                    onUpdate={(value) => {
                                        setUpdateGroup((prevGroup) => ({
                                            ...prevGroup,
                                            countCourse: Number(value)
                                        }));
                                    }}
                                    min={1}
                                    max={8}
                                    endContent={<span className={classes.unit}>год(а) </span>}
                                />
                            </div>
                        </Dialog.Body>
                        <Dialog.Footer
                            loading={loadingButtonUpdateGroup}
                            onClickButtonCancel={() => setOpenDialogUpdateGroup(false)}
                            onClickButtonApply={() => {
                                setLoadingButtonUpdateGroup(true);
                                saveGroup()
                            }}
                            textButtonApply="Обновить"
                            textButtonCancel="Отмена"
                        />
                    </Dialog>
                    <Dialog
                        onClose={() => setOpenDialogCreateGroup(false)}
                        open={openDialogCreateGroup}
                        aria-labelledby={dialogTitleId}
                    >
                        <Dialog.Header caption="Создание группы"/>
                        <Dialog.Body>
                            <div className={classes.groupCreateBody}>
                                <TextInput
                                    label={"Название:"}
                                    placeholder="Информатика и вычислительная техника"
                                    size={"l"}
                                    hasClear={true}
                                    value={groupName}
                                    onChange={(e) => {
                                        setGroupName(e.target.value);
                                        setErrors((prevErrors) => ({...prevErrors, groupName: null})); // Сброс ошибки
                                    }}
                                    error={errors.groupName}/>
                                <TextInput label={"Короткое название:"}
                                           placeholder="ИВТ"
                                           className={classes.input}
                                           size={"l"}
                                           hasClear={true}
                                           value={shortName}
                                           onChange={(e) => {
                                               setShortName(e.target.value);
                                               setErrors((prevErrors) => ({...prevErrors, shortName: null})); // Сброс ошибки
                                           }}
                                           error={errors.shortName}
                                />
                                <DatePicker
                                    label={"Год поступления:"}
                                    placeholder={String(new Date().getFullYear())}
                                    className={classes.date}
                                    size="l"
                                    format={"YYYY"}
                                    hasClear={true}
                                    onUpdate={(e) => {
                                        if (e != null) {
                                            const year = new Date(e).getFullYear();
                                            setYear(year);
                                        } else {
                                            setYear(e);
                                        }

                                        setErrors((prevErrors) => ({...prevErrors, year: "normal"}));
                                    }}
                                    validationState={errors.year}
                                />
                                <Select
                                    className={classes.date}
                                    label={"Куратор:"}
                                    placeholder={"Иван Иванов"}
                                    size={"l"}
                                    hasClear={true}
                                    filterable={true}
                                    onUpdate={(s) => setCurator(s[0])}>
                                    {curators?.map(curator => (
                                        <Select.Option key={curator.id} value={curator.id}>
                                            {curator.userName}
                                        </Select.Option>
                                    ))}
                                </Select>
                                <NumberInput
                                    className={classes.input}
                                    label={"Длительность обучения:"}
                                    placeholder="6"
                                    size={"l"}
                                    value={countCourse}
                                    onUpdate={(value) => setCountCourse(Number(value))}
                                    min={1}
                                    max={8}
                                    endContent={<span className={classes.unit}>год(а) </span>}
                                />
                            </div>
                        </Dialog.Body>
                        <Dialog.Footer
                            loading={loadingButtonCreateGroup}
                            onClickButtonCancel={() => setOpenDialogCreateGroup(false)}
                            onClickButtonApply={() => {
                                setLoadingButtonCreateGroup(true);
                                createGroup();
                            }}
                            textButtonApply="Создать"
                            textButtonCancel="Отмена"
                        />
                    </Dialog>
                    <CustomAlert {...alertData} onClose={closeAlert}/>
                </div>
        </>
    )
}