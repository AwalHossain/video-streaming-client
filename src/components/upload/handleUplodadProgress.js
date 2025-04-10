import axios from "axios";
import _ from 'lodash';
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../../redux/features/utils/notificationSlice";
import REACT_APP_API_URL from "../../utils/apiUrl";

// Create a simple EventEmitter implementation for the browser
class BrowserEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
    return this;
  }

  removeListener(event, listener) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
    return this;
  }

  // Add the off method as an alias for removeListener
  off(event, listener) {
    return this.removeListener(event, listener);
  }

  removeAllListeners(event) {
    if (event) {
      this.events[event] = [];
    } else {
      this.events = {};
    }
    return this;
  }
}

export const progressEmitter = new BrowserEventEmitter();

export const useUpload = () => {
    const dispatch = useDispatch();
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState(null);

    const upload = async (values) => {
        setUploading(true);
        setData(null);
        const { video } = values; // Assuming image might be handled later
        const videoFile = video;
        const originalFileName = videoFile.name;
        const contentType = videoFile.type;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            dispatch(setMessage({ message: 'Authentication token not found.', severity: 'error' }));
            setUploading(false);
            return;
        }

        const apiConfig = {
            headers: { Authorization: token },
            withCredentials: "include",
        };

        const throttledEmitProgress = _.throttle((progress) => {
            progressEmitter.emit('progress', progress);
        }, 1000); // Throttle progress updates

        try {
            // --- Step 1: Get Pre-signed URL ---
            // progressEmitter.emit('progress', {
            //     status: 'uploading', name: "Preparing Upload", fileName: originalFileName, progress: 0,
            // });
            const presignedUrlResponse = await axios.post(
                `${REACT_APP_API_URL}/videos/presigned-url`,
                { filename: originalFileName, contentType },
                apiConfig
            );

            const { uploadUrl, fileKey, bucketName, fileName } = presignedUrlResponse.data.data;

            if (!uploadUrl) {
                throw new Error("Failed to get pre-signed URL.");
            }

             // Emit initial progress before starting PUT upload
             throttledEmitProgress({
                status: 'uploading',
                name: "Uploading Video",
                fileName: originalFileName, // Show original name in progress
                progress: 0,
            });


            // --- Step 2: Upload file to Pre-signed URL (DO Space) ---
            const uploadConfig = {
                headers: { 'Content-Type': contentType },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percent = total ? Math.floor((loaded * 100) / total) : 0;
                    throttledEmitProgress({
                        status: 'uploading',
                        name: "Uploading Video",
                        fileName: originalFileName, // Show original name in progress
                        progress: percent,
                    });
                }
            };
            await axios.put(uploadUrl, videoFile, uploadConfig);

            // Emit completion for the upload part
             throttledEmitProgress.flush(); // Ensure the last progress update is sent
             progressEmitter.emit('progress', {
                status: 'completed', // Mark upload as completed
                name: "Uploading Video",
                fileName: originalFileName,
                progress: 100,
             });


            // --- Step 3: Confirm Upload with Backend ---
            // progressEmitter.emit('progress', {
            //       status: 'uploading', name: "Confirming Upload", fileName: originalFileName, progress: 100, // Indicate confirmation step
            // });

            const confirmUploadResponse = await axios.post(
                `${REACT_APP_API_URL}/videos/confirm-upload`,
                { originalName: originalFileName, fileName, fileKey, bucketName },
                apiConfig
            );

            setData(confirmUploadResponse.data);

            // Clean up this specific upload process state from the UI progress tracker
             progressEmitter.emit('progress', {
                status: 'completed', name: "Confirming Upload", fileName: originalFileName, progress: 100
             });
             // Allow a brief moment for the "completed" status to show before potentially clearing
             setTimeout(() => {
                 progressEmitter.emit('progress', { status: 'finished', name: "Uploading Video", fileName: originalFileName });
                 progressEmitter.emit('progress', { status: 'finished', name: "Confirming Upload", fileName: originalFileName });
                 progressEmitter.emit('progress', { status: 'finished', name: "Preparing Upload", fileName: originalFileName });
             }, 2000); // Clear after 2 seconds

            return confirmUploadResponse.data;

        } catch (error) {
            console.error("Upload failed:", error);
            const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred during upload.';
            dispatch(
                setMessage({
                    message: `Upload failed: ${errorMessage}`,
                    severity: 'error',
                })
            );
             // Emit a failed status to potentially clear/update the UI progress
             progressEmitter.emit('progress', {
                status: 'failed',
                name: "Video Upload", // General failure
                fileName: originalFileName,
                progress: 0, // Reset progress or keep last known? Resetting might be clearer.
             });
            // Clean up failed states after a delay
             setTimeout(() => {
                 progressEmitter.emit('progress', { status: 'finished', name: "Uploading Video", fileName: originalFileName });
                 progressEmitter.emit('progress', { status: 'finished', name: "Confirming Upload", fileName: originalFileName });
                 progressEmitter.emit('progress', { status: 'finished', name: "Preparing Upload", fileName: originalFileName });
                 progressEmitter.emit('progress', { status: 'finished', name: "Video Upload", fileName: originalFileName });
            }, 5000); // Clear after 5 seconds


        } finally {
             throttledEmitProgress.cancel(); // Cancel any pending throttled calls
            setUploading(false);
        }
    }

    return { upload, uploading, data };
};