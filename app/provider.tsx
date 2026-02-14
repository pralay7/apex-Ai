'use client'
import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { useUser } from '@clerk/nextjs';
//@ts-ignore 
import { UserContext } from '@/context/UserContext';
import { OnSaveContext } from '@/context/OnSaveContext';

const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const[userData,setUserdata]=useState<any>(null)
  const[onSave,setOnSave]=useState<any>(null) 
  const {user}= useUser()
  const createNewUser= async()=>{
    const result= await axios.post("/api/users",({

    }))
    console.log(result.data)
    setUserdata(result.data?.user)
  }
  
  useEffect(()=>{
    if(user ){

      createNewUser()
    }
  },[user])
  return (
    <div>
      <UserContext.Provider value={{userData,setUserdata}}>
        <OnSaveContext.Provider value={{onSave,setOnSave}}>

        {children}
        </OnSaveContext.Provider>
      </UserContext.Provider>
      </div>
  )
}

export default Provider