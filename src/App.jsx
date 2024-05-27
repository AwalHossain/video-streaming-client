import React from "react";

import { Box, Stack } from "@mui/material";

// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";

import { useSelector } from "react-redux";

import ProgressModalContainer from "./components/modal/ProgressModalContainer";
import ScrollToTop from "./components/scroll-to-top";
import Loading from "./components/ui/Loading";
import { ProgressProvider } from "./contexts/ProgressContext";
import useAuth from "./hooks/useAuth";
import { useSubscribeToEventsQuery } from "./redux/features/socket/socketApi";
import NotificationBar from "./utils/NotificationBar";
export default function App() {
  const { loading } = useAuth();
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user._id : null;
  useSubscribeToEventsQuery({ userId });
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
          <ProgressModalContainer />
        </ProgressProvider>
      </Stack>
    </ThemeProvider>
  );
}
