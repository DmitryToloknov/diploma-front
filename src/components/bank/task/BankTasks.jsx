import classes from './BankTasks.module.css'
import {changeTitle} from "../../../utils/Title.jsx";
import {useAuth} from "../../auth-context/AuthProvider.jsx";
import {useCustomAlert} from "../../blocks/alert/info/useCustomAlert.js";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {COURSE_UPDATE} from "../../../utils/Roles.js";
import NeedAuth from "../../../utils/Auth/NeedAuth.jsx";
import NoAccess from "../../../utils/Accses/NoAccess.jsx";
import {Button, Icon, Loader, Pagination, Select, Table, Text, TextInput, withTableActions} from "@gravity-ui/uikit";
import CustomAlert from "../../blocks/alert/info/CustomAlert.jsx";
import {ArrowsRotateLeft, Plus} from "@gravity-ui/icons";
import {useCreateTask} from "./hook/CreateTask.jsx";
import {useGetSkills} from "./hook/GetSkills.jsx";
import {useGetCreators} from "./hook/GetCreators.jsx";
import {useTotalTask} from "./hook/GetTotalTask.jsx";
import {useGetTasks} from "./hook/GetTasks.jsx";
import {useNavigate} from "react-router-dom";
import {TASK} from "../../../utils/constant.js";

export default function BankTasks() {
    changeTitle("Банк задач")
    const {accessToken, checkRoles, isWasRefreshed, isAuth} = useAuth();
    const {alertData, showAlert, closeAlert} = useCustomAlert();
    const [isLoaded, setIsLoaded] = useState(false);
    const accessTokenRef = useRef(accessToken);
    const [access, setAccess] = useState(null);
    const navigate = useNavigate();

    const {getSkills, skills} = useGetSkills();
    const {createTask, isLoading } = useCreateTask();
    const {getCreators, creators} = useGetCreators();
    const {getTotalTask, totalNumber} = useTotalTask();
    const {getTask, tasks} = useGetTasks();
    const pageSize = 10;
    const [page, setPage] = useState(1);

    const [skill, setSkill] = useState([]);
    const [name, setName] = useState('');
    const [authors, setAuthors] = useState([]);
    const [filter, setFilter] = useState({});

    const CustomTable =  React.memo(Table);
    const memoizedTasks = useMemo(() => tasks, [tasks]);

    const columns = useMemo(() => [
        {id: 'id', name: 'Id', template: (item) => "#"+item.id,},
        {id: 'name', name: 'Название задачи'},
        {id: 'estimation', name: 'Оценка'},
    ], []);

    const onRowClick = useCallback((item) => {
        navigate(TASK + "/" + item.id);
    }, []);

    useEffect(() => {
        if (accessToken !== null) {
            accessTokenRef.current = accessToken;
            if (!isLoaded) {
                getTask(accessTokenRef.current, showAlert, filter, page, pageSize);
                getTotalTask(accessTokenRef.current, showAlert, filter);
                getSkills(accessTokenRef.current, showAlert);
                getCreators(accessTokenRef.current, showAlert);
                setAccess(checkRoles([COURSE_UPDATE]));
                setIsLoaded(true);
            }
        }
    }, [accessToken]);

    useEffect(() => {
        if (isLoaded) {
            getTask(accessTokenRef.current, showAlert, filter, page, pageSize);
        }
    }, [page, filter]);

    useEffect(() => {
        if (isLoaded) {
            getTotalTask(accessTokenRef.current, showAlert, filter)
        }
    }, [filter]);



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


    return(
        <div>
            <div>
                <Text variant="display-1">Банк задач</Text>
            </div>

            <div className={classes.settings}>
                <div className={classes.filters}>
                    <TextInput label={"Название:"}
                               className={classes.filter_input}
                               size={"m"}
                               hasClear={true}
                               onUpdate={(s)=>setName(s)}
                    />
                    <Select
                        className={classes.filter}
                        width={'max'}
                        label={"Скилы:"}
                        size={"m"}
                        hasClear={true}
                        filterable={true}
                        multiple={true}
                        onUpdate={(i) => setSkill(i)}
                    >
                        {skills?.map(skill => (
                            <Select.Option key={skill.id} value={skill.id}>
                                {skill.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Select
                        className={classes.filter}
                        width={'max'}
                        label={"Авторы:"}
                        size={"m"}
                        hasClear={true}
                        filterable={true}
                        multiple={true}
                        onUpdate={(i) => setAuthors(i)}
                    >
                        {creators?.map(creator => (
                            <Select.Option key={creator.id} value={creator.id}>
                                {creator.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <Button view="action" size="m" className={classes.searchTask}
                    onClick={() => {
                        setFilter( {
                            name: name,
                            creators: authors,
                            skills: skill,
                        });
                        setPage(1);
                    }}
                    > Найти <Icon data={ArrowsRotateLeft}/></Button>
                </div>
                    <div className={classes.buttonCreateTask}>
                        <Button
                            view="action"
                            size="m"
                            loading={isLoading}
                            onClick={() => createTask(accessTokenRef.current)}
                        >Создать задачу <Icon data={Plus}/></Button>
                    </div>
            </div>
                <div className={classes.table}>
                    <CustomTable
                        className={classes.usersTable}
                        data={memoizedTasks}
                        columns={columns}
                        width={"max"}
                        onRowClick={onRowClick}
                    />
                </div>
            <Pagination className={classes.pagination} page={page} pageSize={pageSize} total={totalNumber} onUpdate={(page) => setPage(page)} />
            <CustomAlert {...alertData} onClose={closeAlert}/>
        </div>
    )
}