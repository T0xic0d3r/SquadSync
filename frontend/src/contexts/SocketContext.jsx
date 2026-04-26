import React, { createContext, useContext } from 'react';

const SocketContext = createContext({ socket: null });

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={{ socket: null }}>
    {children}
  </SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
