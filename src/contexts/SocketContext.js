import React, { createContext, useContext, useMemo, useState } from 'react';
import { io } from 'socket.io-client';




const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
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

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  const stopSocket = () => {
    // if socket isn't availabe 
    if (!socket) {
      return
    }
  }

  return (
    <SocketContext.Provider value={{ socket, stopSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error('Socket context not found');
  }

  return socket;
};
