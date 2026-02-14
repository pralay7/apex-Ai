import React, { useContext, useEffect, useRef, useState } from 'react'
import WebPageTools from './WebPageTools';
import SettingSection from './SettingSection';
import ImageSettingSection from './ImageSettingSection';
import { OnSaveContext } from '@/context/OnSaveContext';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
type Props={
  generatedCode:string
}
const HTML=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
    <title>AI Website Builder</title>

    <script src="https://cdn.tailwindcss.com"></script>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/
flowbite.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/
flowbite.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-
awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+zQj+Mj7Vp7k8E5x29nLNX6j+CWeN/
Xg7fGqOpM8R1+a5/fQ1fJb01Tz2uE5wP5yQ5uI5uA==" crossorigin="anonymous"
referrerpolicy="no-referrer" />


<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
</head>
<body id="root">
</body>
</html>`
const WebsiteDesigne = ({generatedCode}:Props) => {
  const{projectId}=useParams()
  const params= useSearchParams();
  const frameId = params.get('frameId');
  const[selectedScreenSize,setSelectedScreenSize]=useState<string>('web');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedEl,setSelectedEl]=useState<HTMLElement>();
  const{onSave,setOnSave}=useContext(OnSaveContext);
  // Initialize iframe shell once
  useEffect(() => {
    //if (!iframeRef.current) return;
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(HTML);
    doc.close();

    let hoverEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      console.log("hover1")
        if (selectedEl) return;
        console.log("hover2")
        const target = e.target as HTMLElement;
        //if ( target.id === 'root' || target.tagName === 'HTML') return;
        console.log("hover3")
        if (hoverEl && hoverEl !== target) {
            hoverEl.style.outline = "";
        }
        console.log("hover4")
        hoverEl = target;
        hoverEl.style.outline = "2px dotted blue";
        e.stopPropagation();
    };

    const handleMouseOut = (e: MouseEvent) => {
      console.log("hover out1")
        if (selectedEl) return;
        if (hoverEl) {
            hoverEl.style.outline = "";
            hoverEl = null;
            console.log("removed hover")
        }
    };

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target as HTMLElement;
        
        if (selectedEl && selectedEl !== target ) {
            selectedEl.style.outline = "";
            selectedEl.removeAttribute("contenteditable");
        }

        selectedEl = target;
        selectedEl.style.outline = "2px solid red";
        selectedEl.setAttribute("contenteditable", "true");
        selectedEl.focus();
        console.log("Selected element:", selectedEl);
        setSelectedEl(selectedEl)
    };

    const handleBlur = () => {
        if (selectedEl) {
            console.log("Final edited element:", selectedEl.outerHTML);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("1")
        if (e.key === "Escape" && selectedEl) {
                console.log("2")
            selectedEl.style.outline = "";
            selectedEl.removeAttribute("contenteditable");
            selectedEl.removeEventListener("blur", handleBlur);
            console.log("handle down key" ,selectedEl);
            selectedEl = null;
        }
    };

    doc.body?.addEventListener("mouseover", handleMouseOver);
    doc.body?.addEventListener("mouseout", handleMouseOut);
    doc.body?.addEventListener("click", handleClick);
    doc?.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
        doc.body?.removeEventListener("mouseover", handleMouseOver);
        doc.body?.removeEventListener("mouseout", handleMouseOut);
        doc.body?.removeEventListener("click", handleClick);
        doc?.removeEventListener("keydown", handleKeyDown);
    };
}, []);
  // Update body only when code changes

  const onSaveCode = async() => {
  if (iframeRef.current) {
    try {
      const iframeDoc = iframeRef.current.contentDocument 
        || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        {
          const cloneDoc = iframeDoc.documentElement.cloneNode(true) as HTMLElement;

          const AllEls = cloneDoc.querySelectorAll<HTMLElement>("*");
          AllEls.forEach((el) => {
            el.style.outline = '';
            el.style.cursor = '';
          });

          const html = cloneDoc.outerHTML;
          console.log("HTML to save", html);
          
          const result = await axios.put('/api/frame',
            {
                frameId:frameId,
                projectId:projectId,
                generatedCode:html
            }
          )
          toast.success("Saved successfully")
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    const root = doc.getElementById("root");
    if (root) {
      root.innerHTML = 
        generatedCode
          ?.replaceAll("```html", "")
          .replaceAll("```", "")
          .replace("html", "") ?? "";
    }
  }, [generatedCode]);
  useEffect(()=>{
    onSave&& onSaveCode()
  },[onSave])

  return (
    <div className='flex gap-2 w-full'>
      <div className='p-3 w-full flex items-center flex-col'>
      <iframe
      ref={iframeRef}
      className={`${selectedScreenSize=='web'?'w-full':'w-125'} h-[85vh] border rounded flex flex-col`}
      sandbox="allow-scripts allow-same-origin"
    />
    <WebPageTools generatedCode={generatedCode} selectedScreenSize={selectedScreenSize} setSelectedScreenSize={setSelectedScreenSize}/>
    </div>
    {/* @ts-ignore */}

    
    {selectedEl?.tagName=="IMG"?<ImageSettingSection selectedEl={selectedEl}/>:<SettingSection selectedEl={selectedEl} clearSelection={setSelectedEl}/>
}
    </div>
    
    
  );

}

export default WebsiteDesigne