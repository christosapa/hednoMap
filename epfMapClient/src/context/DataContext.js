import React, { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {

    const [successfulLogin, setSuccessfulLogin] = useState(false)

    return (
        <DataContext.Provider value={{
            successfulLogin, setSuccessfulLogin
        }}>
            {children}
            </DataContext.Provider>
    )
}

export default DataContext;