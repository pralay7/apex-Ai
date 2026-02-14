import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {    
    //if user exists
   try{ const user= await currentUser();
    //@ts-ignore
    const userResult = await db.select().from(usersTable).where(eq(usersTable.email,user?.primaryEmailAddress?.emailAddress)) ;
    // if user doest exist a
    if(userResult?.length===0){
        const data={
             name:user?.fullName??'NA',
            email:user?.primaryEmailAddress?.emailAddress??'',
            credit:2
        }
        const result = await db.insert(usersTable).values({
            ...data
        });
        return NextResponse.json({user:userResult[0]});
    }
    return NextResponse.json({user:userResult[0]})}
    catch(error){
        console.log(error)

    }
}   