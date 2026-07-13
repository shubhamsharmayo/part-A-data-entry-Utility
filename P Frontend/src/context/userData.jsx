import React, { useContext, createContext,useState } from 'react'

const userContext = createContext()

 export const UserDataProvider = ({ children }) => {
    const [userDetail, setuserDetail] = useState(null)

    const setUser = (data)=>{
        setuserDetail(data)
    }
    return (
        <userContext.Provider
            value={
                {
                    userDetail,
                    setUser
                }
            }
        >
            {children}
        </userContext.Provider>
    )
}

export const userData = () =>{return useContext(userContext)}
