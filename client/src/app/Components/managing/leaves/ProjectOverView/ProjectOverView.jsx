import React, { useEffect, useState } from "react";
import { projectOverviewStyles } from "./style";
import useGetUserInfo from "../../../../../hooks/user";
import Loading from "../../../loading/Loading";
import { useGetStatusOfEmployeesMutation, useGetUserProjectsMutation } from "../../../../../store/api/remote.api";
import { useDispatch } from "react-redux";
import { TableVirtuoso } from "react-virtuoso";
import ProjectListHeader from "../../projects/ProjectListHeader";
import LoadingProjectsSkeleton from "../../../loading/LoadingProjectsSkeleton";
import dayjs from "dayjs";
import {useNavigate} from "react-router";
import useGetStateFromStore from "../../../../../hooks/manage/getStateFromStore";
import TaskItem from "../../../dailylog/TaskItem";
import {DAILY_HOURS_VALUE} from "../../../../../constants/constants";
import {hideDailyTask} from "../../../../../store/reducers/task.reducer";
import useFetchDailyLog from "../../../../../services/fetchers/dailyLog.fetch.service";

function ProjectOverView() {

    const navigate = useNavigate();
    const classes = projectOverviewStyles();
    const { user, profile } = useGetUserInfo();
    const dispatch = useDispatch();
    const [getStatusOfEmployees] = useGetStatusOfEmployeesMutation();
    const [getProjects] = useGetUserProjectsMutation();
    const [projects,setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [employeeStatuses, setEmployeeStatuses] = useState([]);
    const generalTasks = useGetStateFromStore("task", "userGeneralTasks");
    const [history, setHistory] = useState(dayjs(new Date()));
    const hourDivision = useGetStateFromStore("task", "dailyLogDevisions");
    const { isLoading: loadingTasks } = useFetchDailyLog(history);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEmployeeData() {
            if (user?.email) {
                try {
                    const response = await getStatusOfEmployees({ email: user?.email });
                    const responseProjects = await getProjects({ email: user?.email });
                    setProjects(Object.values(responseProjects)[0]?.projects);
                    setLoadingProjects(false);
                    setEmployeeStatuses(Object.values(response)[0]?.employeeStatuses);
                } catch (error) {
                    setLoading(false);
                }
            }
        }
        const handleNavigation = (rowID) => {
            navigate(`/projects/${rowID}`);
        };

        loadEmployeeData();
    }, [dispatch, user?.email, getStatusOfEmployees,getProjects]);

    if (!user || !profile) {
        return <Loading />;
    }
    const hideTask = (id) => {
        dispatch(hideDailyTask({ id }));
    };
    return (
        <div className={classes.root}>
            <div className={classes.titleSection} style={{gridRow: '1', gridColumn: '1/5'}}>
                Bonjour {profile.lastName} {profile.name},
            </div>
            <div className={classes.contentSection} style={{gridRow: '2', gridColumn: '1/3'}}>
                <h3>Your Projects</h3>
                <ul className={classes.list}>
                    {loadingProjects ? <LoadingProjectsSkeleton/> : (
                        projects?.map(project => (
                            <li key={project.id} className={classes.projectListItem}>
                                <div className={classes.projectDetails}>
                                    <span className={classes.projectName}><span>Project Name : </span> {project.name}</span>
                                    <span className={classes.projectDate}> Due Date : {dayjs(project.startDate).format("MMM DD, YYYY")}
                        </span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className={classes.contentSection} style={{gridRow: '3', gridColumn: '1/3'}}>
                <h2>Task List</h2>
                <ul className={classes.list}>
                    {generalTasks.map((project, idx) => (
                        <TaskItem
                            extra={true}
                            historyDate={history}
                            id={project.id}
                            key={idx}
                            hours={project.nbHours}
                            task={project?.task}
                            project={project?.project}
                            percentValue={DAILY_HOURS_VALUE}
                            value={hourDivision.tasks[project.id]?.value}
                            handleHide={(e) => hideTask(project.id)}
                        />
                    ))}
                </ul>
            </div>
            <hr/>
            <div className={classes.contentSection} style={{gridRow: '2 / 5', gridColumn: '3'}}>
                <h2>Employee Status Today</h2>
                <div className={classes.employeeStatus}>
                    {employeeStatuses.map((emp, index) => (
                        <div key={index} className={classes.employeeCard}>
                            <span className={classes.employeeNameEmail}>
                                <b>{emp.employeeName}</b>
                                <br/>
                                {emp.email}
                            </span>
                            <span
                                className={`${classes.employeeStatusText} ${classes[emp.status.replace(/\s+/g, '').toLowerCase()]}`}>
                                {emp.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProjectOverView;
