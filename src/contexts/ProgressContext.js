


import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useSubscribeToEventsQuery } from '../redux/features/socket/socketApi';


const ProgressContext = createContext()

const processReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROCESS":
            const { fileName, name, ...rest } = action.payload;
            return {
                ...state,
                [fileName]: {
                    ...state[fileName],
                    [name]: { fileName, name, ...rest },
                },
            };
        case "RESET_PROCESS":
            return {};
        default:
            return state;
    }
};

export const ProgressProvider = ({ children }) => {
    useSubscribeToEventsQuery();
    const [process, dispatch] = useReducer(processReducer, {});
    const { process: dataProcess } = useSelector((state) => state.socket);
    // Modify your useEffect to dispatch an action with a type and payload
    useEffect(() => {
        dispatch({ type: "SET_PROCESS", payload: dataProcess });
    }, [dataProcess]);

    return (
        <ProgressContext.Provider value={{ process, dispatch }}>
            {children}
        </ProgressContext.Provider>
    )
}


export const useProgress = () => useContext(ProgressContext);