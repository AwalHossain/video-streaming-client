import React, { useEffect, useReducer, useState } from "react";

import { Alert, Snackbar, Stack } from "@mui/material";

// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";

// components
import { useSelector } from "react-redux";
import ProgressModal from "./components/modal/ProgresModal";
import ScrollToTop from "./components/scroll-to-top";
import { useSubscribeToEventsQuery } from "./redux/features/socket/socketApi";
// Modify your processReducer to handle actions
const processReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROCESS":
      const { fileName, name, ...rest } = action.payload;
      return {
        ...state,
        [fileName]: {
          ...state[fileName],
          [name]: { fileName, name, ...rest },
        },
      };
    case "RESET_PROCESS":
      return {};
    default:
      return state;
  }
};

export default function App() {
  useSubscribeToEventsQuery();
  const [wsResponse, setWsResponse] = useState(null);
  // const [process, setProcess] = useState({});
  const [process, dispatch] = useReducer(processReducer, {});
  const data = useSelector((state) => state.socket);
  // Modify your useEffect to dispatch an action with a type and payload
  useEffect(() => {
    dispatch({ type: "SET_PROCESS", payload: data.process });
  }, [data]);

  console.log(process, "process rom app", data.process, "data process");

  return (
    <ThemeProvider>
      <ScrollToTop />
      {/* <StyledChart /> */}
      <Router />

      <Stack>
        <Snackbar
          open={!!wsResponse}
          autoHideDuration={5000}
          onClose={() => {
            setWsResponse(null);
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="outlined"
            onClose={() => {
              setWsResponse(null);
            }}
            severity={"success"}
          >
            {wsResponse}
          </Alert>
        </Snackbar>
        <Stack
          direction="column"
          justifyContent="flex-end"
          alignItems="flex-end"
          spacing={2}
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "5px",
            zIndex: 9999,
          }}
        >
          {Object.entries(process).map(([videoId, videoProcess]) =>
            Object.entries(videoProcess).map(
              ([name, process]) =>
                process.status === "processing" && (
                  <ProgressModal
                    key={`${videoId}-${name}`}
                    name={name}
                    fileName={process.fileName}
                    status={process.status}
                    progress={process.progress}
                  />
                )
            )
          )}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}
