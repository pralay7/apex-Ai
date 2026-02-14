import { db } from "@/db";
import { chatTable, frametable, projectsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
//import { PUT } from "../chats/route";

export async function GET(req:NextRequest) {
    const{searchParams}=new URL(req.url)
    //In TypeScript, the req object (usually of type Request) has a url property which is a string. The URL constructor parses that string into a structured object containing parts like the hostname, pathname, and search parameters
    const frameId= searchParams.get('frameId')

    try {
        //@ts-ignore
        const frameResult= await db.select().from(frametable).where(eq(frametable.frameId,frameId))
        //@ts-ignore
        const chatResult = await db.select().from(chatTable).where(eq(chatTable.frameId,frameId))

        const result={
            ...frameResult[0],
            chatMessages:chatResult[0]?.chatMessages||[]
        }

        return NextResponse.json(result)
    } catch (error) {
       return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown Error" })
    }
}

export async function PUT(req:NextRequest) {
    //const{frameId,projectId,generatedCode}= await req.json();
    try {
        const{frameId,projectId,generatedCode}= await req.json();

        await db.update(frametable).set({
          designeCode:generatedCode  
        }).where(and(eq(projectId,frametable.projectId), eq(frameId,frametable.frameId)))

        return NextResponse.json({message:"updated"})
    } catch (error) {
        return NextResponse.json(
        { error: error instanceof Error ? error.message : "Unknown Error" })
    }
}