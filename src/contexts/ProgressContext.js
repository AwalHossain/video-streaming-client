


import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import { progressEmitter } from '../components/upload/handleUplodadProgress';


const ProgressContext = createContext({
    process: {},
    dispatch: () => { }
});

const processReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROCESS":
            const { fileName, name, ...rest } = action.payload || {};
            if (!fileName) return state;
            return {
                ...state,
                [fileName]: {
                    ...state[fileName],
                    [name]: { fileName, name, ...rest },
                },
            };
        case "RESET_PROCESS":
            return {
            };
        default:
            return state;
    }
};

export const ProgressProvider = ({ children }) => {
    const [process, dispatch] = useReducer(processReducer, {});
    const dataProcess = useSelector((state) => state.socket.process);
    const [uploadProgress, setUploadProgress] = useState(null);

    useEffect(() => {
        const handleProgress = (data) => {
            setUploadProgress(data);
        }

        progressEmitter.on('progress', handleProgress);

        return () => {
            progressEmitter.off('progress', handleProgress);
        }

    }, [])

    // Modify your useEffect to dispatch an action with a type and payload
    useEffect(() => {
        if (uploadProgress) {
            dispatch({ type: "SET_PROCESS", payload: uploadProgress });
        }
        if (dataProcess) {
            dispatch({ type: "SET_PROCESS", payload: dataProcess });
        }

        // if (!dataProcess || !uploadProgress) {
        //     dispatch({ type: "RESET_PROCESS", payload: {} });
        // }

    }, [dataProcess, uploadProgress]);

    return (
        <ProgressContext.Provider value={{ process, dispatch }}>
            {children}
        </ProgressContext.Provider>
    )
}


export const useProgress = () => useContext(ProgressContext);