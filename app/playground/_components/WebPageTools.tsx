import { Button } from '@/components/ui/button'
import { Code2Icon, Download, Monitor, SquareArrowUpRight, TabletSmartphone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import ViewCodeBlock from './ViewCodeBlock'
const HTML=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
    <title>AI Website Builder</title>

    <script src="https://cdn.tailwindcss.com"></script>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

    <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
    <script src="https://unpkg.com/@popperjs/core@2"></script>
    <script src="https://unpkg.com/tippy.js@6"></script>
</head>
<body id="root">
{code}
</body>
</html>`
const WebPageTools = ({selectedScreenSize,setSelectedScreenSize,generatedCode}:any) => {

    const[code, setCode]= useState<string>('')
    //setCode(generatedCode)
    const viewInNewTab= ()=>{
        if(!generatedCode)return;
        const cleanCode=(HTML.replace('{code}',generatedCode)||' ').replaceAll("```html",'')
        .replaceAll('```','').replaceAll('html','')
        
        const blob =new Blob([cleanCode],{type:'text/html'})
        const url = URL.createObjectURL(blob)

        window.open(url,'_blank')
    }
useEffect(()=>{
    if(generatedCode){
        const cleanCode=(HTML.replace('{code}',generatedCode)||' ').replaceAll("```html",'')
        .replaceAll('```','').replaceAll('html','')
        setCode(cleanCode);
    }
},[generatedCode])

const downloadCode = () => {
    const blob = new Blob([code ?? ''], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'index.html';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}
  return (
    <div className='p-2 shadow rounded-xl w-full flex items-center justify-between'>
        <div className='flex gap-2'>
            <Button className={`${selectedScreenSize=='web'?'border-primary':null}`}
            variant={'ghost'} onClick={()=>setSelectedScreenSize('web')} >
                <Monitor/>
            </Button>
            <Button onClick={()=>setSelectedScreenSize('mobile')} className={`${selectedScreenSize=='mobile'?'border-primary':null}`} variant={'ghost'} >
                <TabletSmartphone/>
            </Button>
        </div>
        <div className='flex gap-1'>
            <Button variant={'outline'} onClick={()=>viewInNewTab()}>View<SquareArrowUpRight/></Button>
            <ViewCodeBlock code={code}>
            <Button>Code<Code2Icon/></Button>
            </ViewCodeBlock>

            <Button onClick={downloadCode}>Download<Download/></Button>
        </div>
    </div>
  )
}

export default WebPageTools