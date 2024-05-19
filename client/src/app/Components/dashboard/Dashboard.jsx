import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateCalendar, PickersDay} from '@mui/x-date-pickers';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';

import { styled } from '@mui/material/styles';
import LatestTasksList from '../profile/LatestTasksList';
import StakesDiagram from './Stake';
import { dashboardComponentStyles } from './style';
import useGetAuthenticatedUser from '../../../hooks/authenticated';
import { useGetAllLeavesByEmailMutation } from "../../../store/api/leave.api";
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import CustomPieChart from "./PieChart";
import TaskItem from "../dailylog/TaskItem";
import {DAILY_HOURS_VALUE} from "../../../constants/constants";
import useGetStateFromStore from "../../../hooks/manage/getStateFromStore";
import useFetchDailyLog from "../../../services/fetchers/dailyLog.fetch.service";
import {hideDailyTask} from "../../../store/reducers/task.reducer";
import {useDispatch} from "react-redux";
import {useGetStatusOfEmployeesMutation} from "../../../store/api/remote.api";

dayjs.extend(isBetweenPlugin);
const CustomPickersDay = styled(PickersDay)(({ theme, isSelected }) => ({
    borderRadius: '50%',  // Making the date cells circular
    boxShadow: isSelected ? `0px 0px 10px ${theme.palette.primary.main}` : 'none',  // Adding shadow for a popping effect
    backgroundColor: isSelected ? 'orange' : 'inherit',  // Orange for selected days
    color: isSelected ? theme.palette.getContrastText('#FFA500') : theme.palette.text.primary,  // Ensuring text is readable
    fontWeight: isSelected ? 'bold' : 'normal',  // Bold text for selected days
    '&:hover, &:focus': {
        backgroundColor: isSelected ? '#FF8C00' : theme.palette.action.hover,  // Using the hex code for dark orange
        color: theme.palette.getContrastText('#FF8C00'),
    },
}));

function DashboardComponent() {
    const classes = dashboardComponentStyles();
    const [getAllLeavesByEmail] = useGetAllLeavesByEmailMutation();
    const { user } = useGetAuthenticatedUser();
    const [leaves, setLeaves] = useState([]);
    const [value, setValue] = useState(dayjs());
    const generalTasks = useGetStateFromStore("task", "userGeneralTasks");
    const [history, setHistory] = useState(dayjs(new Date()));
    const hourDivision = useGetStateFromStore("task", "dailyLogDevisions");
    const { isLoading: loadingTasks } = useFetchDailyLog(history);
    const dispatch = useDispatch();
    const [selectedStatus, setSelectedStatus] = useState('');
    const [employeeStatuses, setEmployeeStatuses] = useState([]);
    const [getStatusOfEmployees] = useGetStatusOfEmployeesMutation();

    useEffect(() => {
        if (user?.email) {
            getAllLeavesByEmail({ email: user.email }).then(async response => {
                const formattedLeaves = response.data?.leaves.map(leave => ({
                    start: dayjs(leave.dateDebut),
                    end: dayjs(leave.dateFin)
                }));
                setLeaves(formattedLeaves);
                const responseEmp = await getStatusOfEmployees({email: user?.email});
                setEmployeeStatuses(Object.values(responseEmp)[0]?.employeeStatuses);
            }).catch(console.error);
        }
    }, [user?.email]);

    const isDayInLeaves = (day) => {
        return leaves.some(leave => day.isBetween(leave.start, leave.end, 'day', '[]'));
    };

    const hideTask = (id) => {
        dispatch(hideDailyTask({ id }));
    };
    const handleChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const filteredTasks = selectedStatus === ''
        ? generalTasks.slice(0, 4)
        : generalTasks.filter(task => task.task.state === selectedStatus);
    return (
        <div className={classes.root}>
            <Grid container className={classes.dashboardContainer} spacing={2}>
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={value}
                            onChange={setValue}
                            showDaysOutsideCurrentMonth
                            displayWeekNumber
                            slots={{
                                day: ({day, ...dayProps}) => {
                                    const isSelected = isDayInLeaves(dayjs(day));
                                    return <CustomPickersDay {...dayProps} isSelected={isSelected} day={day}/>;
                                }
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6} style={{marginTop: "-50px"}}>
                    <div>
                        <Grid item xs={12} md={6}>
                        <CustomPieChart/>
                        </Grid>

                        <div>
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

                </Grid>
                <Grid item xs={12} md={6}>
                    <div className={classes.dashboardContainer}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Select
                                    value={selectedStatus}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{'aria-label': 'Without label'}}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="done">Done</MenuItem>
                                    <MenuItem value="abandoned">Abandoned</MenuItem>
                                    <MenuItem value="doing">Doing</MenuItem>
                                    <MenuItem value="blocked">Blocked</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={12} >
                                <TableContainer component={Paper}>
                                    <Table className={classes.table} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Code Projet</TableCell>
                                                <TableCell>Nom Tâche</TableCell>
                                                <TableCell>Date Début</TableCell>
                                                <TableCell>Date Échéance</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredTasks.map((task) => (
                                                <TableRow key={task.id}>
                                                    <TableCell component="th" scope="row">{task.project.customId}</TableCell>
                                                    <TableCell>{task.task.name}</TableCell>
                                                    <TableCell>{dayjs(task.startDate).format("YYYY-MM-DD")}</TableCell>
                                                    <TableCell>{dayjs(task.dueDate).format("YYYY-MM-DD")}</TableCell>
                                                    <TableCell>{task.task.state}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={12} md={6} style={{padding: "10",height : "350px"}}> {/* Set a height for the chart container */}
                    <StakesDiagram/>
                </Grid>
            </Grid>
        </div>
    );
}

export default DashboardComponent;