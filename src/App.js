import React from "react";

import { Box, Stack } from "@mui/material";

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
import NotificationBar from "./utils/NotificationBar";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <ThemeProvider>
      <ScrollToTop />
      <Router />

      <Stack>
        <NotificationBar />
        <ProgressProvider>
          <ProgressModals />
        </ProgressProvider>
      </Stack>
    </ThemeProvider>
  );
}
