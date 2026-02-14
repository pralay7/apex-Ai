import React from 'react'
//@ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
const ViewCodeBlock= ({children, code}:any) => {

    const handleCopy=async()=>{
        await navigator.clipboard.writeText(code)
        toast.success('code copied')
    }

  return (
    <Dialog>
  <DialogTrigger>{children}</DialogTrigger>
  <DialogContent className='min-w-5xl max-h-105 overflow-auto flex'>
    <DialogHeader className=''>
      <DialogTitle className='flex gap-3 items-center'>Source Code<div><Button onClick={handleCopy}><Copy/></Button></div></DialogTitle>
      
      <DialogDescription className='flex overflow-y-auto'>
        <div  >
            <SyntaxHighlighter>

        {code}
            </SyntaxHighlighter>

        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default ViewCodeBlock;