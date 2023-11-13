import React, { useEffect, useReducer, useState } from "react";

import { Alert, Snackbar, Stack } from "@mui/material";

// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";

// components
import ProgressModal from "./components/modal/ProgresModal";
import ScrollToTop from "./components/scroll-to-top";
import { useAppContext } from "./contexts/context";
import { NOTIFY_EVENTS } from "./utils/constants";

const processReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROCESS":
      return {
        ...state,
        [action.payload.fileName]: {
          ...state[action.payload.fileName],
          [action.payload.name]: action.payload,
        },
      };
    case "RESET_PROCESS":
      return {};
    default:
      return state;
  }
};

export default function App() {
  const { socket } = useAppContext();
  const [wsResponse, setWsResponse] = useState(null);
  // const [process, setProcess] = useState({});
  const [process, dispatch] = useReducer(processReducer, {});
  const { progress } = useAppContext();

  useEffect(() => {
    if (socket) {
      // console.log("facts", progress);
      // dispatch({ type: "SET_PROCESS", payload: progress });

      socket.on("msg", (msg) => {
        console.log("hello", msg);
        setWsResponse(
          `Video ${msg.title} HLS conversion completed as ${msg.originalname}`
        );
      });

      socket.on("disconnect", () => {
        dispatch({ type: "RESET_PROCESS" });
      });
      socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_INITIAL_DB_INFO, (data) => {
        console.log("NOTIFY_VIDEO_INITIAL_DB_INFO", data);
        // setWsResponse(`${data.message}`);
      });

      socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_UPLOADED, (data) => {
        console.log("NOTIFY_VIDEO_UPLOADED", data);
        setWsResponse(`${data.message}`);
      });

      socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSED, (data) => {
        setWsResponse(`${data.message}`);
      });

      socket.on(
        NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSED,
        (data) => {
          setWsResponse(`${data.message}`);
        }
      );

      socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PUBLISHED, (data) => {
        setWsResponse(`${data.message}`);
      });

      socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_METADATA_SAVED, (data) => {
        console.log("NOTIFY_VIDEO_UPLOADED", data);
        setWsResponse(`${data.message}`);
      });

      socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSING, (data) => {
        console.log("video processing", data);
        dispatch({ type: "SET_PROCESS", payload: data });
      });

      socket.on(
        NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSING,
        (data) => {
          console.log("NOTIFY_VIDEO_CONVERTED", data);
          dispatch({ type: "SET_PROCESS", payload: data });
        }
      );

      socket.on(NOTIFY_EVENTS.NOTIFY_AWS_S3_UPLOAD_PROGRESS, (data) => {
        console.log("NOTIFY_AWS_S3_UPLOAD_PROGRESS", data);
        dispatch({ type: "SET_PROCESS", payload: data });
      });

      // unsubscribe from event for preventing memory leaks
      return () => {
        socket.off("msg");
        socket.off("disconnect");
        socket.off(NOTIFY_EVENTS.NOTIFY_VIDEO_UPLOADED);
        socket.off(NOTIFY_EVENTS.NOTIFY_VIDEO_METADATA_SAVED);
        socket.off(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSING);
        socket.off(NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSING);
        socket.off(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSED);
        socket.off(NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSED);
        socket.off(NOTIFY_EVENTS.NOTIFY_AWS_S3_UPLOAD_PROGRESS);
        socket.off(NOTIFY_EVENTS.NOTIFY_VIDEO_PUBLISHED);
      };
    }
  }, [socket, progress]);

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
