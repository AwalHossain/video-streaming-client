import React, { createContext, useContext, useMemo, useState } from 'react';
import { io } from 'socket.io-client';




const AppContext = createContext({
  socket: null,
  progress: 0,
  setProgress: () => { },
});

export const AppProvider = ({ children }) => {
  const [progress, setProgress] = useState(0); // Progress bar state
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(true);

  useMemo(() => {
    const newSocket = io('http://127.0.0.1:5000');

    newSocket.on('connect', () => {
      setSocket(newSocket);
      setLoading(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);


  return (
    <AppContext.Provider value={{ socket, progress, setProgress }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};