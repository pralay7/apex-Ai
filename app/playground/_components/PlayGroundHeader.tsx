import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { OnSaveContext } from '@/context/OnSaveContext'
import { UserButton, useUser } from '@clerk/nextjs'
import React, { useContext } from 'react'

const Playgroundheader = () => {
  const{onSave,setOnSave}=useContext(OnSaveContext);
  const {isSignedIn}=useUser()
  return (
   <div className='flex w-full p-2 items-center shadow justify-between'>
        <img src={'/Logo.svg'} height={25} width={25} alt="" />
        {isSignedIn?<Button onClick={()=>setOnSave(Date.now())}>Save</Button>:<UserButton/>}
    </div>
  )
}

export default Playgroundheader