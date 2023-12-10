import React, { useState } from "react";

import { Alert, Snackbar, Stack } from "@mui/material";

// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";

// components
import ProgressModals from "./components/modal/ProgressModals";
import ScrollToTop from "./components/scroll-to-top";
import Loading from "./components/ui/Loading";
import { ProgressProvider } from "./contexts/ProgressContext";
import useAuth from "./hooks/useAuth";

export default function App() {
  const [wsResponse, setWsResponse] = useState(null);
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }
  console.log("process", "process rom app", "data process");

  return (
    <ThemeProvider>
      <ScrollToTop />
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
