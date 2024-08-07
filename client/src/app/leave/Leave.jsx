import React, { useEffect, useState } from 'react';
import {
  useGetAllLeavesByEmailMutation,
  useCreateLeaveMutation,
  useDeleteLeaveMutation
} from '../../store/api/leave.api';
import { useDispatch } from 'react-redux';
import Loading from '../Components/loading/Loading';
import {
  Button,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { leaveComponentStyles } from './style';
import useGetAuthenticatedUser from "../../hooks/authenticated";
import {
  useGetAllRemoteWorksByEmailMutation,
  useCreateRemoteWorkMutation,
  useDeleteRemoteWorkMutation
} from '../../store/api/remote.api';
import {notify} from "../Components/notification/notification";
import {NOTIFY_ERROR, NOTIFY_SUCCESS} from "../../constants/constants";

function LeaveComponent() {
  const classes = leaveComponentStyles();
  const { user } = useGetAuthenticatedUser();
  const [addDisableLeave, setAddDisableLeave] = useState(false);
  const [addDisableRemote, setAddDisableRemote] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [remotes, setRemotes] = useState([]);
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  const [showNewRemoteForm, setShowNewRemoteForm] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [selectedRemote, setSelectedRemote] = useState(null);

  const [userID, setUserId] = useState(0); // State to store user ID
  const [newLeaveData, setNewLeaveData] = useState({
    dateDebut: '',
    dateFin: '',
    type: '',
    status: 'En cours',
  });
  const [newRemoteData, setNewRemoteData] = useState({
    reference: '',
    remoteDate: '',
    status: 'En cours',
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const [getAllLeavesByEmail] = useGetAllLeavesByEmailMutation();
  const [getAllRemoteByEmail] = useGetAllRemoteWorksByEmailMutation();
  const [createRemote] = useCreateRemoteWorkMutation();
  const  [handleDeleteLeave] = useDeleteLeaveMutation();
  const [handleDeleteRemote] = useDeleteRemoteWorkMutation();
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    async function loadLeaves() {
      try {
        if (user?.email != null) {
          const response = await getAllLeavesByEmail({ email: user?.email });
          const leavesArray = Object.values(response)[0]?.leaves || [];
          const formattedLeaves = leavesArray.map(leave => ({
            ...leave,
            dateDebut: formatDate(new Date(leave.dateDebut)),
            dateFin: formatDate(new Date(leave.dateFin)),
            supprimer : leave.name,
            modifier : leave.id
          }));
          console.log(formattedLeaves);
          setLeaves(formattedLeaves);

          const remoteResponse = await getAllRemoteByEmail({ email: user?.email });
          const remoteArray = Object.values(remoteResponse)[0]?.remoteWorks || [];
          const formattedRemotes = remoteArray.map(remote => ({
            ...remote,
            remoteDate: formatDate(new Date(remote.remoteDate)),
            supprimer : remote.name,
            modifier : remote.id
          }));
          setRemotes(formattedRemotes);
          setLoading(false);

          if (leavesArray.length > 0) {
            const firstLeafUserID = leavesArray[0].userID;
            setUserId(firstLeafUserID);
          }
        }
      } catch (error) {
        setLoading(false);
      }
    }

    loadLeaves();
  }, [dispatch, user?.email, getAllLeavesByEmail]);

  const [createLeave] = useCreateLeaveMutation();
  const handleCreateLeave = () => {
    const leaveDataWithUserId = { ...newLeaveData, userID };
    createLeave(leaveDataWithUserId)
      .unwrap()
      .then((response) => {
        setLeaves([...leaves, response.leave]);
        setNewLeaveData({
          dateDebut: '',
          dateFin: '',
          type: '',
          status: '',
        });
        setShowNewLeaveForm(false);
        notify(NOTIFY_SUCCESS, "Remote Created successfully");
      })
      .catch((error) => {
        console.error('Error creating leave:', error);
        notify(NOTIFY_ERROR, error.data?.message);

      });
  };

  const handleCreateRemote = () => {
    const remoteDataWithUserId = { ...newRemoteData, userID };

    createRemote(remoteDataWithUserId)
      .unwrap()
      .then((response) => {
        setRemotes([...remotes, response.remoteWork]);
        setNewRemoteData({
          reference: '',
          remoteDate: '',
          status: '',
        });
        setShowNewRemoteForm(false);
        notify(NOTIFY_SUCCESS, "Remote Created successfully");

      })
      .catch((error) => {
        console.error('Error creating remote work:', error);
        notify(NOTIFY_ERROR, error.data?.message);

      });
  };

  const columnsTableLeave = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'dateDebut', headerName: 'Start Date', width: 150 },
    { field: 'dateFin', headerName: 'End Date', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    {
      field: 'status',
      headerName: 'Etat de demande',
      width: 150,
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
    {
      field: 'supprimer',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => {
        return <Button style={{ color: "red" }} onClick={() => deleteLeave(params)}>Delete</Button>;
      }
    },
    {
      field: 'modifier',
      headerName: 'Modifier',
      width: 150,
      renderCell: (params) => {
        return <Button style={{ color: "orange" }} onClick={() => changeLeave(params)}>Modifier</Button>;
      }
    }
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
    {
      field: 'supprimer',
      headerName: 'Delete',
      width: 150,
      renderCell: (params) => {
        return <Button style={{ color: "red" }} onClick={() => deleteRemote(params)}>Delete</Button>;
      }
    },
    {
      field: 'modifier',
      headerName: 'Modifier',
      width: 150,
      renderCell: (params) => {
        return <Button style={{ color: "orange" }} onClick={() => changeRemote(params)}>Modifier</Button>;
      }
    }

  ];
  const deleteLeave = (params) => {
    const leaveId = params.row.id;
    setSelectedLeave(leaveId);
    setOpen(true);
    console.log(selectedLeave)
  };
  const deleteLeaveData = () => {
    if (selectedLeave !== null) {
      handleDeleteLeave(selectedLeave);
      setSelectedLeave(null);
          setOpen(false);
      window.location.reload();
    } else {
      handleDeleteRemote(selectedRemote);
      setSelectedRemote(null);
          setOpen(false);
      window.location.reload();

    }
    ;
  };

  const changeLeave =  (event) =>{
    const id = event.target.value ? Number(event.target.value) : 0;
    console.log(id);

    const selectedLeave = leaves.find((leave) => leave.id === id);
    setNewLeaveData(selectedLeave);
    console.log(selectedLeave);
    setShowNewLeaveForm(true)
    // confirm("Are you sure you want to delete this leave?");
    return event.target.value;
  }

  const deleteRemote =  (event) =>{
    const remoteId = event.row.id;
    setSelectedRemote(remoteId);
    setOpen(true);
    console.log(selectedRemote)
  }


  const changeRemote =  (event) =>{
    const id = event.target.value ? Number(event.target.value) : 0;
    const selectedRemote = remotes.find((leave) => leave.id === id);
    console.log(id);

    setNewRemoteData(selectedRemote);
    setShowNewRemoteForm(true)
    // confirm("Are you sure you want to delete this leave?");
    return event.target.value;
  }
  const calculateLeavesTaken = () => {
    const currentYear = new Date().getFullYear();
    const acceptedLeaves = leaves.filter(leave => leave.status === 'Accepté' && new Date(leave.dateDebut).getFullYear() === currentYear);
    const totalLeavesTaken = acceptedLeaves.reduce((total, leave) => {
      const startDate = new Date(leave.dateDebut);
      const endDate = new Date(leave.dateFin);
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      return total + daysDiff;
    }, 0);
    const remainingLeaves = Math.max(0, 22 - totalLeavesTaken); // Maximum of 22 leaves per year
    return remainingLeaves;
  };

  const calculateRemotesTakenThisWeek = () => {
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() - 1)); // Monday
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // Friday
    const acceptedRemotesThisWeek = remotes.filter(remote => remote.status === 'Accepté' && new Date(remote.remoteDate) >= weekStart && new Date(remote.remoteDate) <= weekEnd);
    const totalRemotesTakenThisWeek = Math.min(3, acceptedRemotesThisWeek.length); // Maximum of 3 remote days
    const remainingRemoteDays = 3 - totalRemotesTakenThisWeek; // Calculate remaining remote days
    if(remainingRemoteDays <=0) setAddDisableRemote(true);
    return remainingRemoteDays;
  };
  const handleClose = () => {
    setOpen(false);
  };

  if (loading) return <Loading />;
  return (
    <div className={classes.root}>
      <div className={classes.titleSection}>
        <span className={classes.spanT}>Vos Congé et Télétravail</span>
      </div>
      <div className={classes.contentSection}>
        <div>
          <div className={classes.greenText}>
            {calculateLeavesTaken()} jours restant dans votre solde
          </div>
          <div className={classes.orangeText}>
            {calculateRemotesTakenThisWeek()} jours restant pour cette semaine
          </div>
        </div>
        <div className={classes.tableContainer}>
          {showNewLeaveForm ? (
            <div className={classes.newLeaveForm}>
              <div className={classes.newLeaveFormItem}>
                <input
                  type="date"
                  value={newLeaveData.dateDebut}
                  onChange={(e) => setNewLeaveData({ ...newLeaveData, dateDebut: e.target.value })}
                  className={classes.datePicker}
                />
                <input
                  type="date"
                  value={newLeaveData.dateFin}
                  onChange={(e) => setNewLeaveData({ ...newLeaveData, dateFin: e.target.value })}
                  className={classes.datePicker}
                />
                <Select
                    label={"Type : "}
                    value={newLeaveData.type}
                    onChange={(e) => setNewLeaveData({...newLeaveData, type: e.target.value})}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="Annuelle">Annuelle</MenuItem>
                  <MenuItem value="Maternité">Maternité</MenuItem>
                  <MenuItem value="Maladie">Maladie</MenuItem>
                </Select>
              </div>
              <div className={classes.buttonContainer}>
                <div className={classes.roleBtn}>
                  <Button variant="contained" color="secondary" onClick={() => setShowNewLeaveForm(false)}>
                    Cancel
                  </Button>
                </div>
                <div className={classes.roleBtn}>
                  <Button variant="contained" color="primary" onClick={handleCreateLeave}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={classes.tableContainer}>
              <div className={classes.roleBtn}>
                <Button variant="contained" color="primary" disabled={addDisableLeave && calculateRemotesTakenThisWeek() >=1} onClick={() => setShowNewLeaveForm(true)}>
                  Add New Leave
                </Button>
              </div>
              <DataGrid
                rows={leaves}
                columns={columnsTableLeave}
                pageSize={5}
                autoHeight
              />
            </div>
          )}
        </div>
        <hr />
        {showNewRemoteForm ? (
          <div className={classes.newLeaveForm}>
            <div className={classes.newLeaveFormItem}>
              <TextField
                label="Référence"
                value={newRemoteData.reference}
                onChange={(e) => setNewRemoteData({ ...newRemoteData, reference: e.target.value })}
              />
              <input
                type="date"
                value={newRemoteData.remoteDate}
                onChange={(e) => setNewRemoteData({ ...newRemoteData, remoteDate: e.target.value })}
                className={classes.datePicker}
              />
            </div>
            <div className={classes.buttonContainer}>
              <div className={classes.roleBtn}>
                <Button variant="contained" color="secondary" onClick={() => setShowNewRemoteForm(false)}>
                  Cancel
                </Button>
              </div>
              <div className={classes.roleBtn}>
                <Button variant="contained" color="primary" onClick={handleCreateRemote}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={classes.roleBtn}>
              <Button variant="contained" disabled={addDisableRemote} color="primary" onClick={() => setShowNewRemoteForm(true)}>
                Add new Remote Work
              </Button>
              <span className={classes.textDesc}>
                le système est configuré pour traiter automatiquement les demandes de télétravail. Par conséquent, veuillez noter que le système ne vous permettra de réserver qu'une semaine par tête et que le premier arrivé sera le premier servi.
              </span>
            </div>
            <div className={classes.tableContainer}>
              <DataGrid
                rows={remotes}
                columns={columnsTableRemote}
                pageSize={5}
                autoHeight
              />
            </div>
          </div>
        )}

      </div>
      <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedLeave !== null
                ? "Are you sure you want to delete this leave?"
                : "Are you sure you want to delete this remote?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="secondary" onClick={deleteLeaveData} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>

  );
}

export default LeaveComponent;
