'use client'
import React, { useEffect, useState } from 'react'

//@ts-ignore
import Playgroundheader from '../_components/PlayGroundHeader'
import ChatSection from '../_components/ChatSection'
import WebsiteDesigne from '../_components/WebsiteDesigne'
import SettingSection from '../_components/SettingSection'
import { useParams, useSearchParams } from 'next/navigation'
import axios from 'axios'

export type Frame={
    projectId:string,
    frameId:string,
    designeCode:string,
    chatMessages:Messages[]
}
export type Messages={
    role:string,
    content:string
}
const Prompt=`userInput: {userInput}
Based on the user input, generate a complete HTML Tailwind CSS code using Flowbite UI components. Use a modern design with blue as the primary color theme. 

IMPORTANT: 
        -Return the code inside a markdown code block starting with \`\`\`html and ending with \`\`\`.
Condition 1: If the input is a greeting (e.g., "Hi", "Hello") or a general question, simply reply with a helpful text message and DO NOT generate any code.

Condition 2: If the input is a design request (e.g., "Create a dashboard", "Make the button blue"), generate the complete HTML code following the rules below.
Requirements(if generating code):
- All primary components must match the theme color.
- Add proper padding and margin for each element.
- Components should not be connected to one another; each element should be independent.
- Design must be fully responsive for all screen sizes.
- Use placeholders for all images for light mode: https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg and for dark mode use: https://www.cibaky.com/wp-content/uploads/2015/12/placeholder-3.jpg
- For image, add alt tag with image prompt for that image.
- Do not include broken links.
- Library already install so do not install or add in script.
- Header menu options should be spread out and not connected.

Use the following component where appropriate:
- fa fa icons
- Flowbite for UI components like buttons, modals, forms, tables, tabs, and alerts, cards, dialog, dropdown, etc.
- Chart.js for charts & graphs.
- Swiper.js for sliders/carousels.
- tooltip & Popover library (Tippy.js).

Additional requirements:
- Ensure proper spacing, alignment, and hierarchy for all elements.
- Include interactive components like modals, dropdowns, and accordions where suitable.
- Ensure charts are visually appealing and match the theme color.
- Enclose the code strictly inside html and closing tags.
- Output a complete, ready-to-use HTML page.
`

const PlayGround = () => {
    const{projectId}=useParams()
    const params= useSearchParams();
    const frameId = params.get('frameId');
    const [frameDetail,setFrameDetail]=useState<any>(null)
    const[isLoading,setIsLoading]= useState<boolean>(false)
    const[messages,setMessages]= useState<Messages[]>([])
    const [generatedCode,setGeneratedCode]=useState<any>('')
    console.log(projectId)
    const getFrameDetails=async()=>{
        try {
            const result= await axios.get('/api/frame?frameId='+frameId)
            console.log(result.data.chatMessages)
            setFrameDetail(result.data)

            const designeCode= result.data?.designeCode
            const index =designeCode.indexOf('```html')+7
            const initialCodeChunk=designeCode.slice(index).replace('```', '') 

            setGeneratedCode(initialCodeChunk)

            if (result.data?.chatMessages?.length == 1) {
            const userMsg = result.data?.chatMessages[0].content;
            SendMessages(userMsg)
            }else{
                setMessages(result.data?.chatMessages)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const SendMessages=async(input:string)=>{
        setGeneratedCode("")
        setIsLoading(true)
        setMessages((prev:any)=>[
            ...prev,
            {role:'user',content:input}
        ])
        const result = await fetch('/api/ai-model',{
            method:'POST',
            body:JSON.stringify({
                messages:[...messages,{role:'user',content:Prompt?.replace('{userInput}',input)}]
            })
           
        })
        if (!result.ok) {
            if (result.status === 429) {
                alert("Too many requests! Please wait a moment before sending another message.");
            } else {
                alert(`Error: ${result.statusText}`);
            }
            setIsLoading(false);
            return; // Stop execution here
        }
        const reader = result.body?.getReader();
        const decoder = new TextDecoder();

        let aiResponse = '';
        let isCode = false;

        while (true){
            //@ts-ignore
            const{done,value}= await reader?.read()
            if(done) break;
            const chunk = decoder.decode(value,{stream:true})
            aiResponse+=chunk
            //check if the response sent is code
            if(!isCode &&aiResponse.includes('```html')){
                isCode=true 
                const index=aiResponse.indexOf('```html')+7
                const initialCodeChunk=aiResponse.slice(index)
                //these two lines are basically removing tthe html tag
                //now to store it we need states 
                setGeneratedCode((prev:any)=>prev+initialCodeChunk )
                
            }
            else if(isCode){
                if (chunk.includes('```')) {
                    const cleanChunk = chunk.replace('```', '');
                    setGeneratedCode((prev: any) => prev + cleanChunk);
                    // Optional: stop adding to generatedCode here if you want
                    
                } else {
                  setGeneratedCode((prev: any) => prev + chunk);
                }
            }
            
        }
        await saveCode(aiResponse)

        if(!isCode){
                setMessages((prev:any)=>[
                    ...prev,{role:'assistant',content:aiResponse}
                ])
            }
            else{
                setMessages((prev:any)=>[
                    ...prev,{role:'assistant',content:'your code is ready'}
                ])
            }
        setIsLoading(false)
             
    }
    const loadMessages=async ()=>{
        try{
            const result= await axios.put('/api/chats',{messages:messages,frameId:frameId}) 
            console.log(result.data)
        }
        catch(error){

        }
    }

    const saveCode=async(Code:string)=>{
        try{const result = await axios.put('/api/frame',
            {
                frameId:frameId,
                projectId:projectId,
                generatedCode:Code
            }
        
        )
        console.log(result.data)
    }
        catch(error){
            console.log(error)
        }
    }
    
    useEffect(()=> {
        if(messages.length>0&&!isLoading){
            loadMessages()
        }
    },[messages])
    useEffect(()=>{
        frameId&&getFrameDetails()
    },[frameId])
  return (
    <div>
        <Playgroundheader/>
        {/* chat section */}
        <div className='flex justify-between'>

        <ChatSection messages={messages??[]} onSend={(input:string)=>SendMessages(input)} isLoading={isLoading}/>
        {/* website designe */}
        <WebsiteDesigne generatedCode={generatedCode}/>
        {/* setting section */}
        {/* <SettingSection/> */}
        </div>
    </div>
  )
}

export default PlayGround