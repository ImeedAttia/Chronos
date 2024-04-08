import { createUseStyles } from "react-jss";

export const listStyle = createUseStyles({
    icon: {
      width: 18,
      height: 18,
    },
    safeLabel: {
      fontWeight: 600,
      fontSize: 14,
      width: "150px",
      textAlign: "center",
      color: "var(--dark-green)",
      borderRadius: 4,
      padding: "5px 0", // Corrected padding value
      border: "2px solid var(--dark-green)",
    },
    redLabel: {
      fontWeight: 600,
      fontSize: 14,
      color: "var(--toastify-icon-color-error)",
      borderRadius: 4,
      padding: "5px 0", // Corrected padding value
      width: "150px",
      textAlign: "center",
      border: "2px solid var(--toastify-icon-color-error)",
    },
    roleBtn: {
      background: "none",
      border: "none",
      width: "100%",
      textAlign: "left",
      height: "100%",
    },
    list: {
      height: "calc(100% - 53px) !important",
      borderRadius: "30px !important",
      overflow: "hidden !important",
      background: "var(--white)",
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "var(--light-green)",
        color: "var(--white)",
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "600 !important",
        },
        height: "90px !important",
        maxHeight: "90px !important",
        "& .MuiDataGrid-columnHeadersInner": {
          width: "98%",
          margin: "auto",
        },
      },
      "& .MuiDataGrid-virtualScroller": {
        width: "98%",
        margin: "auto",
        marginTop: -20,
        position: "relative",
        background: "var(--white)",
        borderRadius: 15,
        boxShadow: "0px 7px 33px 0px rgba(0,0,0,0.3)",
        marginBottom: 20,
        maxHeight: "100% !important",
        height: "100% !important",
        overflow: "visible !important",
        overflowX: "hidden !important",
        overflowY: "auto !important",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          WebkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          borderRadius: "10px",
          background: "var(--pastel-green)",
        },
        "& .MuiDataGrid-virtualScrollerContent": {
          height: "100% !important",
        },
      },
      "& .MuiDataGrid-row, .MuiDataGrid-cell ": {
        minHeight: "42px !important",
        maxHeight: "42px !important",
        border: "none !important",
      },
      "&.integrated": {
        overflow: "visible !important",
        "& .MuiDataGrid-main": {
          overflow: "visible",
        },
        "& .MuiDataGrid-columnHeaderTitleContainerContent": {
          width: "100%",
          overflow: "visible",
        },
        "& .MuiDataGrid-columnHeaderTitleContainer": {
          overflow: "visible",
        },
        borderTopLeftRadius: "0px !important",
        borderTopRightRadius: "0px !important",
        background: "transparent !important",
        border: "none",
        "& .MuiDataGrid-columnHeaders": {
          borderRadius: 0,
          overflow: "visible",
          "& .MuiDataGrid-columnHeader": {
            paddingLeft: "0 !important",
          },
        },
        "& .MuiDataGrid-row, .MuiDataGrid-cell ": {
          minHeight: "42px !important",
          maxHeight: "unset !important",
          border: "none !important",
          alignItems: "flex-start",
          padding: "7px 0",
        },
        "& .MuiDataGrid-overlayWrapperInner": {
          height: "600px !important",
        },
      },
      "& .notTreatedRequest": {
        backgroundColor: "#e74c3c2e !important",
      },
      "& .MuiDataGrid-footerContainer": {
        display: "none !important",
      },
    },
  });
  