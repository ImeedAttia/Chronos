import { createUseStyles } from 'react-jss';

export const dashboardComponentStyles = createUseStyles({
  root: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",

    overflow: 'auto',

  },
  dashboardContainer: {
    width: '100%',
    margin: 0,
    padding: 0,
  },
  contentSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.12)',
    height: "calc(100% - 100px)", // Adjust the height as needed
    overflowX: 'auto',
    width : '100%',
    scrollSnapType: 'x mandatory', // Enables snap scrolling
    '& > div': { // Assuming direct children are the "pages" or "slides"
      scrollSnapAlign: 'start',
      display: 'inline-block',
      minWidth: '100%', // Example to ensure each child is full width
      padding: '10px',
      boxSizing: 'border-box',
    }
  },
  agenda: {
    height: '50vh',
    padding: 20,
    boxShadow: '0px 7px 33px 0px rgba(0,0,0,0.3)',
    background: 'white',
    borderRadius: 10,
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
