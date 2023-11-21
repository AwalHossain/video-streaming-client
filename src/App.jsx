import React, { useState } from "react";

import { Alert, Snackbar, Stack } from "@mui/material";

// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";

// components
import ProgressModals from "./components/modal/ProgressModals";
import ScrollToTop from "./components/scroll-to-top";
import { ProgressProvider } from "./contexts/ProgressContext";
// Modify your processReducer to handle actions
// const processReducer = (state, action) => {
//   switch (action.type) {
//     case "SET_PROCESS":
//       const { fileName, name, ...rest } = action.payload;
//       return {
//         ...state,
//         [fileName]: {
//           ...state[fileName],
//           [name]: { fileName, name, ...rest },
//         },
//       };
//     case "RESET_PROCESS":
//       return {};
//     default:
//       return state;
//   }
// };

export default function App() {
  const [wsResponse, setWsResponse] = useState(null);
  // // const [process, setProcess] = useState({});
  // const [process, dispatch] = useReducer(processReducer, {});
  // const data = useSelector((state) => state.socket);
  // // Modify your useEffect to dispatch an action with a type and payload
  // useEffect(() => {
  //   dispatch({ type: "SET_PROCESS", payload: data.process });
  // }, [data]);

  console.log("process", "process rom app", "data process");

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
        <ProgressProvider>
          <ProgressModals />
        </ProgressProvider>
      </Stack>
    </ThemeProvider>
  );
}
