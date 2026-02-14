import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const pricing = () => {
  return (
    <div className='w-full flex flex-col items-center min-w-3xl justify-center h-screen'>
        <h2 className='font-bold text-3xl my-2'>Pricing</h2>
        <div className='flex w-[800px]'>
            <PricingTable/>
        </div>
    </div>
  )
}

export default pricing