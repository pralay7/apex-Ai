import { db } from "@/db";
import { chatTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req:NextRequest) {
    const{messages,frameId}= await req.json()

    const result= await db.update(chatTable).set({
        chatMessages:messages
    }).where(eq(chatTable.frameId,frameId))
    return NextResponse.json({result:'updated'})
}