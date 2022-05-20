import React, { createContext, useState } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {

    const [successfulLogin, setSuccessfulLogin] = useState(false)
    const [menuUser, setMenuUser] = useState(' ')

    return (
        <DataContext.Provider value={{
            successfulLogin, setSuccessfulLogin,
            menuUser,setMenuUser
        }}>
            {children}
            </DataContext.Provider>
    )
}

export default DataContext;