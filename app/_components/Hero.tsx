'use client'
import { Button } from '@/components/ui/button'
import { UserContext } from '@/context/UserContext'
import { SignInButton, useAuth, useUser } from '@clerk/nextjs'
import axios from 'axios'
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, Loader2Icon, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
const suggestion = [
  {
    label: 'Dashboard',
    prompt: 'Create an analytics dashboard to track customers and revenue data for a SaaS',
    icon: LayoutDashboard
  },
  {
    label: 'SignUp Form',
    prompt: 'Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox',
    icon: Key
  },
  {
    label: 'Hero',
    prompt: 'Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect,',
    icon: HomeIcon
  },
  {
    label: 'User Profile Card',
    prompt: 'Create a modern user profile card component for a social media website',
    icon: User
  }
]

const Hero = () => {
    const [input,setInput]= useState<string>()
    const router = useRouter()
    const [isLoading, setIsLoading]=useState(false)
    const {userData,setUserdata}= useContext(UserContext)
    const {has}=useAuth()

    const hasUnlimiteAcess = has&&has({plan:'unlimited'})
    const createNewProject= async()=>{
      setIsLoading(true)
      const projectId= uuidv4();
      const frameId= generateRandomFrameNumber();
      const messages= [{
        role:'user',
        content:input
      }]
      try {
        const project=await axios.post('/api/projects',{
          projectId:projectId,
          frameId:frameId,
          messages:messages,
          credits:userData?.credits
        
        })
        toast.success('project created')
        router.push(`/playground/${projectId}?frameId=${frameId}`)
        setUserdata((prev:any)=>({...prev
          ,credits:prev.credits-1}))
        setIsLoading(false)

      } catch (error) {
        toast.error('internal server error')
       console.log(error) 
      }
    }
    if(!hasUnlimiteAcess && userData?.credits!<=0){
      toast.error('You have no credits left. Please upgrade your plan.')
        return;
  }

  return (
    <div className='flex flex-col items-center py-33 justify-center px-4'>
        {/*  header and description*/}
        <h2 className='font-bold text-3xl md:text-6xl text-center'>
            What should we design?
        </h2>
        <p className='mt-2 text-lg text-xs md:text-xl text-gray-500 text-center'>Generate, Edit and Explore with Ai,Export code as well</p>
        {/* input */}
        <div className=' w-full max-w-xl  p-5 border mt-5 rounded-2xl'>
            <textarea onChange={(e)=>{setInput(e.target.value)}} className='w-full h-24 focus:outline-none focus:ring-0 resize-none' placeholder='Innovate' value={input} name="" id=""></textarea>
            <div className='flex justify-between'>
                 <Button variant={'ghost'} ><ImagePlus/></Button>
            <SignInButton mode='modal'>
              <Button disabled={!input ||isLoading} onClick={createNewProject} >
                {isLoading?<Loader2Icon className='animate-spin'/>:<ArrowUp/>}</Button>
            </SignInButton>
            
            </div>
        
        
           
        </div>
        {/* suggestions */}
        <div className='mt-4 flex gap-3'>
            {suggestion.map((item,index)=>{
                return (
                    <Button onClick={()=>{setInput(item.prompt)}} variant={'outline'} key={index}>
                        <item.icon/>{item.label}
                    </Button>
                )
            })}
        </div>
    </div>
  )
}

export default Hero

const generateRandomFrameNumber=()=>{
  const num= Math.floor(Math.random()*10000)
  return num;
}