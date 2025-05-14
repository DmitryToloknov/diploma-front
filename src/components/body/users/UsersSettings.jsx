import classes from './UsersSettings.module.css'
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import CustomAlert from "../../blocks/alert/info/CustomAlert.jsx";
import {
    countUser,
    createUser,
    deleteUser,
    fetchGroups,
    fetchUserType, findUserById, getActualRoles, getFullRoles,
    getUsers, saveUser,
    updatePassword, updateRoles
} from "./UserSettingApi.jsx";
import {changeTitle} from "../../../utils/Title.jsx";
import {USER_UPDATE} from "../../../utils/Roles.js";
import {ArrowsRotateLeft, Plus} from '@gravity-ui/icons';
import {
    Button,
    Checkbox,
    Dialog,
    Icon,
    Loader,
    Pagination, PasswordInput,
    Select,
    Table,
    Text,
    TextInput,
    withTableActions,
    withTableCopy
} from "@gravity-ui/uikit";
import NoAccess from "../../../utils/Accses/NoAccess.jsx";
import NeedAuth from "../../../utils/Auth/NeedAuth.jsx";

export default function UsersSettings() {
    changeTitle("Пользователи")
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const [access, setAccess] = useState(null);

    const [pagination, setPagination] = React.useState({page: 1, pageSize: 20});
    const handleUpdate = (page, pageSize) => {
        setPagination((prevState) => ({...prevState, page, pageSize}));
    }

    //updateUser
    const dialogUpdateUser = 'UpdateUser';
    const [openDialogUpdateUser, setOpenDialogUpdateUser] = useState(false);
    const [loadingButtonUpdateUser, setLoadingButtonUpdateUser] = useState(false);
    const [updateUser, setUpdateUser] = useState({});

    const loadUserById = useCallback(async (id) => {
        const result = await findUserById(accessTokenRef.current, id);
        if (result.success) {
            console.log("dsdasds")
            setUpdateUser(result.data)
            console.log(updateUser)
        } else {
            showAlert('danger', 'Получение информации о пользователе', result.error);
        }
    }, []);

    const updUser = async () => {
        const result = await saveUser(accessTokenRef.current, updateUser, userId);
        if (result.success) {
            showAlert('success', 'Обновление пользователя.', result.data);
            loadGetUsers();
        } else {
            showAlert('danger', 'Обновление пользователя.', result.error);
            setLoadingButtonUpdateUser(false);
            return;
        }

        setLoadingButtonUpdateUser(false);
        setOpenDialogUpdateUser(false);
    };

    //updateRoles
    const dialogUpdateRoles = 'UpdateRoles';
    const [openDialogUpdateRoles, setOpenDialogUpdateRoles] = useState(false);
    const [loadingButtonUpdateRoles, setLoadingButtonUpdateRoles] = useState(false);
    const [fullRoles, setFullRoles] = useState([]);
    const [actualRoles, setActualRoles] = useState([]);


    const loadFullRoles = async () => {
        setLoadingButtonUpdateRoles(true);
        const result = await getFullRoles(accessTokenRef.current);
        if (result.success) {
            setFullRoles(result.data);
        } else {
            showAlert('danger', 'Получение ролей.', result.error);
        }

        setLoadingButtonUpdateRoles(false);
    };

    const loadActualRoles = async (id) => {
        const result = await getActualRoles(accessTokenRef.current, id);
        if (result.success) {
            setActualRoles(result.data)
        } else {
            showAlert('danger', 'Получение ролей пользователя.', result.error);
        }
    };

    const saveNewRoles = async () => {
        setLoadingButtonUpdateRoles(true);
        const result = await updateRoles(accessTokenRef.current, actualRoles, userId);
        if (result.success) {
            showAlert('success', 'Изменение ролей.', result.data);
        } else {
            showAlert('danger', 'Изменение ролей.', result.error);
        }
        setLoadingButtonUpdateRoles(false);
        setOpenDialogUpdateRoles(false);
    };

    //updatePassword
    const dialogUpdatePassword = 'UpdatePassword';
    const [openDialogUpdatePassword, setOpenDialogUpdatePassword] = useState(false);
    const [loadingButtonUpdatePassword, setLoadingButtonUpdatePassword] = useState(false);
    const [newPassword, setNewPassword] = useState({});

    const updatePasswordForUser = async () => {

        if( (newPassword.password.length > 0 || newPassword.password2.length > 0)){
            if((newPassword.password !== newPassword.password2)) {
                showAlert('danger', 'Изменение пароля.', 'Пароли должны быть равны');
                setLoadingButtonUpdatePassword(false);
                return;
            }
        } else {

            showAlert('danger', 'Изменение пароля.', 'Введите пароль');
            return
        }
        const result = await updatePassword(accessTokenRef.current, newPassword, userId);
        if (result.success) {
            showAlert('success', 'Изменение пароля.', result.data);
        } else {
            showAlert('danger', 'Изменение пароля.', result.error);
            setLoadingButtonUpdatePassword(false);
            return;
        }

        setLoadingButtonUpdatePassword(false);
        setOpenDialogUpdatePassword(false);
    };

    //createUser
    const dialogCreateUser = 'createUser';
    const [openDialogCreateUser, setOpenDialogCreateUser] = useState(false);
    const [loadingButtonCreateUser, setLoadingButtonCreateUser] = useState(false);
    const [userCreate, setUserCreate] = useState({});

    const create = async () => {
        console.log(userCreate);

        if( (userCreate.password.length > 0 || userCreate.password2.length > 0)){
            if((userCreate.password !== userCreate.password2)) {
                showAlert('danger', 'Создание пользователя.', 'Пароли должны быть равны');
                setLoadingButtonCreateUser(false);
                return;
            }
        } else {

            showAlert('danger', 'Создание пользователя.', 'Введите пароль');
            return
        }
        const result = await createUser(accessTokenRef.current, userCreate);
        if (result.success) {
            showAlert('success', 'Создание пользователя.', result.data);
            loadGetUsers();
        } else {
            showAlert('danger', 'Создание пользователя.', result.error);
            setLoadingButtonCreateUser(false);
            return;
        }

        setLoadingButtonCreateUser(false);
        setOpenDialogCreateUser(false);
    };

    //userDelete
    const dialogDeleteUser = 'userDelete';
    const [userId, setUserId] = useState(null);
    const [openDialogDeleteUser, setOpenDialogDeleteUser] = useState(false);
    const [loadingButtonDeleteUser, setLoadingButtonDeleteUser] = useState(false);
    const [deleteRequest, setDeleteRequest] = useState({});

    const deactivateUser = async () => {
        const result = await deleteUser(accessTokenRef.current, deleteRequest, userId);
        if (result.success) {
            showAlert('success', 'Деактивация пользователя.', result.data);
            loadGetUsers();
        } else {
            showAlert('danger', 'Деактивация пользователя.', result.error);
        }

        setLoadingButtonDeleteUser(false);
        setOpenDialogDeleteUser(false);
    };

    //Users
    const [users, setUsers] = useState([]);
    const CustomTable =  React.memo(withTableActions(Table));
    const memoizedUsers = useMemo(() => users, [users]);

    const loadGetUsers = async () => {
        setLoadingCountUser(true);
        const result = await getUsers(accessTokenRef.current, filter, pagination.page, pagination.pageSize);
        if (result.success) {
            setUsers(result.data);
        } else {
            showAlert('danger', 'Получение пользователей.', result.error);
        }

        setLoadingCountUser(false);
    };

    const columns = useMemo(() => [
        {id: 'name', name: 'Имя'},
        {id: 'surname', name: 'Фамилия'},
        {id: 'login', name: 'Логин'},
        {id: 'phone', name: 'Номер телефона'},
        {id: 'groupName', name: 'Группа'},
        {
            id: 'status',
            name: 'Статус',
            template: (item) => (item.status ? 'Активен' : 'Деактивирован'),
        },
    ], []);

    const onRowClick = useCallback((item) => {
        setUpdateUser({
            id: '',
            login: '',
            name: '',
            surname: '',
            phone: '',
            groupId: '',
            groupName: '',
            status: true,
            deletionReason: '',
        })
        loadUserById(item.id);
        setUserId(item.id);
        setOpenDialogUpdateUser(true);
    }, []);

    const getRowActions = useCallback((item) => {
        if (!item.status) return [];

        return [
            {
                text: 'Деактивировать',
                handler: () => {
                    setDeleteRequest({deletionReason: ''});
                    setUserId(item.id);
                    setOpenDialogDeleteUser(true);
                },
                theme: 'danger',
            },
            {
                text: 'Изменить пароль',
                handler: () => {
                    setNewPassword({ password: '', password2: '' });
                    setUserId(item.id);
                    setOpenDialogUpdatePassword(true);
                },
            },
            {
                text: 'Роли пользователя',
                handler: () => {
                    setUserId(item.id);
                    loadActualRoles(item.id);
                    setOpenDialogUpdateRoles(true);
                },
            },
        ];
    }, [setDeleteRequest, setUserId, setOpenDialogDeleteUser, setNewPassword, setOpenDialogUpdatePassword, loadActualRoles, setOpenDialogUpdateRoles]);


    //Filter
    const [filter, setFilter] = useState({
        userTypeIds: [],
        groupIds: [],
        name: '',
        onlyActiveUser: true
    });
    const [loadingCountUser, setLoadingCountUser] = useState(false);
    const [numberUser, setNumberUser] = useState(0);

    const loadCountUser = async () => {
        setLoadingCountUser(true);
        const result = await countUser(accessTokenRef.current, filter);
        if (result.success) {
            setNumberUser(result.data);
        } else {
            showAlert('danger', 'Получение колическтва пользователей.', result.error);
        }

        setLoadingCountUser(false);
    };
    //UserType
    const [userTypes, setUserTypes] = useState([]);
    const [loadingUserTypes, setLoadingUsersType] = useState(false);

    const loadUserType = async () => {
        setLoadingUsersType(true);
        const result = await fetchUserType(accessTokenRef.current);
        if (result.success) {
            setUserTypes(result.data);
        } else {
            showAlert('danger', 'Получение типов пользователей.', result.error);
        }

        setLoadingUsersType(false);
    };

    //Groups
    const [Groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    const loadGroups = async () => {
        setLoadingGroups(true);
        const result = await fetchGroups(accessTokenRef.current);
        if (result.success) {
            setGroups(result.data);
        } else {
            showAlert('danger', 'Получение групп.', result.error);
        }

        setLoadingGroups(false);
    };

    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            if (!isLoaded) {
                loadUserType();
                loadGroups();
                loadCountUser();
                loadGetUsers();
                loadFullRoles();
                setAccess(checkRoles([USER_UPDATE]));
                setIsLoaded(true);
            }
        }
    }, [accessToken]);

    useEffect(() => {
        loadGetUsers();
    }, [pagination]);

    if(isWasRefreshed && !isAuth) {
        return (<NeedAuth />)
    }

    if (isWasRefreshed && access!=null && !access) {
        return <NoAccess/>
    }

    if (!isLoaded) {
        return <div className={classes.loader}>
            <Loader/>
        </div>
    }


    return (
        <div className={classes.users}>
            <div className={classes.header}>
                <div>
                    <Text variant="display-1">Пользователи</Text>
                </div>
                <Button view="action" size="l" onClick={() => {
                    setOpenDialogCreateUser(true);
                    setUserCreate({
                        name: '',
                        surname: '',
                        login: '',
                        password: '',
                        password2: '',
                        phone: '',
                        types: [],
                        groupId: ''
                    })
                }}>
                    <Icon data={Plus}/>Создать пользователя
                </Button>
            </div>

            <div className={classes.setting}>
                <div className={classes.filters}>
                    <Select
                        className={classes.filter}
                        width={'max'}
                        label={"Группа:"}
                        size={"m"}
                        hasClear={true}
                        filterable={true}
                        multiple={true}
                        onUpdate={(s) => setFilter((filter) => ({...filter, groupIds: s}))}
                    >
                        {Groups?.map(group => (
                            <Select.Option key={group.id} value={group.id}>
                                {group.name}
                            </Select.Option>
                        ))}
                    </Select><br/>
                    <Select
                        className={classes.filter}
                        width={'max'}
                        label={"Тип пользователя:"}
                        size={"m"}
                        hasClear={true}
                        filterable={true}
                        multiple={true}
                        onUpdate={(s) => setFilter((filter) => ({...filter, userTypeIds: s}))}
                    >
                        {userTypes?.map(type => (
                            <Select.Option key={type.id} value={type.id}>
                                {type.name}
                            </Select.Option>
                        ))}
                    </Select><br/>
                    <TextInput label={"Имя или фамилия:"}
                               placeholder="Иванов"
                               className={classes.filter}
                               size={"m"}
                               hasClear={true}
                               onChange={(s) => setFilter((filter) => ({...filter, name: s.target.value}))}
                    />
                    <div className={classes.filterCheckbox}>
                        <Checkbox size="m" checked={filter.onlyActiveUser} onUpdate={(s)=>setFilter((filter) => ({...filter, onlyActiveUser: s}))}>Только активные пользователи</Checkbox>
                    </div>
                    <Button className={classes.buttonForFilters} view="action" size="l"
                            onClick={() => {
                                loadCountUser();
                                loadGetUsers();
                            }}
                    >
                        <Icon data={ArrowsRotateLeft}/>Применить
                    </Button>
                </div>
            </div>
            <CustomTable
                className={classes.usersTable}
                data={memoizedUsers}
                columns={columns}
                width={"max"}
                getRowActions={getRowActions}
                onRowClick={onRowClick}
            />
                <Pagination className={classes.pagination}page={pagination.page} pageSize={pagination.pageSize} total={numberUser} onUpdate={handleUpdate}/>
            <CustomAlert {...alertData} onClose={closeAlert}/>

            <Dialog
                onClose={() => setOpenDialogDeleteUser(false)}
                open={openDialogDeleteUser}
                aria-labelledby={dialogDeleteUser}
            >
                <Dialog.Header caption="Деактивация пользователя"/>
                <Dialog.Body>
                    <div className={classes.groupCreateBody}>
                        <TextInput
                            label={"Причина:"}
                            placeholder="Отчислен"
                            size={"l"}
                            hasClear={true}
                            value={deleteRequest.deletionReason}
                            onChange={(e) => {
                                setDeleteRequest((prevGroup) => ({
                                    ...prevGroup,
                                    deletionReason: e.target.value
                                }));
                            }}
                        />
                    </div>
                </Dialog.Body>
                <Dialog.Footer
                    loading={loadingButtonDeleteUser}
                    onClickButtonCancel={() => setOpenDialogDeleteUser(false)}
                    onClickButtonApply={() => {
                        setLoadingButtonDeleteUser(true);
                        deactivateUser();
                    }}
                    textButtonApply="Деактивировать"
                    textButtonCancel="Отмена"
                />
            </Dialog>
            <Dialog
                onClose={() => setOpenDialogCreateUser(false)}
                open={openDialogCreateUser}
                aria-labelledby={dialogCreateUser}
            >
                <Dialog.Header caption="Создание пользователя"/>
                <Dialog.Body>
                    <div className={classes.dialogCreateUser}>
                        <TextInput
                            className={classes.filter}
                            label={"Имя:"}
                            placeholder="Иван"
                            size={"l"}
                            hasClear={true}
                            value={userCreate.name}
                            onChange={(e) => {
                                setUserCreate((prevGroup) => ({
                                    ...prevGroup,
                                    name: e.target.value
                                }));
                            }}
                        />
                        <TextInput
                            className={classes.filter}
                            label={"Фамилия:"}
                            placeholder="Иванов"
                            size={"l"}
                            hasClear={true}
                            value={userCreate.surname}
                            onChange={(e) => {
                                setUserCreate((prevGroup) => ({
                                    ...prevGroup,
                                    surname: e.target.value
                                }));
                            }}
                        />
                        <TextInput
                            className={classes.filter}
                            label={"Номер телефона:"}
                            placeholder={"+79284758510"}
                            size={"l"}
                            hasClear={true}
                            type={"tel"}
                            value={userCreate.phone}
                            onChange={(e) => {
                                setUserCreate((prevGroup) => ({
                                    ...prevGroup,
                                    phone: e.target.value
                                }));
                            }}
                        />
                        <TextInput
                            className={classes.filter}
                            label={"Логин:"}
                            placeholder="Ivanov123"
                            size={"l"}
                            hasClear={true}
                            value={userCreate.login}
                            onChange={(e) => {
                                setUserCreate((prevGroup) => ({
                                    ...prevGroup,
                                    login: e.target.value
                                }));
                            }}
                        />
                        <PasswordInput
                            className={classes.filter}
                            label={"Пароль:"}
                            size={"l"}
                            hasClear={true}
                            value={userCreate.password}
                            onChange={(e) => {
                                setUserCreate((prevGroup) => ({
                                    ...prevGroup,
                                    password: e.target.value
                                }));
                            }}
                        />
                        <PasswordInput
                            className={classes.filter}
                            label={"Повторите пароль:"}
                            size={"l"}
                            hasClear={true}
                            value={userCreate.password2}
                            onChange={(e) => {
                                setUserCreate((prevGroup) => ({
                                    ...prevGroup,
                                    password2: e.target.value
                                }));
                            }}
                        />
                        <Select
                            className={classes.filter}
                            width={'max'}
                            label={"Группа:"}
                            size={"l"}
                            hasClear={true}
                            filterable={true}
                            onUpdate={(s) => setUserCreate((prevGroup) => ({...prevGroup, groupId: s[0]}))}
                        >
                            {Groups?.map(group => (
                                <Select.Option key={group.id} value={group.id}>
                                    {group.name}
                                </Select.Option>
                            ))}
                        </Select><br/>
                        <Select
                            className={classes.filter}
                            width={'max'}
                            label={"Тип пользователя:"}
                            size={"l"}
                            hasClear={true}
                            filterable={true}
                            multiple={true}
                            onUpdate={(s) => setUserCreate((prevGroup) => ({...prevGroup, type: s}))}
                        >
                            {userTypes?.map(type => (
                                <Select.Option key={type.id} value={type.id}>
                                    {type.name}
                                </Select.Option>
                            ))}
                        </Select><br/>
                    </div>
                </Dialog.Body>
                <Dialog.Footer
                    loading={loadingButtonCreateUser}
                    onClickButtonCancel={() => setOpenDialogCreateUser(false)}
                    onClickButtonApply={() => {
                        setLoadingButtonCreateUser(true);
                        create()
                    }}
                    textButtonApply="Создать"
                    textButtonCancel="Отмена"
                />
            </Dialog>
            <Dialog
                onClose={() => setOpenDialogUpdatePassword(false)}
                open={openDialogUpdatePassword}
                aria-labelledby={dialogUpdatePassword}
            >
                <Dialog.Header caption="Изменение пароля"/>
                <Dialog.Body>
                    <div className={classes.dialogCreateUser}>
                        <PasswordInput
                            className={classes.filter}
                            label={"Пароль:"}
                            size={"l"}
                            hasClear={true}
                            value={newPassword.password}
                            onChange={(e) => {
                                setNewPassword((prevGroup) => ({
                                    ...prevGroup,
                                    password: e.target.value
                                }));
                            }}
                        />
                        <PasswordInput
                            className={classes.filter}
                            label={"Повторите пароль:"}
                            size={"l"}
                            hasClear={true}
                            value={newPassword.password2}
                            onChange={(e) => {
                                setNewPassword((prevGroup) => ({
                                    ...prevGroup,
                                    password2: e.target.value
                                }));
                            }}
                        />
                    </div>
                </Dialog.Body>
                <Dialog.Footer
                    loading={loadingButtonUpdatePassword}
                    onClickButtonCancel={() => setOpenDialogUpdatePassword(false)}
                    onClickButtonApply={() => {
                        setLoadingButtonUpdatePassword(true);
                        updatePasswordForUser();
                    }}
                    textButtonApply="Обновить"
                    textButtonCancel="Отмена"
                />
            </Dialog>
            <Dialog
                onClose={() => setOpenDialogUpdateRoles(false)}
                open={openDialogUpdateRoles}
                aria-labelledby={dialogUpdateRoles}
            >
                <Dialog.Header caption="Изменение ролей пользователя"/>
                <Dialog.Body>
                    <div className={classes.dialogCreateUser}>
                        <Select
                            width={'max'}
                            label={"Роли:"}
                            size={"l"}
                            hasClear={true}
                            filterable={true}
                            multiple={true}
                            value={actualRoles}
                            onUpdate={(selectedRoles) => {
                                setActualRoles(selectedRoles);   // Обновляем actualRoles
                            }}
                        >
                            {fullRoles?.map(role => (
                                <Select.Option key={role.name} value={role.name}>
                                    {role.description}
                                </Select.Option>
                            ))}
                        </Select><br/>

                    </div>
                </Dialog.Body>
                <Dialog.Footer
                    loading={loadingButtonUpdateRoles}
                    onClickButtonCancel={() => setOpenDialogUpdateRoles(false)}
                    onClickButtonApply={() => {
                        setLoadingButtonUpdateRoles(true);
                        saveNewRoles()
                        // console.log(actualRoles);
                    }}
                    textButtonApply="Обновить"
                    textButtonCancel="Отмена"
                />
            </Dialog>

            <Dialog
                onClose={() => setOpenDialogUpdateUser(false)}
                open={openDialogUpdateUser}
                aria-labelledby={dialogUpdateUser}
            >
                <Dialog.Header caption="Изменние пользователя"/>
                <Dialog.Body>
                    <div className={classes.dialogCreateUser}>
                        <TextInput
                            className={classes.filter}
                            label={"Имя:"}
                            placeholder="Иван"
                            size={"l"}
                            hasClear={true}
                            value={updateUser.name}
                            onChange={(e) => {
                                setUpdateUser((prevGroup) => ({
                                    ...prevGroup,
                                    name: e.target.value
                                }));
                            }}
                            disabled={!updateUser.status}
                        />
                        <TextInput
                            className={classes.filter}
                            label={"Фамилия:"}
                            placeholder="Иванов"
                            size={"l"}
                            hasClear={true}
                            value={updateUser.surname}
                            onChange={(e) => {
                                setUpdateUser((prevGroup) => ({
                                    ...prevGroup,
                                    surname: e.target.value
                                }));
                            }}
                            disabled={!updateUser.status}
                        />
                        <TextInput
                            className={classes.filter}
                            label={"Номер телефона:"}
                            placeholder={"+79284758510"}
                            size={"l"}
                            hasClear={true}
                            type={"tel"}
                            value={updateUser.phone}
                            onChange={(e) => {
                                setUpdateUser((prevGroup) => ({
                                    ...prevGroup,
                                    phone: e.target.value
                                }));
                            }}
                            disabled={!updateUser.status}
                        />
                        <TextInput
                            className={classes.filter}
                            label={"Логин:"}
                            placeholder="Ivanov123"
                            size={"l"}
                            hasClear={true}
                            value={updateUser.login}
                            disabled={true}
                        />
                        <Select
                            className={classes.filter}
                            width={'max'}
                            label={"Группа:"}
                            size={"l"}
                            hasClear={true}
                            filterable={true}
                            disabled={!updateUser.status}
                            value={[updateUser.groupId]}
                            onUpdate={(s) => setUpdateUser((prevGroup) => ({...prevGroup, groupId: s[0]}))}
                        >
                            {Groups?.map(group => (
                                <Select.Option key={group.id} value={group.id}>
                                    {group.name}
                                </Select.Option>
                            ))}
                        </Select><br/>
                        <Select
                            className={classes.filter}
                            width={'max'}
                            label={"Тип пользователя:"}
                            size={"l"}
                            hasClear={true}
                            filterable={true}
                            multiple={true}
                            disabled={!updateUser.status}
                            value={updateUser.types}
                            onUpdate={(s) => setUpdateUser((prevGroup) => ({...prevGroup, types: s}))}
                        >
                            {userTypes?.map(type => (
                                <Select.Option key={type.id} value={type.id}>
                                    {type.name}
                                </Select.Option>
                            ))}
                        </Select><br/>
                        {!updateUser.status && (
                            <Text variant="body-1">Причина деактивации: {updateUser.deletionReason}</Text>
                        )}

                    </div>
                </Dialog.Body>
                <Dialog.Footer
                    loading={loadingButtonUpdateUser}

                    onClickButtonCancel={() => setOpenDialogUpdateUser(false)}
                    onClickButtonApply={() => {
                        setLoadingButtonUpdateUser(true);
                        updUser()
                    }}
                    propsButtonApply={{
                        disabled: !updateUser.status,
                    }}
                    textButtonApply="Обновить"
                    textButtonCancel="Отмена"
                />
            </Dialog>
        </div>
    )
}