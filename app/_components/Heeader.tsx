'use client'
import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@clerk/nextjs'
import { ArrowRight, Ghost } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const MenuOptions =[
    {
      name:"pricing",
      path:"/pricing"
    },
    {
      name:"contact us",
      path:"/contact-us"
    }
   ]
const Heeader = () => {
   const {isSignedIn}=useUser()
  return (
    <div className='flex items-center justify-between p-4 shadow'> 
      <div className='flex gap-2 items-center'>
        <Image src={'./logo.svg'} alt='logo' height={20} width={20}/>
        <p className='font-bold text-xl py-2'>Apex AI</p>
        
      </div>
      <div className='flex gap-3'>
          {MenuOptions.map((item, index)=>{
           return( <Button variant={'ghost'} key={index}>{item.name}</Button>)
          })

          }
        </div> 
        <div>
          
          <SignInButton mode='modal' forceRedirectUrl={'/workspace'}>
          <Link href={'/workspace'}>
          
            <Button >Get Started<ArrowRight/> </Button>
          </Link>
          </SignInButton>
          
        </div>
    </div>
  )
}
export default Heeader