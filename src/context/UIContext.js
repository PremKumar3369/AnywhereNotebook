import { createContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <UIContext.Provider value={{ loading, setLoading }}>
      {children}
    </UIContext.Provider>
  );
};

export default UIContext;
