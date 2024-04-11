import React, { useEffect, useState, useRef } from 'react';
import {useGetAllLeavesMutation, useUpdateLeaveMutation} from '../../../../store/api/leave.api';
import {useGetAllRemoteWorksMutation, useUpdateRemoteWorkMutation} from '../../../../store/api/remote.api';
import { useDispatch } from 'react-redux';
import Loading from '../../loading/Loading';
import {Button, Skeleton} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ManagingLeavesStyles } from './style';
import useGetAuthenticatedUser from "../../../../hooks/authenticated";
import TaskItem from "../../dailylog/TaskItem";
import {DAILY_HOURS_VALUE} from "../../../../constants/constants";
import {hideDailyTask, updateDailyHours} from "../../../../store/reducers/task.reducer";
import useGetStateFromStore from "../../../../hooks/manage/getStateFromStore";
import dayjs from "dayjs";
import useFetchDailyLog from "../../../../services/fetchers/dailyLog.fetch.service";


function ManagingLeaves() {

    const generalTasks = useGetStateFromStore("task", "userGeneralTasks");
    const [history, setHistory] = useState(dayjs(new Date("")));
    const hourDivision = useGetStateFromStore("task", "dailyLogDevisions");
    const { isLoading: loadingTasks } = useFetchDailyLog(history);

    const classes = ManagingLeavesStyles();
    const { user } = useGetAuthenticatedUser();
    const [leaves, setLeaves] = useState([]);
    const [remotes, setRemotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('leaves');
    const [selectedRow, setSelectedRow] = useState(null); // State to store the selected row
    const detailBlockRef = useRef(null); // Ref for the detail block

    const dispatch = useDispatch();

    const [getAllLeaves] = useGetAllLeavesMutation();
    const [getAllRemote] = useGetAllRemoteWorksMutation();
    const [changeRemote] = useUpdateRemoteWorkMutation();
    const [changeLeave] = useUpdateLeaveMutation();

    const handleChangeHourTask = (id, val) => {

    };

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        async function loadLeaves() {
            try {
                const response = await getAllLeaves();
                const leavesArray = Object.values(response)[0]?.leaves || [];
                const formattedLeaves = leavesArray.map(leave => ({
                    ...leave,
                    dateDebut: formatDate(new Date(leave.dateDebut)),
                    dateFin: formatDate(new Date(leave.dateFin)),
                }));
                setLeaves(formattedLeaves);

                const remoteResponse = await getAllRemote();
                const remoteArray = Object.values(remoteResponse)[0]?.remoteWorks || [];
                const formattedRemotes = remoteArray.map(remote => ({
                    ...remote,
                    remoteDate: formatDate(new Date(remote.remoteDate)),
                }));
                setRemotes(formattedRemotes);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }

        loadLeaves();
    }, [dispatch, getAllLeaves, getAllRemote]);


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleRowClick = (row) => {
        console.log(generalTasks);
        setSelectedRow(row?.row);
        setTimeout(() => {
            detailBlockRef.current.scrollIntoView({behavior: 'smooth'});
        }, 100); // Adjust the timeout duration as needed
//        setHistory(dayjs(row.row.dateDebut));
    };

    const columnsTableLeave = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'dateDebut', headerName: 'Start Date', width: 150 },
        { field: 'dateFin', headerName: 'End Date', width: 150 },
        { field: 'type', headerName: 'Type', width: 150 },
        {
            field: 'status',
            headerName: 'Etat de demande',
            width: 120,
            renderCell: (params) => {
                let statusColor = '';
                switch (params.value) {
                    case 'En cours':
                        statusColor = 'orange';
                        break;
                    case 'Accepté':
                        statusColor = 'green';
                        break;
                    case 'Refusé':
                        statusColor = 'red';
                        break;
                    default:
                        statusColor = '';
                        break;
                }
                return <div style={{ color: statusColor }}>{params.value}</div>;
            }
        },
    ];

    const columnsTableRemote = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'reference', headerName: 'Référence', width: 150 },
        { field: 'remoteDate', headerName: 'Date', width: 150 },
        {
            field: 'status',
            headerName: 'Etat de demande',
            width: 120,
            renderCell: (params) => {
                let statusColor = '';
                switch (params.value) {
                    case 'En cours':
                        statusColor = 'orange';
                        break;
                    case 'Accepté':
                        statusColor = 'green';
                        break;
                    case 'Refusé':
                        statusColor = 'red';
                        break;
                    default:
                        statusColor = '';
                        break;
                }
                return <div style={{ color: statusColor }}>{params.value}</div>;
            }
        },
    ];
    const hideTask = (id) => {
        dispatch(hideDailyTask({ id }));
    };
    const handleAccept = async () => {
        if (selectedRow && selectedRow.status === 'En cours') {
            try {
                const updatedStatus = 'Accepté';
                if (activeTab === 'leaves') {
                    const updatedLeaves = leaves.map(leave => {
                        if (leave.id === selectedRow.id) {
                            return { ...leave, status: updatedStatus };
                        }
                        return leave;
                    });
                    setLeaves(updatedLeaves);

                    // Update the leave with only status and id fields
                    const { id, status } = updatedLeaves.find(leave => leave.id === selectedRow.id);
                    const responseUpdate = await changeLeave({ id, status });
                    console.log(responseUpdate);
                }
                else if (activeTab === 'remote') {
                    const updatedRemotes = remotes.map(remote => {
                        if (remote.id === selectedRow.id) {
                            return { ...remote, status: updatedStatus };
                        }
                        return remote;
                    });
                    setRemotes(updatedRemotes);

                    // Assuming changeRemote is also updated to accept only status and id
                    // Update the remote with only status and id fields
                    const { id, status } = updatedRemotes.find(remote => remote.id === selectedRow.id);
                    changeRemote({ id, status });
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };
    const handleRefuse = async () => {
        if (selectedRow && selectedRow.status === 'En cours') {
            try {
                const updatedStatus = 'Refusé';
                if (activeTab === 'leaves') {
                    const updatedLeaves = leaves.map(leave => {
                        if (leave.id === selectedRow.id) {
                            return { ...leave, status: updatedStatus };
                        }
                        return leave;
                    });
                    setLeaves(updatedLeaves);

                    // Update the leave with only status and id fields
                    const { id, status } = updatedLeaves.find(leave => leave.id === selectedRow.id);
                    const responseUpdate = await changeLeave({ id, status });
                    console.log(responseUpdate);
                }
                else if (activeTab === 'remote') {
                    const updatedRemotes = remotes.map(remote => {
                        if (remote.id === selectedRow.id) {
                            return { ...remote, status: updatedStatus };
                        }
                        return remote;
                    });
                    setRemotes(updatedRemotes);

                    // Assuming changeRemote is also updated to accept only status and id
                    // Update the remote with only status and id fields
                    const { id, status } = updatedRemotes.find(remote => remote.id === selectedRow.id);
                    changeRemote({ id, status });
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }
    };

    const getPendingCount = () => {
        let pendingCount = 0;
        if (activeTab === 'leaves') {
            pendingCount = leaves.filter(leave => leave.status === 'En cours').length;
        } else if (activeTab === 'remote') {
            pendingCount = remotes.filter(remote => remote.status === 'En cours').length;
        }
        return pendingCount;
    };
    if (loading) return <Loading />;
    const pendingCount = getPendingCount();
    return (
        <div className={classes.root}>
            <div className={classes.titleSection}>
                <span className={classes.spanT}>Gestion de demande</span>
            </div>
            <div className={classes.contentSection}>
                <div className={classes.tabs}>
                    <div className={classes.roleBtn}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={activeTab === 'leaves'}
                            onClick={() => handleTabChange('leaves')}
                        >
                            Les demande de Congé ({pendingCount})
                        </Button>
                    </div>
                    <div className={classes.roleBtn}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={activeTab === 'remote'}
                            onClick={() => handleTabChange('remote')}
                        >
                            Les demande de TT ({pendingCount})
                        </Button>
                    </div>
                </div>
                <div className={classes.tableContainer}>
                    {activeTab === 'leaves' && (
                        <DataGrid
                            rows={leaves}
                            columns={columnsTableLeave}
                            pageSize={5}
                            autoHeight
                            onRowClick={(row) => handleRowClick(row)}
                        />
                    )}
                    {activeTab === 'remote' && (
                        <DataGrid
                            rows={remotes}
                            columns={columnsTableRemote}
                            pageSize={5}
                            autoHeight
                            onRowClick={(row) => handleRowClick(row)}
                        />
                    )}
                </div>
                {selectedRow && (
                    <div>
                        <div ref={detailBlockRef} className={classes.detailBlock}>
                            <h1>Les tâches en cours</h1>
                            <div className={classes.innerDetailBlock}>
                                <div>
                                    {!loadingTasks ? (
                                        <div>
                                            {generalTasks.map((daily, idx) => (
                                                <TaskItem
                                                    handleChange={handleChangeHourTask}
                                                    extra={true}
                                                    historyDate={history}
                                                    id={daily.id}
                                                    key={idx}
                                                    hours={daily.nbHours}
                                                    task={daily?.task}
                                                    project={daily?.project}
                                                    percentValue={DAILY_HOURS_VALUE}
                                                    value={hourDivision.tasks[daily.id]?.value}
                                                    handleHide={(e) => hideTask(daily.id)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <Skeleton className={classes.generalTasks}/>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className={classes.buttonContainer}>
                            <div className={classes.roleBtn}>
                                <Button variant="contained" color="secondary" onClick={() => handleRefuse()}>
                                    Refuser
                                </Button>
                            </div>
                            <div className={classes.roleBtn}>
                                <Button variant="contained" color="primary" onClick={() => handleAccept()} >
                                    Accepter
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagingLeaves;
