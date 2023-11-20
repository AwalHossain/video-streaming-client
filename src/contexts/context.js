import React, { createContext, useContext, useState } from 'react';




const AppContext = createContext({
  socket: null,
  progress: 0,
  setProgress: () => { },
});

export const AppProvider = ({ children }) => {
  const [progress, setProgress] = useState(0); // Progress bar state
  const [socket, setSocket] = useState();
  const [loading, setLoading] = useState(true);

  return (
    <AppContext.Provider value={{ progress, setProgress }}>
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