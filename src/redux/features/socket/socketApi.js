import { io } from "socket.io-client";
import { NOTIFY_EVENTS } from "../../../utils/constants";
import { apiSlice } from "../api/apiSlice";
import { setVideoMetaData } from "../video/videoSlice";
import { resetProcess, setProcess, setWsResponse } from "./socketSlice";



export const socketApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        subscribeToEvents: builder.query({
            queryFn: () => ({ data: [] }),

            async onCacheEntryAdded(arg, {
                updateCachedData,
                dispatch,
                getState,
                cacheDataLoaded,
                cacheEntryRemoved
            }) {
                const socket = io(process.env.REACT_APP_BASE_URL, {
                    reconnectionAttempts: 7,
                });

                socket.on("msg", (msg) => {
                    console.log("hello", msg);
                    setWsResponse(
                        `Video ${msg.title} HLS conversion completed as ${msg.originalname}`
                    );
                });

                socket.on("disconnect", () => {
                    if (!socket.connected) {
                        dispatch(resetProcess());
                    }
                });
                socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_INITIAL_DB_INFO, (data) => {
                    console.log("NOTIFY_VIDEO_INITIAL_DB_INFO", data);
                    dispatch(
                        setWsResponse(data)
                    )
                    dispatch(
                        setVideoMetaData(data.data)
                    )
                });

                socket.on(NOTIFY_EVENTS.NOTIFY_VIDEO_UPLOADED, (data) => {
                    console.log("NOTIFY_VIDEO_UPLOADED", data);
                    dispatch(
                        setWsResponse(data)
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
                    console.log("NOTIFY_AWS_S3_UPLOAD_PROGRESS", data);
                    dispatch(
                        setProcess(data)
                    );
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
        })
    })
})


export const { useSubscribeToEventsQuery } = socketApi;