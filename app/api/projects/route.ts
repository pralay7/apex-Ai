import { db } from "@/db";
import { chatTable, frametable, projectsTable, usersTable } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const {messages,projectId,frameId,credits}=await req.json();
    const {has}=await auth()
        const hasUnlimiteAcess = has&&has({plan:'unlimited'})

    const user= await currentUser()
    //why do i need to use await in next but didnt in react ?
// Your function runs immediately when the request hits the server. The body (the data) is likely still being transmitted over the network in chunks (a ReadableStream).
// req.json() is the command that says: "Listen to the incoming stream, wait for all the chunks to arrive, and then combine them into a JSON object."
// Because "waiting for chunks to arrive" takes time, it is a Promise, and you must await it.

    //create project
    const projectResult= await db.insert(projectsTable).values({
        projectId:projectId,
        createdBy:user?.primaryEmailAddress?.emailAddress
    })

    ////create frame
    const frameResult= await db.insert(frametable).values({
        frameId:frameId,
        projectId:projectId
    })
    if(!hasUnlimiteAcess && credits<=0){
        const result= await db.update(usersTable).set({credits:credits-1}).where(eq(usersTable.email,user?.primaryEmailAddress?.emailAddress))
    }

    // save user msg
    const chatResult = await db.insert(chatTable).values({
      createdBy:user?.primaryEmailAddress?.emailAddress,
      frameId:frameId,
      chatMessages:messages
    })
    return NextResponse.json({messages,projectId,frameId})
}