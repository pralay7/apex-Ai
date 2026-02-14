'use client'
import React, { useState } from 'react'
import {Messages}from '../[projectId]/page'
import { matchesGlob } from 'path'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
type Props ={
  messages:Messages[],
  onSend:any,
  isLoading:boolean
}

const ChatSection = ({messages,onSend,isLoading}:Props) => {
  const[input ,setInput]=useState<string>()
  const handleSend=()=>{
    if(!input?.trim()) return;
    onSend(input)
    setInput('')
  }
  return (
    <div className=' w-96 shadow h-[94vh] flex flex-col'>
      <div className='flex-3 overflow-y-auto p-4 space-x-3  '>
        {
          messages?.length===0?(
            <p className='text-gray-400 text-center'>No messages yet</p>
          ):(
           messages.map((item,index)=>{
            return(
              <div  key={index}
              className={`py-1 flex ${item.role=='user'?'justify-end':'justify-start'}`}>
                <div className={` p-2 rounded-lg max-w-[80%] ${item.role === 'user' 
                    ? "bg-gray-100 text-black" 
                    : "bg-gray-300 text-black"}`}>
                   {item.content}
                </div>
              </div>
            )
           })
          )
        }
      </div>
      {isLoading && (
  <div className='flex justify-center items-center'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800'></div>
    <span className='ml-2 text-zinc-800'>Generating...</span>
  </div>
)}
      <div className='p-3  flex items-center gap-2'>
          <textarea placeholder='Describe your designe' onChange={(e)=>setInput(e.target.value)}
           value={input}
           className='flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2' name="" id=""></textarea>
          <Button onClick={handleSend}><ArrowUp/></Button>
      </div>
    </div>
  )
}

export default ChatSection