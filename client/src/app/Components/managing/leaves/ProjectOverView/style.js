import { createUseStyles } from "react-jss";

export const projectOverviewStyles = createUseStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gridTemplateRows: 'auto auto auto',
        gap: '20px',
        height: '100%',
        width: '100%',
        padding: '20px',
        backgroundColor: '#f0f0f0',
    },
    titleSection: {
        gridRow: '1',
        gridColumn: '1 / 3',
        backgroundColor: 'var(--light-green)',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    contentSection: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0,0,0,0.12)',
        overflow: 'hidden',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
    },
    projectDetails: {
        display: 'flex',
        flexDirection: 'column',
    },
    projectName: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
    },
    projectDate: {
        fontSize: '14px',
        color: '#666',
    },
    employeeStatus: {
        display: 'flex',
        flexDirection: 'column',
    },
    employeeCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px',
        marginBottom: '10px',
        borderRadius: '5px',
    },
    employeeNameEmail: {
        fontSize: '0.8rem',
        fontWeight: 'normal',
        marginRight: '5px'
    },
    employeeStatusText: {
        fontWeight: 'bold',
        padding: '5px 10px',
        borderRadius: '5px',
    },
    conge: {
        backgroundColor: '#FFC6C6',
    },
    inoffice: {
        backgroundColor: '#C5F7EC',
    },
    homeoffice: {
        backgroundColor: '#F2DFBA',
    },
});
