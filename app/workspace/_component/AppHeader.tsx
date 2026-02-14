import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const AppHeader = () => {
  return (
    <div className='flex w-full p-2 items-center shadow justify-between'>
        <SidebarTrigger/>
        <UserButton/>
    </div>
  )
}

export default AppHeader