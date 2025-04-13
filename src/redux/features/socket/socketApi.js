import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { io } from "socket.io-client";
import { NOTIFY_EVENTS } from "../../../utils/constants";
import { apiSlice } from "../api/apiSlice";
import { setVideoMetaData } from "../video/videoSlice";
import { resetAllProcesses, setConnected, setProcess, setWsResponse } from "./socketSlice";

let socket; // Declare socket variable outside of the function

export function connectSocket(userId, dispatch) {
    if (!userId) return;
    if (socket && socket.connected) return;
    
    // Determine the appropriate server URL based on environment
    const isProduction = window.location.hostname !== 'localhost';
    const baseUrl = isProduction 
        ? 'https://api.178.128.81.174.nip.io' 
        : (import.meta.env.VITE_BASE_URL || 'http://localhost:8000');
    
    // Configure socket connection
    socket = io(baseUrl, {
        reconnectionAttempts: 7,
        transports: ['websocket', 'polling'],
        path: '/socket.io',
        query: { userId }
    });
    // --- Centralized Logging ---
    // Log any event received
    socket.onAny((eventName, ...args) => {
        console.log(`SOCKET EVENT RECEIVED: ${eventName}`, args);
    });
    // Connection event handlers
    socket.on("connect_error", (error) => {
        console.error('Socket connection error:', error.message);
    });

    socket.on("msg", (msg) => {
        console.log("hello", msg);
        dispatch(setWsResponse(
            `Video ${msg.title} HLS conversion completed as ${msg.originalname}`
        ));
    });

    socket.on("connect", () => {
        if (socket.connected) {
            dispatch(setConnected(true));
            dispatch(resetAllProcesses(false));
        }
    });

    socket.on("disconnect", () => {
        if (!socket.connected) {
            dispatch(resetAllProcesses(true));
            dispatch(setConnected(false));
        }
    });

    socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_UPLOADED, (data) => {
        dispatch(
            setWsResponse(data)
        )
    });

    socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_INITIAL_DB_INFO, (data) => {
        console.log(data, 'data from NOTIFY_VIDEO_INITIAL_DB_INFO');
        dispatch(
            setWsResponse(data)
        )
        dispatch(
            setVideoMetaData(data.data)
        )
    });
    socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSED, (data) => {
        dispatch(
            setWsResponse(data)
        )
    });

    socket.on(
        NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSED,
        (data) => {
            dispatch(
                setWsResponse(data)
            )
        }
    );

    socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PUBLISHED, (data) => {
        dispatch(
            setWsResponse(data)
        )
        dispatch(
            apiSlice.util.invalidateTags(['Video'])
        )
    });

    socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_METADATA_SAVED, (data) => {
        dispatch(
            setWsResponse(data)
        )
    });

    socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_PROCESSING, (data) => {
        dispatch(
            setProcess(data)
        );
    });

    socket.on(
        NOTIFY_EVENTS.NOTIFY_EVENTS_VIDEO_BIT_RATE_PROCESSING,
        (data) => {
            dispatch(
                setProcess(data)
            );
        }
    );

    socket.on(NOTIFY_EVENTS.NOTIFY_AWS_S3_UPLOAD_PROGRESS, (data) => {
        dispatch(
            setProcess(data)
        );
    });

    socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_THUMBNAIL_GENERATED, (data) => {
        dispatch(
            setWsResponse(data)
        );
        dispatch(
            apiSlice.util.invalidateTags(['Video'])
        )
    });

    socket.on("reconnect", (attemptNumber) => {
        console.log(`Socket reconnected after ${attemptNumber} attempts`);
        // Reset all processes when reconnecting to ensure we get fresh state
        dispatch(resetAllProcesses(false));
        dispatch(setConnected(true));
    });

    socket.on("reconnect_error", (error) => {
        console.error('Socket reconnection error:', error.message);
        // Consider marking some processes as failed at this point
    });

    socket.on("reconnect_failed", () => {
        console.error('Socket reconnection failed after max attempts');
        // Clean up all processes since we've failed to reconnect
        dispatch(resetAllProcesses(true));
    });

    // unsubscribe from event for preventing memory leaks
    return () => {
           // Remove the central logger
           socket.offAny();
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

export const socketApi = createApi({
    reducerPath: "socketApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: (builder) => ({
        subscribeToEvents: builder.query({
            async queryFn({ userId }) {
                if (!userId) return { data: null };

                // Use the same URL determination logic
                const isProduction = window.location.hostname !== 'localhost';
                const baseUrl = isProduction 
                    ? 'http://178.128.81.174' 
                    : (import.meta.env.VITE_BASE_URL || 'http://localhost:8000');
                
                socket = io(baseUrl, {
                    transports: ["websocket"],
                    path: '/socket.io',
                    query: { userId }
                });

                socket.on("connect_error", (error) => {
                    console.error('Socket connection error (queryFn):', error.message);
                });

                socket.on("connect", () => {
                    console.log("Connected to socket server");
                });

                socket.on("disconnect", () => {
                    console.log("Disconnected from socket server");
                });

                socket.on(NOTIFY_EVENTS.NOTIFICATION, (data) => {
                    console.log("Notification received:", data);
                });

                return { data: null };
            },
        }),
    })
});

export { socket };

export function disconnectSocket() {
    if (socket && socket.connected) {
        socket.disconnect();
        setConnected(false);
    }
}

export const { useSubscribeToEventsQuery } = socketApi;