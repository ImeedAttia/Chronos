import React, { useEffect, useState } from 'react';
import {
  useGetAllLeavesMutation,
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} from '../../../../store/api/leave.api';
import { useDispatch } from "react-redux";
import Loading from "../../loading/Loading";

import {
  DataGrid,
} from "@mui/x-data-grid";
import { listStyle } from "./style";

function ManagingUsers() {
  const classes = listStyle();

  const [leaves, setLeaves] = useState([]);
  const [newLeaveData, setNewLeaveData] = useState({
    dateDebut: '',
    dateFin: '',
    type: '',
    status: '',
  });
  const [loading, setLoading] = useState(true); // Loading state

  const dispatch = useDispatch();

  const [getAllLeaves] = useGetAllLeavesMutation();
  useEffect(() => {
    async function loadLeaves() {
      try {
        const response = await getAllLeaves();
        const leavesArray = Object.values(response)[0]?.leaves || []; // Convert JSON object to array
        setLeaves(leavesArray);
       setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
        setLoading(false); // Set loading to false when data is fetched
      }
    }

 loadLeaves(); // Call the async function to fetch leaves
  }, [getAllLeaves, dispatch]); // Include dispatch in the dependency array
  // Create a new leave
  const [createLeave] = useCreateLeaveMutation();
  const handleCreateLeave = () => {
    createLeave(newLeaveData)
      .unwrap()
      .then((response) => {
        setLeaves([...leaves, response.leave]);
        setNewLeaveData({
          dateDebut: '',
          dateFin: '',
          type: '',
          status: '',
        });
      })
      .catch((error) => {
        console.error('Error creating leave:', error);
      });
  };

  // Update a leave
  const updateLeave = useUpdateLeaveMutation();
  const handleUpdateLeave = (id, updatedData) => {
    updateLeave({ leaveId: id, ...updatedData })
      .unwrap()
      .then((response) => {
        const updatedLeaves = leaves.map((leave) =>
          leave.id === id ? response.leave : leave
        );
        setLeaves(updatedLeaves);
      })
      .catch((error) => {
        console.error('Error updating leave:', error);
      });
  };

  // Delete a leave
  const deleteLeave = useDeleteLeaveMutation();
  const handleDeleteLeave = (id) => {
    deleteLeave(id)
      .unwrap()
      .then(() => {
        const filteredLeaves = leaves.filter((leave) => leave.id !== id);
        setLeaves(filteredLeaves);
      })
      .catch((error) => {
        console.error('Error deleting leave:', error);
      });
  };
    // Function to generate a random ID
    const generateRandomId = () => {
      return Math.floor(Math.random() * 1000000); // Adjust the range as needed
    };
 // Define columns for the DataGrid
 const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'dateDebut', headerName: 'Start Date', width: 150 },
  { field: 'dateFin', headerName: 'End Date', width: 150 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'status', headerName: 'Status', width: 120 },
  // Add more columns as needed
];


  
  if (loading) return <Loading />;

  return (
    <><div style={{ height: 400, width: '100%' }}>
      <DataGrid
        className={classes.list}
        rows={leaves}
        columns={columns}
        pageSize={5}
        autoHeight />
    </div>
    <div>
        <h2>Leaves</h2>
        <ul>
          {leaves.length > 0 ? (
            leaves?.map((leave) => (
              <li key={generateRandomId()}>
                {leave.dateDebut} - {leave.dateFin} - {leave.type} - {leave.status}
                <button onClick={() => handleUpdateLeave(leave.id, { status: 'Updated' })}>Update</button>
                <button onClick={() => handleDeleteLeave(leave.id)}>Delete</button>
              </li>
            ))
          ) : (
            <li>No leaves to display</li>
          )}
        </ul>
        <h3>Create New Leave</h3>
        <div>
          <input
            type="date"
            placeholder="Start Date"
            value={newLeaveData.dateDebut}
            onChange={(e) => setNewLeaveData({ ...newLeaveData, dateDebut: e.target.value })} />
          <input
            type="date"
            placeholder="End Date"
            value={newLeaveData.dateFin}
            onChange={(e) => setNewLeaveData({ ...newLeaveData, dateFin: e.target.value })} />
          <input
            type="text"
            placeholder="Type"
            value={newLeaveData.type}
            onChange={(e) => setNewLeaveData({ ...newLeaveData, type: e.target.value })} />
          <input
            type="text"
            placeholder="Status"
            value={newLeaveData.status}
            onChange={(e) => setNewLeaveData({ ...newLeaveData, status: e.target.value })} />
          <button onClick={handleCreateLeave}>Create</button>
        </div>
      </div></>
  );
}

export default ManagingUsers;
