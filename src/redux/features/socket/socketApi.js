import { io } from "socket.io-client";
import { NOTIFY_EVENTS } from "../../../utils/constants";
import { apiSlice } from "../api/apiSlice";
import { setVideoMetaData } from "../video/videoSlice";
import {
  resetProcess,
  setConnected,
  setProcess,
  setWsResponse,
} from "./socketSlice";

let socket; // Declare socket variable outside of the funct

export function connectSocket(userId, dispatch) {
  console.log(userId, "userId from connectSocket");
  if (!userId) return;
  if (socket && socket.connected) return; // Add this line to prevent reconnecting every time the function is called
  socket = io(`${process.env.REACT_APP_BASE_URL}?userId=${userId}`, {
    reconnectionAttempts: 7,
  });

  socket.on("msg", (msg) => {
    console.log("hello", msg);
    setWsResponse(
      `Video ${msg.title} HLS conversion completed as ${msg.originalname}`
    );
  });

  socket.on("connect", () => {
    if (socket.connected) {
      dispatch(setConnected(true));
      dispatch(resetProcess(false));
    }
  });

  socket.on("disconnect", () => {
    if (!socket.connected) {
      dispatch(resetProcess(true));
      dispatch(setConnected(false));
    }
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_UPLOADED, (data) => {
    dispatch(setWsResponse(data));
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_INITIAL_DB_INFO, (data) => {
    console.log(data, "data from NOTIFY_VIDEO_INITIAL_DB_INFO");
    dispatch(setWsResponse(data));
    dispatch(setVideoMetaData(data.data));
  });
  socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSED, (data) => {
    dispatch(setWsResponse(data));
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSED, (data) => {
    dispatch(setWsResponse(data));
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PUBLISHED, (data) => {
    dispatch(setWsResponse(data));
    dispatch(apiSlice.util.invalidateTags(["Video"]));
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_METADATA_SAVED, (data) => {
    dispatch(setWsResponse(data));
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSING, (data) => {
    dispatch(setProcess(data));
  });
  socket.on(NOTIFY_EVENTS.NOTIFT_VIDEO_UPLOADING_BUCKET, (data) => {
    dispatch(setProcess(data));
  });
  socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_DOWNLOADING, (data) => {
    dispatch(setProcess(data));
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSING, (data) => {
    dispatch(setProcess(data));
  });

  socket.on(NOTIFY_EVENTS.NOTIFY_AWS_S3_UPLOAD_PROGRESS, (data) => {
    dispatch(setProcess(data));
  });

  // unsubscribe from event for preventing memory leaks
  return () => {
    socket.off("connect");
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

export const socketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribeToEvents: builder.query({
      queryFn: ({ userId }) => {
        console.log(userId, "userId from onCacheEntryAdded");

        return { data: [] };
      },
    }),
  }),
});

export { socket };

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
    setConnected(false);
  }
}

export const { useSubscribeToEventsQuery } = socketApi;
