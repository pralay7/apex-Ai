'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "@/context/UserContext"
import { Progress } from "@/components/ui/progress"
import { useAuth, UserButton } from "@clerk/nextjs"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"

export function AppSidebar() {
  const{userData}= useContext(UserContext)
  const [projectList, setProjectList]= useState([])
    const {has}=useAuth()
    const hasUnlimiteAcess = has&&has({plan:'unlimited'})

  const getProjects=async()=>{
    try {
      const result= await axios.get('/api/allprojects')
      setProjectList(result.data)
      console.log(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getProjects()
  },[])

  return (
    //ei gulo sob ekta ekta part side bar tar 
    // ei baar ami ei tag gulor moddhe nider jinis add korte paari
    <Sidebar>
      <div className="flex justify-center items-center gap-4 ">
        <Image src={'/logo.svg'} alt="logo" height={20} width={20} />
        <p className="font-bold text-xl">Apex AI</p>
      </div>
      <Link className="mt-5 w-full" href={'/workspace'}>
      <Button className="w-full">+ Add New Project</Button>
      </Link>
      <SidebarHeader>

      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        {projectList.length===0&&<h2 className="text-sm text-gray-500 px-2">No Projects Found</h2>}
        <div>

            {projectList.length>0?projectList?.map((item , index)=>{
          return (
              //@ts-ignore
            <Link href={`playground/${item.projectId}?frameId=${item.frameId}`} className="my-2 hover:bg-secondary p-2">
              {/* @ts-ignore */}
              <h2 className="line-clamp-1 ">{item.chats[0].chatMessages[0].content}</h2>
            </Link>
          )
        }): 
    [1, 2, 3, 4, 5].map((_, index) => (
        <Skeleton className="w-full h-5 rounded-lg mt-2" />
    ))
        
        
        }
        </div>
        
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        {!hasUnlimiteAcess&&<div className=" p-3 bg-secondary space-y-2 rounded-xl">
          {userData&&<span className="flex justify-between items-center font-bold">Remaining credits <p>{userData.credits}</p></span>}
          <Progress value={(userData?.credits/2)*100 }/>

          <Link href={'/workspace/pricing'}>
          <Button className="w-full">Upgrade to unlimited</Button>
          </Link>

          
        </div>}
        <div className= "flex items-center gap-3">
          <UserButton/>
          <Button variant={'ghost'}>Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}